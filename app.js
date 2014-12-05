

/* sets up the initial board */
var init = function() {
	boardFull = false;
	hasMoved = false;
	score = 0;
	highestTile = 0;
	valueGrid = [[0,2,0,0],[0,0,2,0],[0,0,0,0],[0,0,0,0]];
	styleGrid = [[],[],[],[]];
	transformGrid = [[],[],[],[]];
	
	tempStyleGrid = $("div.cell").get();
	var counter = 0;
	for (i = 0; i < 4; i++){
		for (j = 0; j < 4; j++) {
			styleGrid[i][j] = tempStyleGrid[counter];
			counter++;
		}
	}
	
	updateBoard();
	
	main();
};

/* main game logic loop */
var main = function() {
		$(document).keydown(function(e) {
			//console.log(isGameOver());
			if (isBoardFull() && hasMoved == false){
				$('.message').html("You lost!");
			}
			else {move(e.which);}
				
		});	
		$(document).swipe( {
			//console.log(isGameOver());
			//if (isBoardFull() && hasMoved == false){
				//$('.message').html("You lost!");
			//}
			//else {
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
							if (direction == 'left'){move(37);}
							if (direction == 'up'){move(38);}
							if (direction == 'right'){move(39);}
							if (direction == 'down'){move(40);}
						}, threshold:5
			//}
				
		});	
};

/* updates the board view after a move has occurred */
var updateBoard = function () {
	for (i = 0; i < 4; i++){
	
		for (j = 0; j < 4; j++){
		
			if (valueGrid[i][j] !== 0) {
				$(styleGrid[i][j]).removeClass().addClass('cell c' + valueGrid[i][j]);
				$(styleGrid[i][j]).html(valueGrid[i][j]);
				
				
			} else {
				$(styleGrid[i][j]).removeClass().addClass('cell');
				
			}
		}
		
	}
	$('.score').html(score.toLocaleString());
	 
	if (highestTile === 2048) {
		$('.message').html("You win!");}
};

/* randomly adds a new tile to the board after a move */
var addCell = function () {
	var empty = true;
	while (empty) {
		newRow = Math.floor((Math.random() * 4));
		newCol = Math.floor((Math.random() * 4));
		
		if (valueGrid[newRow][newCol] === 0){
			empty = false;}
	}
	
	if(hasMoved){
		valueGrid[newRow][newCol] = 2;
		updateBoard();}
};

/* moves the cells after a keypress */
var move = function(direction) {
	var originalGrid = valueGrid;
	
	if (direction == 37){
		rotate(4);
		stripZeroes();
		checkMatches();
	}
	if (direction == 38){
		rotate(1);
		stripZeroes();
		checkMatches();
		rotate(3);				
	}
	if (direction == 39){
		rotate(2);
		stripZeroes();
		checkMatches();
		rotate(2);
	}
	if (direction == 40){
		rotate(3);
		stripZeroes();
		checkMatches();				
		rotate(1);
	}
	
	hasMoved = false;
	for (i=0; i<4; i++){
		for(j=0; j<4; j++){
			if (originalGrid[i][j] != valueGrid[i][j]) {hasMoved = true;}
		}
	}
	if (hasMoved){
		addCell();
		updateBoard();
	}	
	else {
		console.log("No move");}
};

/* removes empty cells from a row and appends them to the end */
var stripZeroes = function() {
  //hasMoved = false;
  for (i=0; i<4; i++){
        
      for (j=0; j<4; j++){
          
         for(k=0; k<3; k++) {
            if (valueGrid[i][j] === 0){
              valueGrid[i].splice(j,1);
              valueGrid[i].push(0);
			  //hasMoved = true;
			  }   
        
			}
        }
      
    }
};

/* checks for tile combinations */
var checkMatches = function() {
  //hasMoved = false;
  //console.log("hasMoved =" + hasMoved); 
  for (i=0; i<4; i++){
      var originalGrid = valueGrid; 
      for (j=0; j<3; j++){
	  
            if (valueGrid[i][j] === valueGrid[i][j+1]){
              valueGrid[i][j] = valueGrid[i][j]*2;
			  if (valueGrid[i][j] > highestTile){
				highestTile = valueGrid[i][j];}
			  
			  
			  score += valueGrid[i][j];
              valueGrid[i].splice(j+1,1);
              valueGrid[i].push(0);}
			  //hasMoved = true;
        }      
    }
  
  //console.log("hasMoved =" + hasMoved); 
};

/* temporarily rotates the board to make move calculations easier */
var rotate = function(numRotations) {
	var i = 0;
	while (i < numRotations) {
	  transformGrid = [ [valueGrid[0][3],valueGrid[1][3],valueGrid[2][3],valueGrid[3][3]],
						[valueGrid[0][2],valueGrid[1][2],valueGrid[2][2],valueGrid[3][2]],
						[valueGrid[0][1],valueGrid[1][1],valueGrid[2][1],valueGrid[3][1]],
						[valueGrid[0][0],valueGrid[1][0],valueGrid[2][0],valueGrid[3][0]] ];
		valueGrid = transformGrid;
		i++;
	}
};

var isBoardFull = function() {
	boardFull = true;
	for (i = 0; i < 4; i++){
		for (j = 0; j < 4; j++) {
			if (valueGrid[i][j] == 0) {boardFull=false;};
		}
	}
	return boardFull;
};

/* runs the init() function after the page has loaded */
$(document).ready(init);
