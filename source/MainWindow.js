enyo.kind({
	name: "GoogleFight.MainWindow",
	kind: enyo.VFlexBox,
	components: [
	    {kind: "ApplicationEvents", onWindowRotated: "resizeComponents"},
        {kind: enyo.Menu, name: "optionMenu", showHideMode: "transition",
        	openClassName: "scaleIn", className: "transitioner3", style:"width:200px; height:120px;",layoutKind: enyo.VFlexLayout, components: [
			{content: "Drawing Options", className: "popup-header"},
			{kind: "RadioGroup", components: [
				{label:"Bar Chart", name: "cbBarChart", value:0, onclick: "setBarChart"},
				{label:"Pie Chart", name: "cbPieChart", value:1, onclick: "setPieChart"}
			]}
		]},
		{kind: enyo.Popup, name: "sharePopup", showHideMode: "transition", openClassName: "fadeIn", 
			className: "fadedOut", components: [
			{kind: enyo.Button, caption: "Close", className: "enyo-button-affirmative", popupHandler: true}
		]},
		{kind: enyo.HFlexBox, className: "googlefight-header", components: [
			{flex: 1},
			{content: "GOOGLE ", align: "center", style: "color: white;"},
			{content: "FIGHT", align: "center", style: "color: black;"},
			{flex: 1}
		]},
        {name: "mainWindow", kind: "Pane", flex: 1, components: [
            {kind: "GoogleFight.FightWindow", name: "fightWindow", className: "googlefight-body"},
	        {kind: "GoogleFight.OptionWindow", name: "optionWindow", onSelectFight: "makeFight", className: "googlefight-body"},
			{kind: "GoogleFight.ShareWindow", name: "shareWindow", className: "googlefight-body"}
        ]},
		
        {kind: enyo.Toolbar, pack: "justify", components: [
	        {kind: enyo.ToolButton, name: "optionButton", onclick: "openOption", caption: "Option"},
	        {flex: 1},
            {kind: enyo.RadioToolButtonGroup, flex: 2, components: [
                {label: "Home", name: "lbHome", icon: "images/home.png", onclick:"goHome"},
                {label: "Fights", name: "lbFights", icon: "images/fight.png", onclick:"goFight"},
            ]},
            {flex: 1},
			{kind: enyo.ToolButton, name: "shareButton", onclick: "goShare", caption: "Share"}
        ]},
        {kind: "AppMenu", components: [
  			{kind: "EditMenu"},
  	        {caption: "Preference"}
  	 	]}
	],
	// After the application completed launching, set to fight view
	create: function(launchParams) {
		this.inherited(arguments);
		this.resizeComponents();
		this.goHome();
	},
	// Function for clicking in Home radio button
	goHome: function() {
		this.$.mainWindow.selectViewByName("fightWindow");
	},
	// Custom fuction for listening to the event from option window (User chose a fight in the list)
	makeFight: function() {
		this.goHome();
		this.resetRadioButton(this.$.lbHome, this.$.lbFights, this.$.lbShare);
		this.$.fightWindow.$.firstFighter.setValue(this.$.optionWindow.first);
		this.$.fightWindow.$.secondFighter.setValue(this.$.optionWindow.second);
		this.$.fightWindow.getFighting();
	},
	// Set to option window view
	goFight: function() {
		this.$.mainWindow.selectViewByName("optionWindow");
		this.resetRadioButton(this.$.lbFights, this.$.lbHome, this.$.lbShare);
	},
	// Set to share window view
	goShare: function(inSender, inEvent) {
		this.$.sharePopup.openAroundControl(inSender, null, "right");
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
	resetRadioButton: function(btn1, btn2, btn3) {
		btn1.setDepressed(true);
		btn2.setDepressed(false);
		btn3.setDepressed(false);
	},
	// Resize components for landscape or portrait
	resizeComponents: function() {
		if(enyo.getWindowOrientation() == "right" || enyo.getWindowOrientation() == "left") {
			this.$.fightWindow.$.firstFighter.setClassName("landscape-input");
			this.$.fightWindow.$.secondFighter.setClassName("landscape-input");
			this.$.fightWindow.setCanvasWidth(760);
			this.$.fightWindow.setCanvasHeight(650);
		} else {
			this.$.fightWindow.$.firstFighter.setClassName("portrait-input");
			this.$.fightWindow.$.secondFighter.setClassName("portrait-input");
			this.$.fightWindow.setCanvasWidth(1020);
			this.$.fightWindow.setCanvasHeight(450);
		}
		this.$.fightWindow.$.drawingCanvas.stopAnimation();
		this.$.fightWindow.getFighting();
	}
});
