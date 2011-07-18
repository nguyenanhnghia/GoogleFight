enyo.kind({
	name: "GoogleFight.DrawingCanvas",
	kind: enyo.Control,
	nodeTag: "canvas",
	domAttributes: { 
    	width:"1020px", 
    	height:"450px"
	},
	published: {
		maxHeight1: 0,
		maxHeight2: 0,
		firstFighterName: "",
		secondFighterName: "",
		firstFighterResultString: "",
		secondFighterResultString: "",
		firstPercent: "",
		secondPercent: ""
	},
	events: {
		onFinish: ""
	},
	rendered: function() {
		this.hasNode();
		
		this.can = this.node;
		this.ctx = this.can.getContext('2d');
		this.ctx.lineWidth = 5;
		
		this.firstFighterX = this.can.width / 4;		
		this.secondFighterX = this.can.width - (this.can.width / 4);
		this.fighterY = 400;
		this.width = 100;
		this.height1 = 0;
		this.height2 = 0;
		this.heightInterval = -5;
		this.timeInterval = 10;
	},
	animated: function() {
		this.clearCanvas();
		
		if(this.maxHeight1 > this.maxHeight2) {
			this.fillStyle1 = "#8ED6FF";
			this.fillStyle2 = "red";
		} else {
			this.fillStyle1 = "red";
			this.fillStyle2 = "#8ED6FF";
		}
		
		var isComplete1 = false;
		var isComplete2 = false;
		
		this.height1 = this.height1 + this.heightInterval;
		if(this.height1 <= -this.maxHeight1) {
			this.height1 = -this.maxHeight1;
			this.drawFirstChart();
			isComplete1 = true;
		}
		else
			this.drawFirstChart();
		
		this.height2 = this.height2 + this.heightInterval;
		if(this.height2 <= -this.maxHeight2) {
			this.height2 = -this.maxHeight2;
			this.drawSecondChart();
			isComplete2 = true;
		}
		else
			this.drawSecondChart();
		
		if(isComplete1 && isComplete2) {
			this.stopAnimation();
			this.drawStatistics();
			this.doFinish();
		}
	},
	drawFirstChart: function() {
		this.ctx.beginPath();
		this.ctx.rect(this.firstFighterX - 50, this.fighterY, this.width, this.height1);

		this.ctx.fillStyle = this.fillStyle1;
		this.ctx.fill();
		this.ctx.strokeStyle = "black";
		this.ctx.stroke();
	},
	drawSecondChart: function() {
		this.ctx.beginPath();
		this.ctx.rect(this.secondFighterX - 50, this.fighterY, this.width, this.height2);

		this.ctx.fillStyle = this.fillStyle2;
		this.ctx.fill();
		this.ctx.strokeStyle = "black";
		this.ctx.stroke();
	},
	drawStatistics: function() {
		this.ctx.font = "15pt Calibri";
		
		if(this.firstFighterName.length > 20)
			this.firstFighterName = this.firstFighterName.substring(0, 20) + "...";
		
		if(this.secondFighterName.length > 20)
			this.secondFighterName = this.secondFighterName.substring(0, 20) + "...";
		
		var mul = 5;
		var x1 = this.firstFighterResultString.length * mul;
		var x2 = this.secondFighterResultString.length * mul;
		var name1 = this.firstFighterName.length * mul;
		var name2 = this.secondFighterName.length * mul;
		var per1 = this.firstPercent.length * mul;
		var per2 = this.secondPercent.length * mul;
		var perDrawingPoint1 = 400 - this.maxHeight1;
		var perDrawingPoint2 = 400 - this.maxHeight2;
		this.ctx.fillStyle = "green";
		
		// Draw statistic for first fighter
	    this.ctx.fillText(this.firstFighterResultString, this.firstFighterX - x1, this.fighterY + 20);
	    this.ctx.fillText(this.firstFighterName, this.firstFighterX - name1, this.fighterY + 40)
	    this.ctx.fillText(this.firstPercent, this.firstFighterX - per1, perDrawingPoint1 - 10);
	    
	    // Draw statistic for second fighter
	    this.ctx.fillText(this.secondFighterResultString, this.secondFighterX - x2, this.fighterY + 20);
	    this.ctx.fillText(this.secondFighterName, this.secondFighterX - name2, this.fighterY + 40)
	    this.ctx.fillText(this.secondPercent, this.secondFighterX - per2, perDrawingPoint2 - 10);
	},
	startAnimation: function() {
		this.job = window.setInterval(enyo.hitch(this, "animated"), this.timeInterval);
	},
	stopAnimation: function() {
		window.clearInterval(this.job);
		this.height1 = 0;
		this.height2 = 0;
	},
	clearCanvas: function() {
		this.can.width = this.can.width;
	}
});