var grid = function(width, height, canvasID){
	var canvasID = canvasID;
	var canvas = document.getElementById(canvasID);
	var canvasContext = canvas.getContext("2d");

	var width = width;
	var height = height;

	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;

	var dx = canvasWidth/width;
	var dy = canvasHeight/height;

	var colorMap = {1:"red", 0:"blue"};

	var drawGridRect = function(){
		//Draw Grid:
		canvasContext.beginPath();

		for(x = 1; x < width; x++){
			canvasContext.moveTo(x*dx, 0);
			canvasContext.lineTo(x*dx, canvasHeight);
		}

		for(y = 1; y < height; y++){
			canvasContext.moveTo(0, y*dy);
			canvasContext.lineTo(canvasWidth, y*dy);
		}

		canvasContext.stroke();
	}

	var fillGridRect = function(gridArray){
		canvasContext.beginPath();
		canvasContext.fillStyle = colorMap[1];
		for(x=0; x < width; x++){
			for(y=0;y<height; y++){
				if(gridArray[y][x] == 1){
					canvasContext.fillRect(x*dx, y*dy, dx, dy);
				}
			}
		}
	}

	this.draw = function(gridArray){
		//Clear Canvas
		canvasContext.fillStyle = colorMap[0];
		canvasContext.fillRect(0,0,canvasWidth, canvasHeight);

		fillGridRect(gridArray);
		drawGridRect();

	}

	this.drawSingleSquare = function(x,y,z){
		canvasContext.beginPath();
		canvasContext.fillStyle = colorMap[z];
		canvasContext.strokeStyle = "black";
		canvasContext.rect(x*dx, y*dy, dx, dy);
		canvasContext.fill();
		canvasContext.stroke();
	}

	this.getX = function(x){
		return  Math.floor(x/dx);
	}

	this.getY = function(y){
		return  Math.floor(y/dy);
	}

	this.PrintIt = function(){
		console.log("Down(" + dx + "," + dy + ")");

	}
}