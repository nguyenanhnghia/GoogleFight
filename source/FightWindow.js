enyo.kind({
	name: "GoogleFight.FightWindow",
	kind: enyo.VFlexBox,
	published: {
		drawingOption: true // property to get the drawing option from user
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
	            {kind: enyo.RoundedInput, name: "firstFighter", width: "400px", autoCapitalize: "lowercase"}
	        ]},
	        {flex: 1},
	        {kind: enyo.RowGroup, caption: "Second Fighter", layoutKind: enyo.HFlexLayout, components: [
   	            {kind: enyo.RoundedInput, name: "secondFighter", width: "400px", autoCapitalize: "lowercase"}
   	        ]},
	        {flex: 1}
        ]},
	    {kind: enyo.HFlexBox, pack: "justify", components: [
            {flex: 1},
            {kind: enyo.ActivityButton, name: "fightButton", className: "enyo-button-dark",  
            	onclick: "getFighting", width: "200px", caption: "Fight"},
            {flex: 1}
	    ]},
	    //{kind: "GoogleFight.DrawingCanvas", name: "drawingCanvas", onFinish: "finishDrawing"}
	    {kind: enyo.Scroller, flex: 1, components: [
	        {kind: enyo.HFlexBox, pack: "center", style: "padding-top: 50px; padding-bottom: 50px", components: [
	            {kind: enyo.WebView, width: "800px", name: "showCharts"}
	        ]}
	    ]}
	],
	// Begin of clicking fight button
    getFighting: function() {
    	// Get the input values from user
    	this.firstFighterName = this.trimString(this.$.firstFighter.getValue());
    	this.secondFighterName = this.trimString(this.$.secondFighter.getValue());
 	   
    	// Check the inputs
 	   	if(this.firstFighterName == undefined || this.firstFighterName == ""
 	   		|| this.secondFighterName == undefined || this.secondFighterName == "") {
 	   		this.showPopupWithContent("Unable to setup fighting. Please enter your fighters.")
 	   	} else {
 	   		this.$.fightButton.setActive(true);
 	   		this.$.fightButton.setDisabled(true);
 	   		this.$.fightButton.setCaption("Fighting...");
 	   		
 	   		//this.$.drawingCanvas.setFirstFighterName(firstFighterName);
 	   		//this.$.drawingCanvas.setSecondFighterName(secondFighterName);
 	   		
 	   		this.firstUrl = "http://www.google.com/search?q=" + this.firstFighterName + "&nomo=1";
 	   		this.secondUrl = "http://www.google.com/search?q=" + this.secondFighterName + "&nomo=1";
 	   		
 	   		// Call first Ajax
 	   		this.$.getFirstResult.setUrl(this.firstUrl);
 	   		this.$.getFirstResult.call();
 	   	}
    },
    getFirstResultSuccess: function(inSender, inResponse, inRequest) {
    	if(inResponse != null) {
    		var tempString1 = inResponse.substring(inResponse.indexOf("resultStats>") + 18, inResponse.indexOf("<nobr>"));
    		if(tempString1.indexOf("results") == -1) {
	    		this.firstFighterResult = 0;
	    		//this.$.drawingCanvas.setFirstFighterResultString("0");
    		} else {
    			this.firstFighterResult = tempString1.substring(0, tempString1.indexOf(" ")).replace(/^\s*/, "").replace(/\s*$/, "");
    			this.org1 = this.firstFighterResult;
	    		for(var i = 0; i < this.firstFighterResult.length; i++)
	    			this.firstFighterResult = this.firstFighterResult.replace(",", "");
	    		
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
    			//this.$.drawingCanvas.setSecondFighterResultString("0");
    		}
    		else {
    			this.secondFighterResult = tempString2.substring(0, tempString2.indexOf(" ")).replace(/^\s*/, "").replace(/\s*$/, "");
    			this.org2 = this.secondFighterResult;
	    		for(var i = 0; i < this.secondFighterResult.length; i++)
	    			this.secondFighterResult = this.secondFighterResult.replace(",", "");
    		}
    		this.secondFighterResult = parseInt(this.secondFighterResult);
    		this.calculate();
    	} else {
    		this.getSecondResultFailed();
    	}
    },
    getSecondResultFailed: function() {
    	this.showPopupWithContent("Unable to get results. Please check your internet connection or try again!")
    },
    calculate: function() {
    	var max1, max2, per1, per2;
    	if(this.firstFighterResult == 0 && this.secondFighterResult == 0) {
    		max1 = max2 = 200;
    		per1 = per2 = 50;
    	} else {
			total = this.firstFighterResult + this.secondFighterResult;
			max1 = Math.floor((this.firstFighterResult / total) * 350);
			max2 = Math.floor((this.secondFighterResult / total) * 350);
			per1 = Math.floor((this.firstFighterResult / total) * 100);
			per2 = 100 - per1;
    	}
    	
    	if(this.firstFighterName.length > 20)
			this.firstFighterName = this.firstFighterName.substring(0, 20) + "...";
		
		if(this.secondFighterName.length > 20)
			this.secondFighterName = this.secondFighterName.substring(0, 20) + "...";
		
		var barChartUrl = "http://chart.apis.google.com/chart?chxt=y&chbh=a,200&chs=800x300&cht=bvg&chco=FF0000,76A4FB&chd=t:" 
			+ per1 + "|" + per2 + "&chdl=" + this.firstFighterName + " (" + this.org1 + ")|" 
			+ this.secondFighterName + " (" + this.org2 + ")" + "&chdlp=t&chma=|15";
    	
    	var pieChartUrl = "http://chart.apis.google.com/chart?chxs=0,000000,25&chs=800x300&cht=p3&chco=FF0000,76A4FB&chd=t:" 
    		+ per1 + "," + per2 + "&chdl=" + this.firstFighterName + "|" + this.secondFighterName + "&chdlp=t&chl=" 
    		+ this.org1 + " (" + per1 + "%)|" + this.org2 + " (" + per2 + "%)";
    	
    	if(this.drawingOption)
    		this.$.showCharts.setUrl(barChartUrl);
    	else
    		this.$.showCharts.setUrl(pieChartUrl);
    	this.refreshFightButton();
		
		//this.$.drawingCanvas.setMaxHeight1(max1);
		//this.$.drawingCanvas.setMaxHeight2(max2);
		//this.$.drawingCanvas.setFirstPercent(per1);
		//this.$.drawingCanvas.setSecondPercent(per2);

		//this.$.drawingCanvas.startPieChartAnimation();
    },
    finishDrawing: function() {
    	this.refreshFightButton();
    },
    showPopupWithContent: function(content) {
    	this.$.failurePopup.openAtCenter();
    	this.$.failureText.setContent(content);
    },
    closeFailurePopup: function() {
    	this.$.failurePopup.close();
    	this.refreshFightButton();
    },
    refreshFightButton: function() {
    	this.$.fightButton.setActive(false);
		this.$.fightButton.setDisabled(false);
		this.$.fightButton.setCaption("Fight");
    },
    trimString: function(stringToTrim) {
    	return stringToTrim.replace(/^\s*/, "").replace(/\s*$/, "");
    }
});