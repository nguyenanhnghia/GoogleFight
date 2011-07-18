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
		{kind: enyo.HFlexBox, components:[
			{flex:1},	
			{kind: "VirtualList", onSetupRow: "setupRow", components: [
			  {kind: "Item", tapHighlight: true, onclick:"showDialog", layoutKind: "HFlexLayout", components: [
				{flex:1},
				{name: "captionFight"},
				{flex:1}
			  ]}
			]},
			{flex:1}
		]},
		{kind: "ModalDialog", caption: "", layoutKind: "VFlexLayout", components: [
			{kind: enyo.BasicScroller,components:[
				{kind: "VirtualRepeater", name:"listCategory", onSetupRow:"setupRowModal", components: [
					{kind: "Item",tapHighlight: true, onclick:"setSelectFight", className:"enyo-googlefight-option-item", layoutKind: "HFlexLayout", components: [
						{name:"captionFItem1"},
						{flex:1},
						{content:"VS", style: "color: red"},
						{flex:1},
						{name:"captionFItem2"}
					]}
				]},	
			]},
			{kind: "Button", caption: "Close", onclick: "closeClick", className: "enyo-button-affirmative"}
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
			},{
				categoryNameToDisplay: "User Fights",
				category: [
							{ first : "", second : ""}
					]
			}
	],
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
		this.$.modalDialog.openAtCenter();
		this.$.modalDialog.setCaption(this.data[this.rowClickIndex].categoryNameToDisplay);
		this.$.listCategory.render();
	},
	setSelectFight: function(inSender, inEvent) {
		var r = this.data[this.rowClickIndex].category[inEvent.rowIndex];
		this.first = r.first;
		this.second = r.second;
		this.$.modalDialog.close();
		this.doSelectFight();
	},
	closeClick: function(){
		this.$.modalDialog.close();
	}
});





	

    