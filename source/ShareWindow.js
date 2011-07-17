enyo.kind({
	name: "GoogleFight.ShareWindow",
	kind: enyo.VFlexBox,
	components: [
		{name: "listAccounts",kind: "PalmService",service: "palm://com.palm.service.accounts/",method: "launch"},
		{
			name: "openEmailCall",
			kind: "PalmService",
			service: "palm://com.palm.applicationManager/",
			method: "open",
			onSuccess: "openEmailSuccess",
			onFailure: "openEmailFailure",
			onResponse: "gotResponse",
			subscribe: true
		},
		{name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"}, 
		{kind: enyo.Sroller, components: [
			{kind: "VirtualList", onSetupRow: "setupRow", components: [
			  {kind: "Item", tapHighlight: true, layoutKind: "HFlexLayout", onclick:"getService", components: [
				{kind: "ToolButton", name: "shareIcon"},
				{name: "shareTitle", style: "padding-top: 15px"}
				
			  ]}
			]},
		]}
	],
	dataShare:[
		{label: "Share on Facebook",iconPath: "images/facebook-32.png"}, 
		{label: "I Like You",iconPath: "images/facebook-32.png"}, 
		{label: "Follow us on Twitter",iconPath: "images/twitter-32.png"}, 
		{label: "Share with a friend ",iconPath: "images/mail-32.png"}, 
		{label: "SMS to friend",iconPath: "images/messaging.png"} 
	], 
	openEmailSuccess : function (inSender,inResponse){ enyo.log("Open success, results="+JSON.stringify(inResponse)); },
	openEmailFailure : function (inSender,inResponse){ enyo.log("Open failure, results="+JSON.stringify(inSender)); },
	getService: function(inEvent,inIndex){
		var r = inIndex.rowIndex;
		switch (r) {
			case 0: 	//var myString = "This is a string\nWith an email address: myemail@email.com\nAnd a phone number: 555-124-4567\nAnd a URL: http:/\/\webos101.com";
							//var myString =	"555-124-4567";
									//"tel: 555-124-4567";
									//"url: http://www.facebook.com/#!/pages/ITS-On-Mobile/138832106129186?ref=search";
									//"mailto: myemail@email.com";
									//"And a phone number: 555-124-4567\nAnd a URL: http:/webos101.com";
									console.log(this.$.shareTitle.getValue());
					this.$.AppManService.call({target: this.$.shareTitle.getValue()});	
				break;
			case 1: this.log("this test");
				break;
			case 2: enyo.log("enyo test");
				break;
			case 3: this.$.openEmailCall.call({"target": "mailto: holeeSmokes@batman.com"});
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
	linkClicked: function (inSender, inEvent) {
		this.log(inSender, inEvent);
		this.$.AppManService.call({target: inEvent});		
	}
});