enyo.kind({
	name: "GoogleFight.DrawingCanvas",
	kind: enyo.Control,
	nodeTag: "canvas",
	published: {
		canWidth: 0,
		canHeight: 0,
		maxHeight1: 0,
		maxHeight2: 0,
		name1: "",
		name2: "",
		result1: "",
		result2: "",
		percentage1: 0,
		percentage2: 0
	},
	events: {
		onFinish: ""
	},
	rendered: function() {
		this.hasNode();
		
		this.can = this.node;
		this.ctx = this.can.getContext('2d');
		this.ctx.lineWidth = 5;
	},
	chartAnimation: function() {
		if(this.name1 != "" && this.name2 != "") {
			this.clearCanvas();
			
			if(this.maxHeight1 > this.maxHeight2) {
				this.fillStyle1 = "#8ED6FF";
				this.fillStyle2 = "red";
			} else {
				this.fillStyle1 = "red";
				this.fillStyle2 = "#8ED6FF";
			}
			this.ctx.strokeStyle = "black";
			
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
				this.drawChartStatistics();
				this.doFinish();
			}
		}
	},
	drawFirstChart: function() {
		this.ctx.beginPath();
		this.ctx.rect(this.firstFighterX - 50, this.fighterY, this.width, this.height1);

		this.ctx.fillStyle = this.fillStyle1;
		this.ctx.fill();
		this.ctx.stroke();
	},
	drawSecondChart: function() {
		this.ctx.beginPath();
		this.ctx.rect(this.secondFighterX - 50, this.fighterY, this.width, this.height2);

		this.ctx.fillStyle = this.fillStyle2;
		this.ctx.fill();
		this.ctx.stroke();
	},
	drawChartStatistics: function() {
		var mul = 5;
		var x1 = this.result1.length * mul;
		var x2 = this.result2.length * mul;
		var name1 = this.name1.length * mul;
		var name2 = this.name2.length * mul;
		var per1 = (this.percentage1 + "%").length * mul;
		var per2 = (this.percentage2 + "%").length * mul;
		var perDrawingPoint1 = this.canHeight - 50 - this.maxHeight1;
		var perDrawingPoint2 = this.canHeight - 50 - this.maxHeight2;
		this.ctx.font = "15pt Calibri";
		this.ctx.fillStyle = "green";
		
		// Draw statistic for first fighter
	    this.ctx.fillText(this.result1, this.firstFighterX - x1, this.fighterY + 20);
	    this.ctx.fillText(this.name1, this.firstFighterX - name1, this.fighterY + 40)
	    this.ctx.fillText(this.percentage1 + "%", this.firstFighterX - per1, perDrawingPoint1 - 10);
	    
	    // Draw statistic for second fighter
	    this.ctx.fillText(this.result2, this.secondFighterX - x2, this.fighterY + 20);
	    this.ctx.fillText(this.name2, this.secondFighterX - name2, this.fighterY + 40)
	    this.ctx.fillText(this.percentage2 + "%", this.secondFighterX - per2, perDrawingPoint2 - 10);
	},
	pieChartAnimation: function() {
		if(this.name1 != "" && this.name2 != "") {
			this.endAngle = (this.percentage2 / 100) * 2 * Math.PI + this.startAngle;
			if(this.percentage1 >= this.percentage2) {
				this.fillStyle1 = "#8ED6FF";
				this.fillStyle2 = "red";
			} else {
				this.fillStyle1 = "red";
				this.fillStyle2 = "#8ED6FF";
			}
			this.ctx.strokeStyle = "black";
			
			this.radius += this.radiusInterval;
			var maxRadius = (this.canWidth >= this.canHeight ? (this.canHeight / 2) - 50 : (this.canWidth / 2) - 50);
			if(this.radius >= maxRadius) {
				this.radius = maxRadius;
				this.drawPieChart();
				this.stopAnimation();
				this.drawPieChartStatistics();
				this.doFinish();
			} else
				this.drawPieChart();
		}
	},
	drawPieChart: function() {
		this.clearCanvas();
		
		if(this.percentage1 == 0) {
			this.ctx.beginPath();
			this.ctx.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle, false);
			this.ctx.closePath();
			this.ctx.fillStyle = this.fillStyle2;
			this.ctx.fill();
			this.ctx.stroke();
		} else if(this.percentage2 == 0) {
			this.endAngle = (this.percentage1 / 100) * 2 * Math.PI + this.startAngle;
			this.ctx.beginPath();
			this.ctx.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle, true);
			this.ctx.closePath();
			this.ctx.fillStyle = this.fillStyle1;
			this.ctx.fill();
			this.ctx.stroke();
		} else {
			this.ctx.beginPath();
			this.ctx.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle, true);
			this.ctx.lineTo(this.centerX, this.centerY);
			this.ctx.closePath();
			this.ctx.fillStyle = this.fillStyle1;
			this.ctx.fill();
			this.ctx.stroke();
			
			this.ctx.beginPath();
			this.ctx.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle, false);
			this.ctx.lineTo(this.centerX, this.centerY);
			this.ctx.closePath();
			this.ctx.fillStyle = this.fillStyle2;
			this.ctx.fill();
			this.ctx.stroke();
		}
	},
	drawPieChartStatistics: function() {
		// Draw first legend square
		this.ctx.beginPath();
		this.ctx.rect(this.centerX - 150, this.canHeight - 50, this.legendSize, this.legendSize);
		this.ctx.fillStyle = this.fillStyle1;
		this.ctx.fill();
		this.ctx.stroke();
		
		// Draw first result
		this.ctx.font = "15pt Calibri";
		this.ctx.fillStyle = "green";
		this.ctx.beginPath();
		this.ctx.fillText(this.name1 + " - " + this.result1 + " (" + this.percentage1 + "%)", 
				this.centerX - 120, this.canHeight - 33);
		
		// Draw second legend square
		this.ctx.beginPath();
		this.ctx.rect(this.centerX - 150, this.canHeight - 20, this.legendSize, this.legendSize);
		this.ctx.fillStyle = this.fillStyle2;
		this.ctx.fill();
		this.ctx.stroke();
		
		// Draw second result
		this.ctx.fillStyle = "green";
		this.ctx.beginPath();
		this.ctx.fillText(this.name2 + " - " + this.result2 + " (" + this.percentage2 + "%)", 
				this.centerX - 120, this.canHeight - 4);
	},
	startBarChartAnimation: function() {
		this.setDrawingParams();
		this.job = window.setInterval(enyo.hitch(this, "chartAnimation"), this.timeInterval);
	},
	startPieChartAnimation: function() {
		this.setDrawingParams();
		this.job = window.setInterval(enyo.hitch(this, "pieChartAnimation"), this.timeInterval);
	},
	stopAnimation: function() {
		if(this.job) {
			window.clearInterval(this.job);
		}
	},
	setDrawingParams: function() {
		this.can.width = this.canWidth;
		this.can.height = this.canHeight;
		
		this.width = 100;
		this.timeInterval = 10;
		
		// Params for drawing bar charts
		this.firstFighterX = this.canWidth / 4;		
		this.secondFighterX = this.canWidth - this.firstFighterX;
		this.fighterY = this.canHeight - 50;
		
		if(this.canHeight == 650) {
			this.heightInterval = -10;
			this.radiusInterval = 10;
		}
		else {
			this.heightInterval = -5;
			this.radiusInterval = 10;
		}
		
		// Params for drawing pie chart
		this.centerX = this.canWidth / 2;
		this.centerY = this.canHeight / 2 - 20;
		this.startAngle = - Math.PI / 2;
		this.legendSize = 20;
		
		// Add shadow for charts
		this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		this.ctx.shadowOffsetX = 15;
		this.ctx.shadowOffsetY = 15;   
		this.ctx.shadowBlur = 5;
		
		// Reset height for drawing bar charts
		this.height1 = 0;
		this.height2 = 0;
		
		// Reset radius for drawing pie chart
		this.radius = 10;
	},
	clearCanvas: function() {
		this.can.width = this.can.width;
	}
});