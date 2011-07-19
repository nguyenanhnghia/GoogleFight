enyo.kind({
	name: "GoogleFight.MainWindow",
	kind: enyo.VFlexBox,
	components: [
        //{kind: enyo.Animator, onBegin: "beginAnimation", onAnimate: "stepAnimation", onEnd: "endAnimation"},
        {kind: enyo.Menu, name: "optionMenu", showHideMode: "transition",
        	openClassName: "scaleIn", className: "transitioner3", layoutKind: enyo.VFlexLayout, components: [
			{content: "Drawing Options", className: "popup-header"},
			{kind: enyo.HFlexBox, components: [
			    {kind: enyo.CheckBox, name: "cbBarChart", checked: true},
			    {content: "Bar chart"}
			]},
			{kind: enyo.HFlexBox, components: [
			    {kind: enyo.CheckBox, name: "cbPieChart", checked: false},
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
	ready: function() {
		this.$.mainWindow.selectViewByName("fightWindow");
	},
	goHome: function() {
		this.$.mainWindow.selectViewByName("fightWindow");
	},
	makeFight: function() {
		this.goHome();
		this.resetRadioButton(this.$.lbHome, this.$.lbFights, this.$.lbShare);
		this.$.fightWindow.$.firstFighter.setValue(this.$.optionWindow.first);
		this.$.fightWindow.$.secondFighter.setValue(this.$.optionWindow.second);
	},
	goFight: function() {
		this.$.mainWindow.selectViewByName("optionWindow");
		this.resetRadioButton(this.$.lbFights, this.$.lbHome, this.$.lbShare);
		//this.$.fightWindow.$.drawingCanvas.clearCanvas();
	},
	goShare: function(){
		this.$.mainWindow.selectViewByName("shareWindow");
		this.resetRadioButton( this.$.lbShare,this.$.lbHome, this.$.lbFights);
	},
	openOption: function(inSender, inEvent) {
		this.$.optionMenu.openAtEvent(inEvent);
	},
	resetRadioButton: function(btn1, btn2, btn3) {
		btn1.setDepressed(true);
		btn2.setDepressed(false);
		btn3.setDepressed(false);
	}
});


