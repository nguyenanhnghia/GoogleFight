enyo.kind({
	name: "GoogleFight.MainWindow",
	kind: enyo.VFlexBox,
	components: [
        {kind: enyo.Menu, name: "optionMenu", showHideMode: "transition",
        	openClassName: "scaleIn", className: "transitioner3", style:"width:200px; height:120px;",layoutKind: enyo.VFlexLayout, components: [
			{content: "Drawing Options", className: "popup-header"},
			{kind: "RadioGroup", components: [
				{label:"Bar Chart", name: "cbBarChart", value:0, onclick: "setBarChart"},
				{label:"Pie Chart", name: "cbPieChart", value:1, onclick: "setPieChart"}
			]}
/*			
			{kind: enyo.HFlexBox, components: [
			    {kind: enyo.CheckBox, name: "cbBarChart", checked: true, onChange: "setBarChart"},
			    {content: "Bar chart"}
			]},
			{kind: enyo.HFlexBox, components: [
			    {kind: enyo.CheckBox, name: "cbPieChart", checked: false, onChange: "setPieChart"},
			    {content: "Pie chart"}
			]}
*/
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
//              {label: "Share", name: "lbShare", icon: "images/share.png", onclick: "goShare"}
            ]},
            {flex: 1},
			{kind: enyo.ToolButton, name: "lbShare", onclick: "goShare", caption: "Share"}
        ]},
        {kind: "AppMenu", components: [
  			{kind: "EditMenu"},
  	        {caption: "Preference"}
  	 	]}
	],
	// After the application completed laucnching, set to fight view
	ready: function() {
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
		//this.$.fightWindow.$.drawingCanvas.clearCanvas();
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
/*
		if(inSender.getChecked())
			this.$.cbPieChart.setChecked(false);
		else 
			this.$.cbPieChart.setChecked(true);
*/
		this.$.fightWindow.setDrawingOption(inSender.getValue());
	},
	// Listener of 'onChange' of second checkbox
	setPieChart: function(inSender) {
/* 		
		if(inSender.getChecked())
			this.$.cbBarChart.setChecked(false);
		else 
			this.$.cbBarChart.setChecked(true); 
*/
		this.$.fightWindow.setDrawingOption(inSender.getValue());
	},

	// Function to reset the radio buttons to the right status
	resetRadioButton: function(btn1, btn2, btn3) {
		btn1.setDepressed(true);
		btn2.setDepressed(false);
		btn3.setDepressed(false);
	}
});


