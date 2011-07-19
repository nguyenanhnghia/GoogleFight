easeOutBounce = function(inValue, inAnimation) {
	var a = inAnimation;
	return easeOutBounce.step(a.t1-a.t0, 0, 1, a.duration); 
}

// http://plugins.jquery.com/files/jquery.easing.1.2.js.txt
// t: current time, b: beginning value, c: change in value, d: duration
easeOutBounce.step = function (t, b, c, d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
}

enyo.kind({
	name: "GoogleFight.OptionWindow",
	kind: enyo.VFlexBox,
	events:{
		onSelectFight:""
	},
	published: {
		first: "",
		second: ""
	},
	components: [
	    {kind: "Animator", onBegin: "beginAnimation", onAnimate: "stepAnimation", onEnd: "endAnimation"},
   		{name: "animatedPopup", kind: "Popup", showHideMode: "manual", onOpen: "animateOpen", onClose: "animateClose",
			scrim: true, modal: true, dismissWithClick: false, width: "400px", components: [
			{className: "popup-header", name: "title"},
			{kind: enyo.BasicScroller,components:[
   				{kind: "VirtualRepeater", name:"listCategory", onSetupRow:"setupRowModal", components: [
   					{kind: "Item",tapHighlight: true, onclick:"setSelectFight", className:"option-item", layoutKind: "HFlexLayout", components: [
   						{name:"captionFItem1"},
   						{flex:1},
   						{content:"VS", style: "color: red"},
   						{flex:1},
   						{name:"captionFItem2"}
   					]}
   				]},	
   			]},
   			{kind: "Button", caption: "Close", onclick: "closeClick", className: "enyo-button-affirmative"}
		]},
		{kind: enyo.Scroller, flex: 1, components:[
			{kind: enyo.HFlexBox, pack: "center", className: "fight-list", components: [
				{kind: enyo.VirtualRepeater, onSetupRow: "setupRow", components: [
				  {kind: enyo.Button, name: "captionFight", onclick: "showDialog", popup: "animatedPopup", className: "enyo-button-dark", width: "400px"}
				]}
			]}
		]}
	],
	data: [
			{
				categoryNameToDisplay: "Celebrities",
				category: [
							{ first : "Paris Hilton", second : "Lindsay Lohan"},
							{ first : "Jennifer Aniston", second : "Angelina Jolie"},
							{ first : "Michael Jackson", second : "Bob Marley"},
							{ first : "Barack Obama", second : "Osama Ben Laden"},
							{ first : "Harry Potter", second : "Percy Jackson"},
							{ first : "Tim Burton", second : "Terry Gilliam"},
							{ first : "Mr Jack", second : "Mickey Mouse"}
					]			
			}, {
				categoryNameToDisplay: "Sport",
				category:[
							{ first : "NASCAR", second : "Super Bowl"},
							{ first : "NBA", second : "NHL"},
							{ first : "Lakers", second : "knicks"},
							{ first : "Yankees", second : "Mets"},
							{ first : "Poker", second : "Blackjack"},
							{ first : "Tiger Woods", second : "Mickael Jordan"},
							{ first : "Vuvuzela", second : "Wolverine"},
							{ first : "Argentina", second : "Uruguay"}
					]
			},{
				categoryNameToDisplay: "Technology",
				category:[
							{ first : "Steve Jobs", second : "Bill Gates"},
							{ first : "Palm", second : "Iphone"},
							{ first : "Google", second : "Bing"},
							{ first : "Twitter", second : "Facebook"},
							{ first : "Wii", second : "Playstation3"},
							{ first : "3DS", second : "GBA"}
					] 
			},{
				categoryNameToDisplay: "TV",
				category:[
							{ first : "American Idols", second : "Survivor"},
							{ first : "Seinfeld", second : "Friends"},
							{ first : "Academy Awards", second : "The Oscar"},
							{ first : "Fox", second : "ABC"},
							{ first : "Sony", second : "Samsung"},
							{ first : "Futurama", second : "IT Crowd"},
							{ first : "A-Team", second : "X-men"},
							{ first : "Simpsons", second : "Family Guy"}
					]
			}
	],
	animateOpen: function(inSender) {
		if (inSender.hasNode()) {
			this.$.animator.setDuration(750);
			this.$.animator.style = inSender.node.style;
			this.$.animator.popup = inSender;
			this.$.animator.setEasingFunc(easeOutBounce);
			this.$.animator.play();
		}
	},
	animateClose: function(inSender) {
		this.$.animator.setDuration(250);
		this.$.animator.setEasingFunc(enyo.easing.easeOut);
		this.$.animator.play();
	},
	beginAnimation: function(inSender) {
		inSender.popup.setShowing(true);
	},
	stepAnimation: function(inSender, inValue, inPercent) {
		var p = inSender.popup.isOpen ? inPercent : 1 - inPercent;
		inSender.style.opacity = p;
		inSender.style.webkitTransform = "scale(" + (2 - p) +")";
	},
	endAnimation: function(inSender) {
		var popup = inSender.popup;
		popup.setShowing(popup.isOpen);
	},
	setupRow: function(inSender, inIndex) {
	  var row = this.data[inIndex];
	  if (row) {
		  this.$.captionFight.setContent(row.categoryNameToDisplay);
		  return true;
	  }
	},
	setupRowModal: function(inSender, inIndex) {
	  var row = this.data[this.rowClickIndex].category[inIndex];
	  
	  if (row) {
		  this.$.captionFItem1.setContent(row.first);
		  this.$.captionFItem2.setContent(row.second);
		  return true;
	  }
	},
	showDialog: function(inSender, inEvent) {
		this.rowClickIndex = inEvent.rowIndex;
		var p = this.$[inSender.popup];
		if (p) {
			p.openAtCenter();
			this.$.title.setContent(this.data[this.rowClickIndex].categoryNameToDisplay);
			this.$.listCategory.render();
		}
	},
	setSelectFight: function(inSender, inEvent) {
		var r = this.data[this.rowClickIndex].category[inEvent.rowIndex];
		this.first = r.first;
		this.second = r.second;
		this.closeClick();
		window.setTimeout(enyo.hitch(this, "doSelectFight"), 500);
	},
	closeClick: function(){
		this.$.animatedPopup.close();
	}
});





	

    