enyo.kind({
	name: "GoogleFight.MainWindow",
	kind: enyo.VFlexBox,
	components: [
	    {kind: "ApplicationEvents", onWindowRotated: "resizeComponents"},
        {kind: enyo.Menu, name: "optionMenu", showHideMode: "transition",
        	openClassName: "fadeIn", className: "fadedOut popup-option", layoutKind: enyo.VFlexLayout, components: [
				{content: "Drawing Options", className: "popup-header"},
				{kind: "RadioToolButtonGroup", className: "option-group", components: [
					{label: "Bar Chart", name: "cbBarChart", value: 0, onclick: "setBarChart"},
					{label: "Pie Chart", name: "cbPieChart", value: 1, onclick: "setPieChart"}
				]}
		]},
		{kind: enyo.Popup, showHideMode: "transition", openClassName: "fadeIn", 
			className: "fadedOut", width: "320px", name: "sharePopup", components: [                                                                	
			    {
					//call mail service in order to send mail to anyone who user want to send
					name: "openEmailCall",
					kind: "PalmService",
					service: "palm://com.palm.applicationManager/",
					method: "open",
					onSuccess: "openEmailSuccess",
					onFailure: "openEmailFailure",
					subscribe: true
				},
				{
					//call browser service
				    name: "launchBrowserCall",
				    kind: "PalmService",
				    service: "palm://com.palm.applicationManager/",
				    method: "open",
				    subscribe: true
				},
				{
					//call sms service 
					name: "smsService", 
					kind: "PalmService", 
					service: "palm://com.palm.applicationManager/", 
					method: "launch"
				},
				{kind: enyo.BasicScoller, components:[	
					{kind: "VirtualRepeater", onSetupRow: "setupRow", components: [
					  {kind: "Item", tapHighlight: true, layoutKind: "HFlexLayout", onclick:"getService", components: [
						{kind: "ToolButton", name: "shareIcon"},
						{name: "shareTitle",style: "padding-top: 15px"}
					  ]}
					]},
				]}
		]},
		{kind: enyo.HFlexBox, className: "googlefight-header", components: [
			{flex: 1},
			{content: "GOOGLE ", align: "center", style: "color: white;"},
			{content: "FIGHT", align: "center", style: "color: black;"},
			{flex: 1}
		]},
        {name: "mainWindow", kind: "Pane", flex: 1, components: [
            {kind: "GoogleFight.FightWindow", name: "fightWindow", className: "googlefight-body"},
	        {kind: "GoogleFight.OptionWindow", name: "optionWindow", onSelectFight: "makeFight", className: "googlefight-body"}
        ]},
        {kind: enyo.Toolbar, pack: "justify", components: [
	        {kind: enyo.ToolButton, name: "optionButton", onclick: "openOption", caption: "Option"},
	        {flex: 1},
            {kind: enyo.RadioToolButtonGroup, className: "center-toolbuttons", flex: 2, components: [
                {label: "Home", name: "lbHome", icon: "images/home.png", onclick:"goHome"},
                {label: "Fights", name: "lbFights", icon: "images/fight.png", onclick:"goFight"},
                {label: "Share", name: "lbShare", icon: "images/share.png", onclick:"goShare"}
            ]},
            {flex: 1}
        ]},
        {kind: "AppMenu", components: [
  			{kind: "EditMenu"}
  	 	]}
	],
	dataShare:[
	   		{label: "Share on Facebook",iconPath: "images/facebook-32.png"}, 
	   		{label: "I Like",iconPath: "images/facebook-32.png"}, 
	   		{label: "Follow us on Twitter",iconPath: "images/twitter-32.png"}, 
	   		{label: "Share with a friend ",iconPath: "images/mail-32.png"}, 
	   		{label: "SMS to friend",iconPath: "images/messaging.png"} 
   	],
	// After the application completed launching, set to fight view
	create: function(launchParams) {
		this.inherited(arguments);
		this.resizeComponents();
		this.goHome();
	},
	getService: function(inEvent,inIndex){
		var r = inIndex.rowIndex;
		switch (r) {
			case 0: var myString =	"http:/\/\www.facebook.com/\#!/\pages/\ITS-On-Mobile/\138832106129186?ref=search";													
					this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": myString}});	
				break;
			case 1: var myString = "http:/\/\www.facebook.com/\#!/\pages/\ITS-On-Mobile/\138832106129186?ref=search";
					this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": myString}});
				break;
			case 2: var myString = "http:/\/\www.twitter.com/\itsonmobile";
					this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": myString}});
				break;
			case 3: //this.$.openEmailCall.call({"target": "mailto: holeeSmokes@batman.com"}); --call with method open
				var myString = "";
				var link = "<a href ='http://www.twitter.com/itsonmobile'>ITS_GoogleFight</a>";
				var a = this.$.fightWindow.$.drawingCanvas.getResult1();
				var b = this.$.fightWindow.$.drawingCanvas.getResult2();
				var c = this.$.fightWindow.$.drawingCanvas.getName1();
				var d = this.$.fightWindow.$.drawingCanvas.getName2();
				var e = this.$.fightWindow.$.drawingCanvas.getPercentage1()+"%";
				var f = this.$.fightWindow.$.drawingCanvas.getPercentage2()+"%";
				if(c==""||d=="")
					myString = link;
				else
					myString = "<p><span style='color: red'>" + c + "</span> VS <span style='color: red'>" + d + "</span></p>" 
						+ "<p><span style='color: red'>" + e + "</span> VS <span style='color: red'>" + f + "</span></p>" 
						+ "<p><span style='color: red'>" + a + "</span> VS <span style='color: red'>" + b + "</span></p>"
						+ "<p>" + link + "</p>";
				this.$.openEmailCall.call({ // -- call with method launch
					"id":"com.palm.app.email", 
					"params":{
	                   "summary":"Invitation on Google Fight",
	                   "text": myString,
	                   "recipients":[
	                    {
	                        "type":"email",
	                        "contactDisplay":"Mr Nicolas",
	                        "role":1,
	                        "value":"tli_test_palm@rocketmail.com"
	                     }]
							} });
				break;
			case 4: 
				this.$.smsService.call({ // -- call with method launch
					"id":"com.palm.app.messaging", 
					"params":{
						"recipients":[
					                    {
					                       "value":"tli_test_palm@rocketmail.com"
					                     }]
					} 
				});
				//var msgTextContent = "I want to play Google Fight with you : http://bit.ly/GooglefightwebOS";
				//	var paramsContent = {"contactDisplay" : msgTextContent};
				//	var parametersContent = {id :'com.palm.app.messaging', params : paramsContent};
				//	enyo.log(parametersContent); 
				//	this.$.smsService.call(parametersContent); //--call method launch
					//this.$.smsService.call({target: "sms:tli_test_palm@rocketmail.com"});
//					this.$.smsService.call({"target":"im:tli_test_palm@rocketmail.com"}); //--call method open
				break;
		}
	},
	setupRow: function(inSender, inIndex) {
	  var row = this.dataShare[inIndex];
	  if (row) {
		  this.$.shareIcon.setIcon(row.iconPath);
		  this.$.shareIcon.disabled = true;
		  this.$.shareTitle.setContent(row.label);
		  return true;
	  }
	},
	// Custom function for listening to the event from option window (User chose a fight in the list)
	makeFight: function() {
		this.goHome();
		this.$.fightWindow.$.firstFighter.setValue(this.$.optionWindow.first);
		this.$.fightWindow.$.secondFighter.setValue(this.$.optionWindow.second);
		this.$.fightWindow.getFighting();
	},
	// Function for clicking in Home radio button
	goHome: function() {
		this.$.mainWindow.selectViewByName("fightWindow");
		this.resetRadioButton(this.$.lbHome, this.$.lbFights);
		this.isHome = true;
		this.isFight = false;
	},
	// Set to option window view
	goFight: function() {
		this.$.mainWindow.selectViewByName("optionWindow");
		this.resetRadioButton(this.$.lbFights, this.$.lbHome);
		this.isHome = false;
		this.isFight = true;
	},
	// Open share popup
	goShare: function(inSender, inEvent) {
		inSender.setDepressed(false);
		this.$.sharePopup.openAroundControl(inSender, null, "left");
		if(this.isHome)
			this.resetRadioButton(this.$.lbHome, this.$.lbFights);
		if(this.isFight)
			this.resetRadioButton(this.$.lbFights, this.$.lbHome);
	},
	// Open the drawing option popup
	openOption: function(inSender, inEvent) {
		this.$.optionMenu.openAroundControl(inSender, null, "left");
	},
	// Listener of 'onChange' of first checkbox
	setBarChart: function(inSender) {
		this.$.fightWindow.setDrawingOption(inSender.getValue());
		this.$.fightWindow.$.drawingCanvas.stopAnimation();
		this.$.fightWindow.$.drawingCanvas.startBarChartAnimation();
	},
	// Listener of 'onChange' of second checkbox
	setPieChart: function(inSender) {
		this.$.fightWindow.setDrawingOption(inSender.getValue());
		this.$.fightWindow.$.drawingCanvas.stopAnimation();
		this.$.fightWindow.$.drawingCanvas.startPieChartAnimation();
	},
	// Function to reset the radio buttons to the right status
	resetRadioButton: function(btn1, btn2) {
		btn1.setDepressed(true);
		btn2.setDepressed(false);
	},
	// Resize components for landscape or portrait view
	resizeComponents: function() {
		if(enyo.getWindowOrientation() == "right" || enyo.getWindowOrientation() == "left") {
			this.$.fightWindow.$.firstFighter.setClassName("landscape-input");
			this.$.fightWindow.$.secondFighter.setClassName("landscape-input");
			this.$.fightWindow.setCanvasWidth(760);
			this.$.fightWindow.setCanvasHeight(700);
			this.$.fightWindow.$.drawingCanvas.setCanWidth(760);
			this.$.fightWindow.$.drawingCanvas.setCanHeight(700);
		} else {
			this.$.fightWindow.$.firstFighter.setClassName("portrait-input");
			this.$.fightWindow.$.secondFighter.setClassName("portrait-input");
			this.$.fightWindow.setCanvasWidth(1020);
			this.$.fightWindow.setCanvasHeight(500);
			this.$.fightWindow.$.drawingCanvas.setCanWidth(1020);
			this.$.fightWindow.$.drawingCanvas.setCanHeight(500);
		}
		
		if(this.$.fightWindow.$.drawingCanvas.getName1() != "" && this.$.fightWindow.$.drawingCanvas.getName2() != "") {
			this.$.fightWindow.$.drawingCanvas.stopAnimation();
			if(this.$.fightWindow.getDrawingOption() == 0)
				this.$.fightWindow.$.drawingCanvas.startBarChartAnimation();
			else
				this.$.fightWindow.$.drawingCanvas.startPieChartAnimation();
		}
	}
});
