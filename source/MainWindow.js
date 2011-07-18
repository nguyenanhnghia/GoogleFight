enyo.kind({
	name: "GoogleFight.MainWindow",
	kind: enyo.VFlexBox,
	components: [
		{kind: enyo.HFlexBox, style: "background-image: url('images/bg_header.png'); font-size: 2em; text-align: center", components: [
			{flex: 1},
			{content: "GOOGLE ", align: "center", style: "color: white;"},
			{content: "FIGHT", align: "center", style: "color: black;"},
			{flex: 1}
		]},
        {name: "mainWindow", kind: "Pane",  transitionKind: "enyo.transitions.LeftRightFlyin", flex: 1, components: [
            {kind: "GoogleFight.FightWindow", name: "fightWindow", className: "enyo-bg"},
	        {kind: "GoogleFight.OptionWindow", name: "optionWindow", onSelectFight: "makeFight", className: "enyo-bg"},
			{kind: "GoogleFight.ShareWindow", name: "shareWindow", className: "enyo-bg"}
        ]},
        {kind: enyo.Toolbar, pack: "justify", components: [
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
		this.$.fightWindow.$.drawingCanvas.clearCanvas();
	},
	goShare: function(){
		this.$.mainWindow.selectViewByName("shareWindow");
		this.resetRadioButton( this.$.lbShare,this.$.lbHome, this.$.lbFights);
	},
	resetRadioButton: function(btn1, btn2, btn3) {
		btn1.setDepressed(true);
		btn2.setDepressed(false);
		btn3.setDepressed(false);
	}
});

