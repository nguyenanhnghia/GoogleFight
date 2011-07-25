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
			
			var isComplete1 = false;
			var isComplete2 = false;
			
			this.height1 += this.heightInterval;
			this.y1 -= this.heightInterval;
			if(this.height1 >= this.maxHeight1) {
				this.height1 = this.maxHeight1;
				this.y1 = this.fighterY - this.maxHeight1;
				this.drawFirstChart();
				isComplete1 = true;
			}
			else
				this.drawFirstChart();
			
			this.height2 += this.heightInterval;
			this.y2 -= this.heightInterval;
			if(this.height2 >= this.maxHeight2) {
				this.height2 = this.maxHeight2;
				this.y2 = this.fighterY - this.maxHeight2;
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
	/**
	 * Draws a rounded rectangle using the current state of the canvas.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} width The width of the rectangle
	 * @param {Number} height The height of the rectangle
	 * @param {Number} radius The corner radius. Defaults to 5;
	 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
	 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
	 */
	roundRect: function(ctx, x, y, width, height, radius, fill, stroke) {
	    if (typeof stroke == "undefined" ) {
	    	stroke = true;
	    }
	    if (typeof radius === "undefined") {
	    	radius = 5;
	    }
	    ctx.beginPath();
	    ctx.moveTo(x + radius, y);
	    ctx.lineTo(x + width - radius, y);
	    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	    ctx.lineTo(x + width, y + height - radius);
	    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	    ctx.lineTo(x + radius, y + height);
	    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	    ctx.lineTo(x, y + radius);
	    ctx.quadraticCurveTo(x, y, x + radius, y);
	    ctx.closePath();
	    if (stroke) {
	    	ctx.stroke();
	    }
	    if (fill) {
	    	ctx.fill();
	    }       
	},
	drawFirstChart: function(y) {
		this.ctx.fillStyle = this.fillStyle1;
		this.roundRect(this.ctx, this.firstFighterX - 50, this.y1, 
				this.width, this.height1, this.cornerRadius1, true);
	},
	drawSecondChart: function(y) {
		this.ctx.fillStyle = this.fillStyle2;
		this.roundRect(this.ctx, this.secondFighterX - 50, this.y2, 
				this.width, this.height2, this.cornerRadius2, true);
	},
	drawChartStatistics: function() {
		this.ctx.font = this.myFont;
		this.ctx.fillStyle = this.statStyle;
		this.ctx.textAlign = "center";
		
		// Draw statistic for first fighter
	    this.ctx.fillText(this.result1, this.firstFighterX, this.fighterY + 20);
	    this.ctx.fillText(this.name1, this.firstFighterX, this.fighterY + 40)
	    this.ctx.fillText(this.percentage1 + "%", this.firstFighterX, this.fighterY - this.maxHeight1 - 10);
	    
	    // Draw statistic for second fighter
	    this.ctx.fillText(this.result2, this.secondFighterX, this.fighterY + 20);
	    this.ctx.fillText(this.name2, this.secondFighterX, this.fighterY + 40)
	    this.ctx.fillText(this.percentage2 + "%", this.secondFighterX, this.fighterY - this.maxHeight2 - 10);
	},
	pieChartAnimation: function() {
		if(this.name1 != "" && this.name2 != "") {
			this.endAngle = (this.percentage2 / 100) * 2 * Math.PI + this.startAngle;
			
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
		// Font for stats
		this.ctx.font = this.myFont;
		this.ctx.textAlign = "left";
		
		// Draw first legend square
		this.ctx.beginPath();
		this.ctx.rect(this.centerX - 150, this.canHeight - 50, this.legendSize, this.legendSize);
		this.ctx.fillStyle = this.fillStyle1;
		this.ctx.fill();
		this.ctx.stroke(); 
		
		// Draw first result
		this.ctx.fillStyle = this.statStyle;
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
		this.ctx.fillStyle = this.statStyle;
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
		// Set width and height for canvas
		this.can.width = this.canWidth;
		this.can.height = this.canHeight;
		
		// Set time interval for animation
		this.timeInterval = 15;
		
		// Params for drawing bar charts
		this.width = 100;
		this.height1 = 0;
		this.height2 = 0;
		this.firstFighterX = this.canWidth / 4;		
		this.secondFighterX = this.canWidth - this.firstFighterX;
		this.fighterY =  this.canHeight - 50;
		this.y1 = this.y2 = this.fighterY;
		this.cornerRadius1 = this.cornerRadius2 = 10;
		
		if(this.maxHeight1 <= 10)
			this.cornerRadius1 = 0;
		if(this.maxHeight2 <= 10)
			this.cornerRadius2 = 0;
		
		// Change intervals for faster drawing
		if(this.canHeight == 700) {
			this.heightInterval = 20;
			this.radiusInterval = 20;
		}
		else {
			this.heightInterval = 15;
			this.radiusInterval = 15;
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
		
		// Set default radius for drawing pie chart
		this.radius = 10;
		
		// Set style for charts
		if(this.maxHeight1 > this.maxHeight2) {
			this.fillStyle1 = "#8ED6FF";
			this.fillStyle2 = "red";
		} else {
			this.fillStyle1 = "red";
			this.fillStyle2 = "#8ED6FF";
		}
		this.ctx.strokeStyle = "black";
		this.statStyle = "green";
		this.myFont = "15pt Calibri";
	},
	clearCanvas: function() {
		if(this.can)
			this.can.width = this.can.width;
	}
});