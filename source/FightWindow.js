enyo.kind({
	name: "GoogleFight.FightWindow",
	kind: enyo.VFlexBox,
	components: [
	    {kind: "WebService", name: "getFirstResult", onSuccess: "getFirstResultSuccess", onFailure: "getFirstResultFailed"},
	    {kind: "WebService", name: "getSecondResult", onSuccess: "getSecondResultSuccess", onFailure: "getSecondResultFailed"},
	    {kind: enyo.HFlexBox, components: [
	        {flex: 1},
	        {kind: enyo.RowGroup, caption: "First Fighter", layoutKind: enyo.HFlexLayout, components: [
	            {kind: enyo.Input, name: "firstFighter", width: "400px", autoCapitalize: "lowercase"}
	        ]},
	        {flex: 1},
	        {kind: enyo.RowGroup, caption: "Second Fighter", layoutKind: enyo.HFlexLayout, components: [
   	            {kind: enyo.Input, name: "secondFighter", width: "400px", autoCapitalize: "lowercase"}
   	        ]},
	        {flex: 1}
        ]},
	    {kind: enyo.HFlexBox, pack: "justify", components: [
            {flex: 1},
            {kind: enyo.ActivityButton, name: "fightButton", className: "enyo-button-dark",  
            	onclick: "getFighting", width: "200px", caption: "Fight"},
            {flex: 1}
	    ]},
	    {kind: "GoogleFight.DrawingCanvas", name: "drawingCanvas", onFinish: "finishDrawing"}
	],
    getFighting: function() {
    	var firstFighterName = this.trimString(this.$.firstFighter.getValue());
    	var secondFighterName = this.trimString(this.$.secondFighter.getValue());
 	   
 	   	if(firstFighterName == undefined || firstFighterName == ""
 	   		|| secondFighterName == undefined || secondFighterName == "") {
 	   		this.$.fightButton.setActive(false);
 	   	} else {
 	   		this.$.fightButton.setActive(true);
 	   		this.$.fightButton.disabled = true;
 	   		
 	   		this.$.drawingCanvas.setFirstFighterName(firstFighterName);
 	   		this.$.drawingCanvas.setSecondFighterName(secondFighterName);
 	   		
 	   		this.firstUrl = "http://www.google.com/search?q=" + firstFighterName + "&nomo=1";
 	   		this.secondUrl = "http://www.google.com/search?q=" + secondFighterName + "&nomo=1";
 	   		
 	   		// Call first Ajax
 	   		this.$.getFirstResult.setUrl(this.firstUrl);
 	   		this.$.getFirstResult.call();
 	   	}
    },
    getFirstResultSuccess: function(inSender, inResponse, inRequest) {
    	if(inResponse != null) {
    		var tempString1 = inResponse.substring(inResponse.indexOf("resultStats>") + 18, inResponse.indexOf("<nobr>"));
    		this.firstFighterResult = tempString1.substring(0, tempString1.indexOf(" ")).replace(/^\s*/, "").replace(/\s*$/, "");
    		this.$.drawingCanvas.setFirstFighterResultString(this.firstFighterResult);
    		
    		for(var i = 0; i < this.firstFighterResult.length; i++)
    			this.firstFighterResult = this.firstFighterResult.replace(",", "");
    		
    		this.firstFighterResult = parseInt(this.firstFighterResult);
    		
    		// Call second Ajax
    		this.$.getSecondResult.setUrl(this.secondUrl);
 	   		this.$.getSecondResult.call();
    	} else {
    		this.getFirstResultFailed();
    	}
    },
    getFirstResultFailed: function() {
    },
    getSecondResultSuccess: function(inSender, inResponse, inRequest) {
    	if(inResponse != null) {
    		var tempString2 = inResponse.substring(inResponse.indexOf("resultStats>") + 18, inResponse.indexOf("<nobr>"));
    		this.secondFighterResult = tempString2.substring(0, tempString2.indexOf(" ")).replace(/^\s*/, "").replace(/\s*$/, "");
    		this.$.drawingCanvas.setSecondFighterResultString(this.secondFighterResult);
    		
    		for(var i = 0; i < this.secondFighterResult.length; i++)
    			this.secondFighterResult = this.secondFighterResult.replace(",", "");
    		
    		this.secondFighterResult = parseInt(this.secondFighterResult);
    		
    		this.calculateWidth();
    	} else {
    		this.getSecondResultFailed();
    	}
    },
    getSecondResultFailed: function() {
    },
    calculateWidth: function() {
		var total = this.firstFighterResult + this.secondFighterResult;
		var max1 = Math.floor((this.firstFighterResult / total) * 350);
		var max2 = Math.floor((this.secondFighterResult / total) * 350);
		var per1 = Math.floor((this.firstFighterResult / total) * 100);
		var per2 = 100 - per1;
		
		this.$.drawingCanvas.setMaxHeight1(max1);
		this.$.drawingCanvas.setMaxHeight2(max2);
		this.$.drawingCanvas.setFirstPercent(per1);
		this.$.drawingCanvas.setSecondPercent(per2);

		this.$.drawingCanvas.startPieChartAnimation();
    },
    finishDrawing: function() {
    	this.$.fightButton.setActive(false);
		this.$.fightButton.disabled = false;
    },
    trimString: function(stringToTrim) {
    	return stringToTrim.replace(/^\s*/, "").replace(/\s*$/, "");
    }
});