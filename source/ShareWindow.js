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
		{kind: enyo.HFlexBox, pack:"center",components:[	
			{kind: "VirtualList",style: "width: 500px; height: 300px;", onSetupRow: "setupRow", components: [
			  {kind: "Item", tapHighlight: true, layoutKind: "HFlexLayout", onclick:"getService", components: [
				{kind: "ToolButton", name: "shareIcon"},
				{name: "shareTitle",style: "padding-top: 15px"}
				
			  ]}
			]},
		]}
	],
	dataShare:[
		{label: "Share on Facebook",iconPath: "images/facebook-32.png"}, 
		{label: "I Like",iconPath: "images/facebook-32.png"}, 
		{label: "Follow us on Twitter",iconPath: "images/twitter-32.png"}, 
		{label: "Share with a friend ",iconPath: "images/mail-32.png"}, 
		{label: "SMS to friend",iconPath: "images/messaging.png"} 
	], 
	openEmailSuccess : function (inSender,inResponse){ enyo.log("Open success, results="+JSON.stringify(inResponse)); },
	openEmailFailure : function (inSender,inResponse){ enyo.log("Open failure, results="+JSON.stringify(inSender)); },
	getService: function(inEvent,inIndex){
		var r = inIndex.rowIndex;
		switch (r) {
			case 0: 	var myString =	"tel: 555-124-4567";
									//"tel: 555-124-4567";
									//"url: http://www.facebook.com/#!/pages/ITS-On-Mobile/138832106129186?ref=search";
									//"mailto: myemail@email.com";
									//"And a phone number: 555-124-4567\nAnd a URL: http:\\\\webos101.com";
					this.$.AppManService.call({target: myString});	
					console.log("console test");
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
	}
});