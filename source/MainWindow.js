enyo.kind({
	name: "GoogleFight.MainWindow",
	kind: enyo.VFlexBox,
	components: [
	    {kind: "ApplicationEvents", onWindowRotated: "resizeComponents"},
        {kind: enyo.Menu, name: "optionMenu", showHideMode: "transition",
        	openClassName: "scaleIn", className: "transitioner3", layoutKind: enyo.VFlexLayout, components: [
			{content: "Drawing Options", className: "popup-header"},
			{kind: enyo.HFlexBox, components: [
			    {kind: enyo.CheckBox, name: "cbBarChart", checked: true, onChange: "setBarChart"},
			    {content: "Bar chart"}
			]},
			{kind: enyo.HFlexBox, components: [
			    {kind: enyo.CheckBox, name: "cbPieChart", checked: false, onChange: "setPieChart"},
			    {content: "Pie chart"}
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
	        {kind: "GoogleFight.OptionWindow", name: "optionWindow", onSelectFight: "makeFight", className: "googlefight-body"},
			{kind: "GoogleFight.ShareWindow", name: "shareWindow", className: "googlefight-body"}
        ]},
		
        {kind: enyo.Toolbar, pack: "justify", components: [
	        {kind: enyo.ToolButton, name: "optionButton", onclick: "openOption", caption: "Option"},
	        {flex: 1},
            {kind: enyo.RadioToolButtonGroup, components: [
                {label: "Home", name: "lbHome", icon: "images/home.png", onclick:"goHome"},
                {label: "Fights", name: "lbFights", icon: "images/fight.png", onclick:"goFight"},
                {label: "Share", name: "lbShare", icon: "images/share.png", onclick: "goShare"}
            ]},
            {flex: 1},
        ]},
        {kind: "AppMenu", components: [
  			{kind: "EditMenu"},
  	        {caption: "Preference"}
  	 	]}
	],
	// After the application completed laucnching, set to fight view
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
	},
	// Set to option window view
	goFight: function() {
		this.$.mainWindow.selectViewByName("optionWindow");
		this.resetRadioButton(this.$.lbFights, this.$.lbHome, this.$.lbShare);
	},
	// Set to share window view
	goShare: function(){
		this.$.mainWindow.selectViewByName("shareWindow");
		this.resetRadioButton( this.$.lbShare,this.$.lbHome, this.$.lbFights);
	},
	// Open the drawing option popup
	openOption: function(inSender, inEvent) {
		this.$.optionMenu.openAtEvent(inEvent);
	},
	// Listener of 'onChange' of first checkbox
	setBarChart: function(inSender) {
		if(inSender.getChecked())
			this.$.cbPieChart.setChecked(false);
		else 
			this.$.cbPieChart.setChecked(true);
		this.$.fightWindow.setDrawingOption(inSender.getChecked());
	},
	// Listener of 'onChange' of second checkbox
	setPieChart: function(inSender) {
		if(inSender.getChecked())
			this.$.cbBarChart.setChecked(false);
		else 
			this.$.cbBarChart.setChecked(true);
		this.$.fightWindow.setDrawingOption(!inSender.getChecked());
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
			this.$.fightWindow.$.box.setClassName("landscape-box");
			this.$.fightWindow.$.showCharts.setClassName("landscape-webview");
		} else {
			this.$.fightWindow.$.firstFighter.setClassName("portrait-input");
			this.$.fightWindow.$.secondFighter.setClassName("portrait-input");
			this.$.fightWindow.$.box.setClassName("portrait-box");
			this.$.fightWindow.$.showCharts.setClassName("portrait-webview");
		}
	}
});