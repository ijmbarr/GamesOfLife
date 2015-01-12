var GOL = function(canvasID, opts){
	console.log(opts);

	var canvas = document.getElementById(canvasID);
	
	var state = [];

	//Grid Size
	var width, height;
	if(opts["gridSize"] === "50"){
		width = 50;
		height = 50;
	}else if (opts["gridSize"] === "100"){
		width = 100;
		height = 100;
	}else if(opts["gridSize"] === "200"){
		width = 200;
		height = 200;
	}

	//Grid Type
	var Grid = new grid(width, height, canvasID);

	//Boundary Conditions
	var bc;
	if(opts["boundary"] === "periodic"){
		bc = function(current, x, y){
			if(y < 0){
				var tempY = height-1;
			}else if(y >= height){
				var tempY = 0;
			}else{
				var tempY = y;
			}

			if(x < 0){
				var tempX = width-1;
			}else if(x >= width){
				var tempX = 0;
			}else{
				var tempX = x;
			}
			return current[tempY][tempX];
		}
	}else if(opts["boundary"] === "dead"){
		bc = function(current, x, y){
			if(y < 0){
				return 0;
			}else if(y >= height){
				return 0;
			}else{
				var tempY = y;
			}

			if(x < 0){
				return 0;
			}else if(x >= width){
				return 0;
			}else{
				var tempX = x;
			}
			return current[tempY][tempX];
		}
	}

	//RuleSet
	var applyRules;
	applyRules = function(current, x, y){

		count = 0;
		for(xx = -1; xx < 2; xx++){
			for(yy = -1; yy < 2; yy++){
				if(!(xx==0&&yy==0)){
					count += bc(current, xx + x, yy + y);
				}
			}
		}

		//Add Some Random
		if(opts["noise"] === "yes"){
			if (Math.random() >= (1.0 - 1.0/(width*height))){
				return 1;
			}
		}

		//Apply Rules
		if(current[y][x] == 1){
			if(opts["ruleSet"].s.indexOf(count) > -1){
				return 1;
			} else {
				return 0;
			}
		} else {
			if(opts["ruleSet"].b.indexOf(count) > -1){
				return 1;
			} else {
				return 0;
			}
		}
	}

	//deal with mouse events
	var mouseDown = false;
	var cursorPos = {x:undefined, y:undefined};

	canvas.addEventListener("mouseout", function(){ mouseDown = false; cursorPos = {x:undefined, y:undefined};}, false);
	canvas.addEventListener("mousemove", function(e){tryToDraw(e);} ,false);
	canvas.addEventListener("mousedown", function(e){mouseDown = true; tryToDraw(e);} ,false);
	canvas.addEventListener("mouseup", function(){ mouseDown = false; cursorPos = {x:undefined, y:undefined}; }, false);

	var tryToDraw = function(e){
		if(mouseDown){
			var cx = Grid.getX(getCursorPosition(e)[0]);
			var cy = Grid.getY(getCursorPosition(e)[1]);

			if (!(cursorPos.x == cx && cursorPos.y == cy)){
				state[cy][cx] = (state[cy][cx] + 1)%2;
				Grid.drawSingleSquare(cx, cy, state[cy][cx]);

				cursorPos.x = cx;
				cursorPos.y = cy;
			}		
		}
	}

	//Do Stuff

	this.start = function(){
		console.log("Start");
		if(opts["initial"] === "random"){
			state = randomGrid();			
		} else if (opts["initial"] === "empty"){
			state = emptyGrid();
		}

		Grid.draw(state);
	}

	this.next = function(){
		newState = emptyGrid();
		for(y = 0; y < height; y++){
			for(x = 0; x < width; x++){
				newState[y][x] = applyRules(state, x, y);
			}
		}

		state = newState;
		Grid.draw(state);
	}

	//Helper functions:
	var randomGrid = function(){
		toReturn = [];
		for(y = 0; y < height; y++){
			tempRow = []
			for(x = 0; x < width; x++){
				tempRow.push(Math.round(Math.random()));
			}
			toReturn.push(tempRow);
		}
		return toReturn;
	}

	var emptyGrid = function(){
		toReturn = [];
		for(y = 0; y < height; y++){
			tempRow = []
			for(x = 0; x < width; x++){
				tempRow.push(0);
			}
			toReturn.push(tempRow);
		}
		return toReturn;
	}

	var getCursorPosition = function(e) {
	    var x;
	    var y;

	    if (e.pageX || e.pageY) {
			x = e.pageX;
			y = e.pageY;
	    }
	    else {
		x = e.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	    }
	    // Convert to coordinates relative to the canvas
	    var offset = $("#" + canvasID).offset();
	    x -= offset.left;
	    y -= offset.top;

	    return [x,y];
	}
}