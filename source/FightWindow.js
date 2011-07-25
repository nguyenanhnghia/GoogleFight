enyo.kind({
	name: "GoogleFight.FightWindow",
	kind: enyo.VFlexBox,
	published: {
		drawingOption: 0, // property to get the drawing option from user
		canvasWidth: 0,
		canvasHeight: 0
	},
	components: [
	    {kind: "WebService", name: "getFirstResult", onSuccess: "getFirstResultSuccess", onFailure: "getFirstResultFailed"},
	    {kind: "WebService", name: "getSecondResult", onSuccess: "getSecondResultSuccess", onFailure: "getSecondResultFailed"},
	    {kind: "Popup", name: "failurePopup", components: [
  	        {className: "popup-header", content: "Trouble Getting Result"},
  	        {className: "failure-text", components: [
  	            {name: "failureText"}
  	        ]},
  	        {kind: enyo.Button, caption: "OK", onclick: "closeFailurePopup", className: "enyo-button-affirmative"}
  	    ]},
	    {kind: enyo.HFlexBox, components: [
	        {flex: 1},
	        {kind: enyo.RowGroup, caption: "First Fighter", className: "rowgroup-text", layoutKind: enyo.HFlexLayout, components: [
	            {kind: enyo.RoundedInput, name: "firstFighter", autoCapitalize: "lowercase"}
	        ]},
	        {kind: enyo.ActivityButton, name: "fightButton", className: "fight-button",  
            	onclick: "getFighting", caption: "Fight"},
	        {kind: enyo.RowGroup, caption: "Second Fighter", layoutKind: enyo.HFlexLayout, components: [
   	            {kind: enyo.RoundedInput, name: "secondFighter", autoCapitalize: "lowercase"}
   	        ]},
	        {flex: 1}
        ]},
	    {kind: "GoogleFight.DrawingCanvas", name: "drawingCanvas", onFinish: "finishDrawing"}
	],
	// Begin of clicking fight button
    getFighting: function() {
    	// Clear canvas for next fight
    	this.$.drawingCanvas.clearCanvas();
    	
    	// Get the input values from user
    	this.firstFighterName = this.trimString(this.$.firstFighter.getValue());
    	this.secondFighterName = this.trimString(this.$.secondFighter.getValue());
 	   
    	// Check the inputs
 	   	if(this.firstFighterName == undefined || this.firstFighterName == ""
 	   		|| this.secondFighterName == undefined || this.secondFighterName == "") {
 	   		//this.showPopupWithContent("Unable to setup fighting. Please enter your fighters.");
 	   	} else {
 	   		// Format the fight button to active
			this.setFightActive();
			
			// Url for get calling Ajax
			this.firstUrl = "http://www.google.com/search?q=" + this.firstFighterName + "&nomo=1";
			this.secondUrl = "http://www.google.com/search?q=" + this.secondFighterName + "&nomo=1";
			
			// Call first Ajax
			this.$.getFirstResult.setUrl(this.firstUrl);
			this.$.getFirstResult.call();
 	   	}
    },
    /* Function to get the result from first Ajax call
     * If this call failed, then stop to show failure popup
     */
    getFirstResultSuccess: function(inSender, inResponse, inRequest) {
    	if(inResponse != null) {
    		var tempString1 = inResponse.substring(inResponse.indexOf("resultStats>") + 18, inResponse.indexOf("<nobr>"));
    		// Check if there is a result
    		if(tempString1.indexOf("results") == -1) {
	    		this.firstFighterResult = 0;
	    		this.$.drawingCanvas.setResult1("");
    		} else {
    			// Remove 'results' string and comma
    			this.firstFighterResult = tempString1.substring(0, tempString1.indexOf(" ")).replace(/^\s*/, "").replace(/\s*$/, "");
    			this.$.drawingCanvas.setResult1(this.firstFighterResult);
	    		for(var i = 0; i < this.firstFighterResult.length; i++)
	    			this.firstFighterResult = this.firstFighterResult.replace(",", "");
	    		
	    		// Convert the first result to integer
	    		this.firstFighterResult = parseInt(this.firstFighterResult);
    		}
    		// Call second Ajax
    		this.$.getSecondResult.setUrl(this.secondUrl);
 	   		this.$.getSecondResult.call();
    	} else
    		this.getFirstResultFailed();
    },
    getFirstResultFailed: function() {
    	this.showPopupWithContent("Unable to get results. Please check your internet connection or try again!")
    },
    getSecondResultSuccess: function(inSender, inResponse, inRequest) {
    	if(inResponse != null) {
    		var tempString2 = inResponse.substring(inResponse.indexOf("resultStats>") + 18, inResponse.indexOf("<nobr>"));
    		if(tempString2.indexOf("results") == -1) {
    			this.secondFighterResult = 0;
    			this.$.drawingCanvas.setResult2("");
    		}
    		else {
    			this.secondFighterResult = tempString2.substring(0, tempString2.indexOf(" ")).replace(/^\s*/, "").replace(/\s*$/, "");
    			this.$.drawingCanvas.setResult2(this.secondFighterResult);
	    		for(var i = 0; i < this.secondFighterResult.length; i++)
	    			this.secondFighterResult = this.secondFighterResult.replace(",", "");
	    		
	    		this.secondFighterResult = parseInt(this.secondFighterResult);
    		}
    		this.calculate();
    	} else {
    		this.getSecondResultFailed();
    	}
    },
    getSecondResultFailed: function() {
    	this.showPopupWithContent("Unable to get results. Please check your internet connection or try again!")
    },
    calculate: function() {
    	var max1, max2, per1, per2; // properties for drawing
    	if(this.firstFighterResult == 0 && this.secondFighterResult == 0) {
    		max1 = max2 = (this.canvasHeight - 100) / 2;
    		per1 = per2 = 50;
    	} else {
    		// Calculate percentage of 2 fighters
			total = this.firstFighterResult + this.secondFighterResult;
			max1 = Math.floor((this.firstFighterResult / total) * (this.canvasHeight - 100));
			max2 = Math.floor((this.secondFighterResult / total) * (this.canvasHeight - 100));
			per1 = Math.floor((this.firstFighterResult / total) * 100);
			per2 = 100 - per1;
    	}
    	
    	// Format the name of 2 fighters if they are longer than 20 characters
    	if(this.firstFighterName.length > 20)
			this.firstFighterName = this.firstFighterName.substring(0, 20) + "...";
		if(this.secondFighterName.length > 20)
			this.secondFighterName = this.secondFighterName.substring(0, 20) + "...";
		
		// Pass canvas width and height to drawing canvas
		this.$.drawingCanvas.setCanWidth(this.canvasWidth);
		this.$.drawingCanvas.setCanHeight(this.canvasHeight);
		
		// Pass the fighter names to drawing canvas
		this.$.drawingCanvas.setName1(this.firstFighterName);
		this.$.drawingCanvas.setName2(this.secondFighterName);
		
		// Pass percentage to drawing canvas
		this.$.drawingCanvas.setPercentage1(per1);
		this.$.drawingCanvas.setPercentage2(per2);
		
		// Pass max height to drawing canvas
		this.$.drawingCanvas.setMaxHeight1(max1);
		this.$.drawingCanvas.setMaxHeight2(max2);
    	
    	// Draw charts following user's drawing option
		this.$.drawingCanvas.stopAnimation();
    	if(this.drawingOption == 0)
    		this.$.drawingCanvas.startBarChartAnimation();
    	else
    		this.$.drawingCanvas.startPieChartAnimation();
    },
	//alarm when Google Fight don't search any results
    showPopupWithContent: function(content) {
    	this.$.failurePopup.openAtCenter();
    	this.$.failureText.setContent(content);
    },
    closeFailurePopup: function() {
    	this.$.failurePopup.close();
    	this.setFightDeactive();
    },
    finishDrawing: function() {
    	this.setFightDeactive();
    },
    setFightActive: function() {
    	this.$.fightButton.setActive(true);
		this.$.fightButton.setDisabled(true);
		this.$.fightButton.setCaption("Fighting...");
    },
    setFightDeactive: function() {
    	this.$.fightButton.setActive(false);
		this.$.fightButton.setDisabled(false);
		this.$.fightButton.setCaption("Fight");
    },
    trimString: function(stringToTrim) {
    	return stringToTrim.replace(/^\s*/, "").replace(/\s*$/, "");
    }
});