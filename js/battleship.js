/**
 * @fileOverview
 * @name battleship.js
 * @author
 * @license
 */
// The main file for battleship

initGui();
var b2;//board2
var b1;//board1
var turn; //false for p1, true for p2
var play; //play state
var intervalVal;
var ai1;
var ai2;
/**
 * game initialization function. creates the board states b1 & b2, set play, and initializes the turns
 */
function gameInit(){
	intervalVal = null;

	//check if the human set their ships
	if(human){
		//create board 1 from the set ships
		b2 = new State([], [], b2Ships, []);
	}
	//otherwise randomly generate ships for board2
	else{
		b2 = new State([], [], randGenShips(), []);
	}
	//randomly generate ships for board1
	b1 = new State([], [], randGenShips(), []);

	//turn is to determine whose turn it is. See its declaration.
	turn = false;

	//play is to determine if the game is currently being played.
	play = true;

	//check if we have a human player again
	if(human){

		//call our Ai's turn
		nextTurn();
		//check if it ended the game for some reason
		/*
		 if(b1.isEndState()){
		 play = false;
		 window.alert("player 2 wins!");
		 }
		 */
		//call player's turn
		nextTurn();

	}
	//if it's two AI's, call the game loop to have 'em battle it out.
	else{
		speed = parseInt(document.getElementById("AIspeed").value);
		gameLoop(speed * 20);
	}
	/*
	 for(var i = 0; i <200; i++){
	 //while(play){
	 console.log(b1);
	 console.log(b1.isEndState());
	 console.log(b2);
	 console.log(b2.isEndState());
	 if(b1.isEndState()){
	 play = false;
	 window.alert("player 2 wins!");
	 }
	 if(b2.isEndState()){
	 play = false;
	 window.alert("player 1 wins!");
	 }
	 //isEndState(b2);
	 nextTurn();
	 //setTimeout(function(){nextTurn();}, i * 500);
	 //sleep(1000);
	 }
	 */


	/*

	 //while(play){
	 for(var i = 0; i <20; i++){
	 updateBoards(b1, b2);
	 p1Turn();
	 updateBoards(b1,b2);
	 if(human){
	 humanTurn();
	 }
	 else{
	 p2Turn();
	 }
	 sleep(1000);
	 play = false;
	 }*/
	//console.log(b2);
	//console.log(b1);
}
/**
 * gameloop functions for the AI's to battle it out
 */
function gameLoop(speed){
	var loopfunc = function(){
		//console.log(b1);
		//console.log(b1.isEndState());
		//console.log(b2);
		//console.log(b2.isEndState());
		if(b1.isEndState()){
			play = false;
			clearInterval(intervalVal);
			updateBoards(b1, b2);
			setTimeout(function(){window.alert("player 2 wins!");}, 100);

		}
		if(b2.isEndState()){
			play = false;
			clearInterval(intervalVal);
			updateBoards(b1, b2);
			setTimeout(function(){window.alert("player 1 wins!");}, 100);
		}
		//isEndState(b2);
		nextTurn();
		//setTimeout(function(){nextTurn();}, i * 500);
		//sleep(1000);
	}
	intervalVal = setInterval(loopfunc,	speed);
}
/**
 * function to set the board to accept a human's turn
 */
function humanTurn(){

	//new onclick function for board
	var onclick = function(){
		var x = xId(this.id);
		var y = yId(this.id);

		if(ptInArr([y,x], b1.getOpen())){
			//TODO implement hit/miss/sink coloring - basically done
			b1.shoot([y,x]);
			if(b1.isEndState()){
				play = false;
				setMouseFunctions(1,null,null,null);
				updateBoards(b1, b2);
				setTimeout(function(){window.alert("player 2 wins!");}, 100);


			}
			nextTurn();
			if(b2.isEndState()){
				play = false;
				setMouseFunctions(1,null,null,null);
				updateBoards(b1, b2);
				setTimeout(function(){window.alert("player 1 wins!");}, 100);
			}
			nextTurn();
		}
	}
	//new onenter function for the board
	var onenter = function(){
		var x = xId(this.id);
		var y = yId(this.id);

		this.style.opacity = "0.5";/*
		 if(ptInArr([y,x], board1.getOpen())){
		 //TODO implement hit/miss/sink coloring

		 if(b1.isEndState()){
		 play = false;
		 window.alert("player 2 wins!");
		 }
		 }*/
	}
	//new onleave function for the board
	var onleave = function(){
		var x = xId(this.id);
		var y = yId(this.id);

		this.style.opacity = "1.0";
	}

	//console.log("Got Here");

	//allow pointer events on board1
	changePtrEvents(1, "auto");

	//set the mouse functions on board 1
	setMouseFunctions(1, onclick, onenter, onleave);
}

function nextTurn(){
	//console.log(performance.memory)

	if(play == false){

		clearInterval(intervalVal);
		console.log("got here: next turn2");
		updateBoards(b1, b2);
		//window.alert
		return;
	}

	if(!turn){
		turn = !turn;
		//console.log(p1Turn());
		p1Turn();


	}
	else{
		turn = !turn;
		if(human){
			humanTurn();
		}
		else{
			//console.log(p2Turn());
			p2Turn();
		}

	}
	updateBoards(b1, b2);
}
function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}
function p1Turn(){
	var move;
	if(ai1 == "Ideal AI"){
		move = idealAI(b2);
	}
	else if(ai1 == "Q-learning AI"){
		move = randAI(b2);
	}
	else{
		move = randAI(b2);
	}
	console.log("p1 move = " + move);
	return b2.shoot(move);
}
function p2Turn(){
	var move;
	if(ai2 == "Ideal AI"){
		move = idealAI(b1);
	}
	else if(ai2 == "Q-learning AI"){
		move = randAI(b1);
	}
	else{
		move = randAI(b1);
	}

	console.log("p2 move = " + move);
	return b1.shoot(move);
}

function ptInArr(point, pointArray){
	for(var i = 0; i < pointArray.length; i++){
		if(point[0] == pointArray[i][0] && point[1] == pointArray[i][1]){
			return true;
		}
	}
	return false;
}


function changePtrEvents(boardNum, setting){
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			var e = document.getElementById(boardNum.toString() + ":" + i.toString() + "," + j.toString());
			e.style.pointerEvents = setting;
		}
	}
}

