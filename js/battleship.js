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
var ai1 = null;
var ai2 = null;
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

}


//function to announce win and set the counter for each player
player1WinCount = 0;
player2WinCount = 0;
function announceWin(playerN) {
	if (playerN === 1) {
		player1WinCount++;
		document.getElementById("player1score").innerText = player1WinCount;
	}
	else if (playerN === 2) {
		player2WinCount++;
		document.getElementById("player2score").innerText = player2WinCount;
	}
	else {
		console.log("should only pass 1 or 2 to announceWin: " + playerN + "passed instead")
	}

	document.getElementById("aiSelect1").disabled = false;
	var aiSelect2 = document.getElementById("aiSelect2");
	if (aiSelect2 !== null)
		aiSelect2.disabled = false;

	window.alert("player " + playerN + " wins!");
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
			setTimeout(function(){announceWin(2);}, 100);
			ga('send', 'event',{
				'eventCategory': ai2,
				'eventAction': ai1,
				'eventValue': 1});
		}
		if(b2.isEndState()){
			play = false;
			clearInterval(intervalVal);
			updateBoards(b1, b2);
			setTimeout(function(){announceWin(1);}, 100);
			ga('send', 'event',{
				'eventCategory': ai2,
				'eventAction': ai1,
				'eventValue': 0});
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
				setTimeout(function(){announceWin(2);}, 100);
			    ga('send', 'event',{
				'eventCategory': ai2,
				'eventAction': ai1,
				'eventValue': 1});

			}
			nextTurn();
			if(b2.isEndState()){
				play = false;
				setMouseFunctions(1,null,null,null);
				updateBoards(b1, b2);
				setTimeout(function(){announceWin(1);}, 100);
				ga('send', 'event',{
				'eventCategory': ai2,
				'eventAction': ai1,
				'eventValue': 0});
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

//function to emulate the next turn, can differentiate between whose turn it is and whether the player is human.
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
		turnCount++;
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


function p1Turn(){
	var move;
	if(ai1 == "Unbeatable AI"){
		move = unbeatableAI(b2);
	}
	else if(ai1 == "Q-learning AI"){
		move = qlearningAI(b2);
	}
	else{
		move = randAI(b2);
	}
	console.log("p1 move = " + move);
	return b2.shoot(move);
}
function p2Turn(){
	var move;
	if(ai2 == "Unbeatable AI"){
		move = unbeatableAI(b1);
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

