enyo.kind({
	name: "GoogleFight.ShareWindow",
	kind: enyo.VFlexBox,
	components: [
		{
			//call mail service in order to send mail to anyone who user want to send
			name: "openEmailCall",
			kind: "PalmService",
			service: "palm://com.palm.applicationManager/",
			method: "open",
			onSuccess: "openEmailSuccess",
			onFailure: "openEmailFailure",
			onResponse: "gotResponse",
			subscribe: true
		},
		{
			//call browser service
		    name: "launchBrowserCall",
		    kind: "PalmService",
		    service: "palm://com.palm.applicationManager/",
		    method: "launch",
		    onSuccess: "launchFinished",
		    onFailure: "launchFail",
		    onResponse: "gotResponse",
		    subscribe: true
		},
		{
			//call sms service 
			name: "smsService", 
			kind: "PalmService", 
			service: "palm://com.palm.applicationManager/", 
			method: "open"
		},
		{kind: enyo.HFlexBox, pack:"center", components: [
			{kind: "VirtualList", style: "width: 500px; height: 350px;", onSetupRow: "setupRow", components: [
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
	openEmailSuccess : function (inSender,inResponse){ 
		enyo.log("Open success, results="+JSON.stringify(inResponse)); 
	},
	openEmailFailure : function (inSender,inResponse){ 
		enyo.log("Open failure, results="+JSON.stringify(inSender)); 
	},
	
	// it fire when user choose which service
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
				this.$.openEmailCall.call({ // -- call with method launch
					"id":"com.palm.app.email", 
					"params":{
	                   "summary":"Invitation on Google Fight",
	                   "text":"<a href ='http://www.google.com/search?q=google+fight'>Google Fight</a>",
	                   "recipients":[
	                    {
	                        "type":"email",
	                        "contactDisplay":"Mr Nicolas",
	                        "role":1,
	                        "value":"tli_test_palm@rocketmail.com"
	                     }]
							} });
				break;
			case 4: var msgTextContent = "I want to play Google Fight with you : http://bit.ly/GooglefightwebOS";
					var paramsContent = {messageText : msgTextContent};
					var parametersContent = {id :'com.palm.app.messaging', params : paramsContent};
					enyo.log(parametersContent); 
					//this.$.smsService.call(parametersContent); --call method launch
					this.$.smsService.call({"target":"im:tli_test_palm@rocketmail.com"}); //--call method open
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