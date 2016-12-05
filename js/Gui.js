var container = null;
var human = true;
var selectShipHoriz = true;
var selectShipButton = null;
var selectShip = null;
var selectShipLen = null;

var b2Ships = [];
var turnCount = 0;
var totalTurns = 0;
var numGames = 0;
var options = ["Random AI", "Q-learning AI", "Unbeatable AI"];
var ai1 = options[1];
var ai2 = options[2];
//function to initialize the beginning GUI in the element with id "container"
//creates boards and settings, gives each button and element the correct mouse functions
function initGui(){
	turnCount = 0;
	container = document.getElementById("container");

	//setup scoreboard reset onclick
	document.getElementById("scoreBoard").onclick = resetScoreBoard;
	document.getElementById("scoreBoard").title = "Reset Scoreboard";
	document.getElementById("scoreBoard").style.cursor = "pointer";
	//create divs for the boards
	var board1 = document.createElement("div");
	var board2 = document.createElement("div");
	board2.id = "board2";
	board1.id = "board1";
	//board1.style.pointerEvents = "none";
	board1.className += "board";
	board2.className += "board";


	//player 1 board label  & AI dropdown
	var temp = document.createElement("p");
	temp.innerHTML += "Player 1 ";
	temp.className += "boardLabel";
	var aiSelect = document.createElement("select");
	for (var i = 0; i < options.length; i++) {
		var option = document.createElement("option");
		option.value = options[i];
		option.text = options[i];
		aiSelect.appendChild(option);
	}
	//set id so its value can be accessed later
	aiSelect.id = "aiSelect1";
	aiSelect.selectedIndex = options.indexOf(ai1);
	aiSelect.onchange = function(){ai1 = aiSelect.options[aiSelect.selectedIndex].value;};
	temp.appendChild(aiSelect);
	board1.appendChild(temp);

	//player 2 board label
	temp = document.createElement("p");
	temp.innerHTML += "Player 2";
	temp.className += "boardLabel";

	//add id so we can change the label depending on ai toggle
	temp.id = "player2label";

	board2.appendChild(temp);


	//fill boards with divs
	for(i = 0; i < 10; i++){
		var tempRow1 = document.createElement("div");
		var tempRow2 = document.createElement("div");
		tempRow1.className += "row";
		tempRow2.className += "row";
		for(j = 0; j < 10; j++){
			var tempDiv1 = document.createElement("div");
			var tempDiv2 = document.createElement("div");
			//tempDiv1.onclick = buttonClick;
			//tempDiv2.onclick = buttonClick;

			//make it part of the square class
			tempDiv1.className += "square";
			tempDiv2.className += "square";

			//label each square in format "board#:row#,column#"
			tempDiv1.id = "1:" + i + "," + j;
			tempDiv2.id = "2:" + i + "," + j;
			//append squares to rows
			tempRow1.appendChild(tempDiv1);
			tempRow2.appendChild(tempDiv2);
		}
		//append rows to board
		board1.appendChild(tempRow1);
		board2.appendChild(tempRow2);
	}
	//append boards to container
	container.appendChild(board1);
	container.appendChild(board2);


	//create toggle AI div and button
	//not really sure why I decided I needed it housed in a div, but it works...
	var toggleAI = document.createElement("div");
	toggleAI.id = "toggleAI";
	var temp = document.createElement("button");
	temp.id = "toggle";
	temp.className = "toggle-down";
	temp.innerHTML = "Player 2 AI is OFF";
	temp.onclick = toggleHuman;

	//append button to div, div will be appended to container later
	toggleAI.appendChild(temp);





	//setup AI settings bar (ai speed)

	var aiset = document.createElement("div");
	aiset.id = "aiset";
	var temp = document.createElement("label");
	temp.htmlfor = "AIspeed";
	var t = document.createTextNode("AI speed");
	temp.appendChild(t);
	aiset.appendChild(temp);

	temp = document.createElement("input");
	temp.value = speed.toString();
	temp.id = "AIspeed";
	temp.name = "AIspeed";
	temp.type = "range";
	t = document.createElement("span");
	t.id = "gameSpeedP";
	//console.log(document.getElementById("AINumGames"));
	t.innerHTML = speed * 20 + " ms";
	
	temp.oninput = function(){
		document.getElementById("gameSpeedP").innerHTML = parseInt(document.getElementById("AIspeed").value) * 20 + " ms";
	};
	aiset.appendChild(temp);
	aiset.appendChild(t);

	var sameShipsCheck = document.createElement("input");
	sameShipsCheck.type = "checkbox";
	sameShipsCheck.id = "sameShipsCheck";
	sameShipsCheck.name = "sameShipsCheck";
	sameShipsCheck.value = "sameShipsCheck";
	sameShipsCheck.checked = sameShips;
	sameShipsCheck.onchange = function(){ sameShips = this.checked;};
	var sameShipsCheckLabel = document.createElement("label");
	sameShipsCheckLabel.htmlfor = "sameShipsCheck";
	var sameShipsCheckLabelText = document.createTextNode("Same Ships?");
	sameShipsCheckLabel.appendChild(sameShipsCheckLabelText);
	aiset.appendChild(sameShipsCheck);
	aiset.appendChild(sameShipsCheckLabel);
	
	temp = document.createElement("br");
	aiset.appendChild(temp);

	var numGamesLabel = document.createElement("label");
	numGamesLabel.htmlfor = "AINumGames";
	var numGamesLabelText = document.createTextNode("# of games");
	numGamesLabel.appendChild(numGamesLabelText);
	aiset.appendChild(numGamesLabel);
	
	var numGamesS = document.createElement("input");
	numGamesS.value = gameLoopNum.toString();
	numGamesS.id = "AINumGames";
	numGamesS.name = "AINumGames";
	numGamesS.type = "range";
	numGamesS.min = 1;
	numGamesS.max = 100;
	numGamesS.oninput = function(){
		document.getElementById("numGamesP").innerHTML = document.getElementById("AINumGames").value;
	};
	aiset.appendChild(numGamesS);
	var numGamesSpan = document.createElement("span");
	numGamesSpan.id = "numGamesP";
	//console.log(document.getElementById("AINumGames"));
	numGamesSpan.innerHTML = numGamesS.value;
	aiset.appendChild(numGamesSpan);
	//temp = document.createElement("br");
	//aiset.appendChild(temp);

	//create game start button for player2 AI on
	temp = document.createElement("button");
	temp.innerHTML = "Start AI Game";
	temp.id = "startButton";
	//set start game function
	temp.onclick = function(){
		gameLoopNum = parseInt(document.getElementById("AINumGames").value);
		disableSettings();
		gameStarted();
		gameInit();
	};
	aiset.appendChild(temp);
	aiset.style.display = "none";
	container.appendChild(aiset);


	//setup ship select bar


	var shipSelect = createShipSelect();

	//append shipselect and toggle AI div
	container.appendChild(shipSelect);
	container.appendChild(toggleAI);

	//create and append reset button
	var resetButton = document.createElement("button");
	resetButton.innerHTML = "Reset";
	resetButton.id="resetButton";
	resetButton.onclick = reset;	
	resetButton.style.display = "inline-block";
	container.appendChild(resetButton);

	var turnCountP = document.createElement("p");
	turnCountP.innerHTML = "Turn Count: " + turnCount;
	turnCountP.id = "turnCount";
	container.appendChild(turnCountP);

	
	var avgTurnCountP = document.createElement("p");
	var avg = 0;
	console.log("numGames =" + numGames);
	if(numGames > 0){
		
		avg = totalTurns / numGames;
	}
	avgTurnCountP.innerHTML = "Average Turn Count: " + avg;
	avgTurnCountP.id = "avgTurnCount";
	avgTurnCountP.onclick = resetAverageLength;
	avgTurnCountP.style.cursor = "pointer";
	avgTurnCountP.title = "Reset Average Turn Count";
	container.appendChild(avgTurnCountP);
	if(!human){
		human = true;
		toggleHuman();
	}
}




//function to create ship select
function createShipSelect(){
	var shipSelect = document.createElement("div");
	shipSelect.id= "shipSelect"

	var temp = document.createElement("p");

	temp.innerHTML += "Carrier";
	temp.id = "Carrier";
	temp.onclick = selectClick;
	//console.log(temp.innerHTML);
	temp.style.userSelect = "none";
	shipSelect.appendChild(temp);
	//console.log(temp.innerHTML);

	//battleship ship select element
	temp = document.createElement("p");
	temp.innerHTML = "Battleship";
	temp.id = "Battleship";
	temp.onclick = selectClick;
	temp.style.userSelect = "none";
	shipSelect.appendChild(temp);

	//submarine ship select element
	temp = document.createElement("p");
	temp.innerHTML = "Submarine";
	temp.id="Submarine";
	temp.onclick = selectClick;
	temp.style.userSelect = "none";
	shipSelect.appendChild(temp);

	//Destroyer ship select element
	temp = document.createElement("p");
	temp.innerHTML = "Destroyer";
	temp.id = "Destroyer";
	temp.onclick = selectClick;
	temp.style.userSelect = "none";
	shipSelect.appendChild(temp);

	//Patrol boat ship select element
	temp = document.createElement("p");
	temp.id = "Patrol";
	temp.onclick = selectClick;
	temp.style.userSelect = "none";
	temp.innerHTML = "Patrol Boat";
	shipSelect.appendChild(temp);


	//temp = document.createElement("br");
	//shipSelect.appendChild(temp);

	//rotate ship button for ship select
	temp = document.createElement("button");
	temp.onclick = rotateShip;
	temp.innerHTML = "Rotate Ship";
	temp.id = "rotateShipButton";
	shipSelect.appendChild(temp);

	//human start game button created
	temp = document.createElement("button");
	temp.onclick = function(){
		this.style.pointerEvents = "none";
		disableSettings();
		gameStarted();
		gameInit();
	};
	temp.innerHTML = "Start Game";
	temp.id = "humanStartGameButton";
	//cant click it until ships have all been placed
	temp.style.opacity = "0.5";
	temp.style.pointerEvents = "none";
	shipSelect.appendChild(temp);

	return shipSelect;
}

//function to reset the game and gui
function reset(){
	
	//human = true;
	selectShipHoriz = true;
	selectShipButton = null;
	selectShip = null;
	selectShipLen = null;
	b2Ships = [];
	//initGui();
	b2 = null;//board2
	b1 = null;//board1
	turn = false; //false for p1, true for p2
	play = true; //play state
	if(intervalVal != null){
		clearInterval(intervalVal);
	}
	intervalVal = null;
	var speed = document.getElementById("AIspeed").value;
	while (container.firstChild) {
		container.removeChild(container.firstChild);

	}
	container = null;
	initGui();
	document.getElementById("AIspeed").value = speed;
	if(ai1 != null){
		document.getElementById("aiSelect1").value = ai1;
	}
	if(ai2 != null){
	document.getElementById("aiSelect2").value = ai2;
	}
}


/*
function buttonClick(){
	//console.log(this.id);
	this.style.backgroundColor = "#000000";
}
*/
//button click function to rotate ship
function rotateShip(){
	selectShipHoriz = !selectShipHoriz;
	if(selectShipButton != null){
		setPlacementOnHovers(selectShipLen, selectShipHoriz);
	}
}

//extract y coordinate from id
function yId(id){
	return parseInt(id.slice(id.indexOf(":") + 1, id.indexOf(",")));
}
//extract x coordinate from id
function xId(id){
	return parseInt(id.slice(id.indexOf(",") + 1));
}

//select click function for the ship select elements (battleship, carrier, etc.)
//sets the placement on hover functions as needed for each ship select button
function selectClick(){
    //turn the button clicked green
    this.style.color = "green";

    //if a ship select button was pressed before, check which one it was
    if(selectShipButton != null){
	//if it was this button
	if(selectShipButton == this){
	    //deselect and set button color to black and return
	    selectShipButton.style.color = "black";
	    selectShipButton = null;
	    selectShip = null;
	    return;
	}

	//otherwise, set the previously selected button to black
	else{
	    selectShipButton.style.color = "black";
	    
	}
    }
    //set the ship selection button as the caller of this function
    selectShipButton = this;

    //check which ship this button selects, and set the proper hover length
	if(this.id == "Carrier"){
		setPlacementOnHovers(5, selectShipHoriz);
	}
	else if(this.id == "Battleship"){
		setPlacementOnHovers(4, selectShipHoriz);

	}
	else if(this.id == "Submarine"){
		setPlacementOnHovers(3, selectShipHoriz);
	}
	else if(this.id == "Destroyer"){
		setPlacementOnHovers(3, selectShipHoriz);
	}
	else if(this.id == "Patrol"){
		setPlacementOnHovers(2, selectShipHoriz);
	}
}

//removes all onhovers/onclicks for board 2
function removeOnHovers(){
    //call set mouse functions in such a way that will remove all function for board 2
	setMouseFunctions(2, null, null, null, null);
}

//sets the on enter, on leave, and on click functions for a given board.
function setMouseFunctions(boardNum, onclick, onenter, onleave, oncontext = null){
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			var e = document.getElementById(boardNum.toString() + ":" + i.toString() + "," + j.toString());
			//console.log(boardNum.toString() + ":" + i.toString() + "," + j.toString());
			e.onmouseenter = onenter;
			e.onmouseleave = onleave;
			e.onclick = onclick;
			if(oncontext != null){
				e.oncontextmenu = oncontext(e.id);
			}
		}
	}

}

//setup the gui when the human has placed all their ships
function humanGameReadyToStart() {
	//start game
	//document.getElementById("toggleAI").style.pointerEvents = "none";
	var startButton = document.getElementById("humanStartGameButton");
	startButton.style.pointerEvents = "auto";
	startButton.style.opacity = "1.0";
	//window.alert("Game would start now");
	disableSettings();
	//gameInit();
}

//disable aiselects when the game starts
function gameStarted() {
	document.getElementById("aiSelect1").disabled = true;
	var aiSelect2 = document.getElementById("aiSelect2");
	if (aiSelect2 !== null)
		aiSelect2.disabled = true;
	disableSettings();
}

//creates funtions for placement and applies them to the buttons on board 2
function setPlacementOnHovers(length, horiz){
	selectShipLen = length;
	var onmouseenter = function(){
		if(selectShipButton == null){
			return
		}
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
			//console.log("doesn't intersect");
			if(ship.validLoc()){
				//console.log("" + ship.getPoints());
				for(var i = 0; i < ship.len; i++){
					//console.log("" + ship.getPoints()[i]);
					document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "green";

				}

			}
			else{
				this.style.backgroundColor = "red";
			}
		}
		else{
			this.style.backgroundColor = "red";
		}
	};

	var onmouseleave = function(){

		if(selectShipButton == null){
			return
		}
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
			if(ship.validLoc()){
				//console.log("" + ship.getPoints());
				for(var i = 0; i < ship.len; i++){
					//console.log("" + ship.getPoints()[i]);
					document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "#aaaaaa";
				}
			}
			else{
				this.style.backgroundColor = "#aaaaaa";
			}
		}
		else{
			if(shipsContainPoint(y,x,b2Ships)){
				this.style.backgroundColor = "blue";
			}
			else{
				this.style.backgroundColor = "#aaaaaa";
			}

		}

	};

	var onclick = function(){
		if(selectShipButton == null){
			return
		}
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
			if(ship.validLoc()){
				for(var i = 0; i < ship.len; i++){
					//console.log("" + ship.getPoints()[i]);
					document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "blue";
				}
				b2Ships.push(ship);
				//console.log(b2Ships);
				selectShipButton.style.pointerEvents = "none";

				selectShipButton.style.color = "black";
				selectShipButton.style.opacity = "0.5";
				selectShipButton = null;
				removeOnHovers();
				console.log("b2Ships.length = " + b2Ships.length);
				if(b2Ships.length == 5){
					humanGameReadyToStart();
				}

			}
		}
	};
	var rship = function(id){
		return function(){
	
		document.getElementById(id).onmouseleave();
		rotateShip();
		document.getElementById(id).onmouseenter();
		
			return false;
		};
	};
	setMouseFunctions(2, onclick, onmouseenter, onmouseleave, rship);

}

//function to be called when the toggle human button is clicked
function toggleHuman(){
	var tog = document.getElementById("toggle");
	var ss = document.getElementById("shipSelect");
	var aiset = document.getElementById("aiset");
	var p2l = document.getElementById("player2label");
	if(!human){
		tog.className = "toggle-down";
		tog.innerHTML = "Player 2 AI is OFF";
		ss.style.display = "block";
		aiset.style.display = "none";
		//ss.style.display = "block";
		//ss.style.opacity = "1.0";
		//ss.style.pointerEvents = "auto";
		p2l.innerHTML = "Player 2";
		//ai2 = null;
		human = true;
	}
	else{
		tog.className = "toggle-up";
		human = false;
		//ss.style.display = "none";
		ss.style.display = "none";
		aiset.style.display = "block";
		p2l.innerHTML = "Player 2 ";

		var aiSelect = document.createElement("select");
		for (var i = 0; i < options.length; i++) {
			var option = document.createElement("option");
			option.value = options[i];
			option.text = options[i];
			aiSelect.appendChild(option);
		}
		//set id so its value can be accessed later
		aiSelect.id = "aiSelect2";
		aiSelect.selectedIndex = options.indexOf(ai2);
		aiSelect.onchange = function(){ai2 = aiSelect.options[aiSelect.selectedIndex].value;};
		p2l.appendChild(aiSelect);
		//ss.style.opacity = "0.5";
		//ss.style.pointerEvents = "none";
		tog.innerHTML = "Player 2 AI is ON";
		removeOnHovers();
		if(selectShipButton != null){
			selectShipButton.style.color = "black";
			selectShipButton = null;
			selectShipLen = null;
			selectShip = null;
		}
		//gameInit();
	}
}

//function to update the boards given two current states
function updateBoards(state1, state2){
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			var e1 = document.getElementById("1:" + i.toString() + "," + j.toString());
			var e2 = document.getElementById("2:" + i.toString() + "," + j.toString());
			e1.style.backgroundColor = "#aaaaaa";
			e2.style.backgroundColor = "#aaaaaa";

		}
	}
	//Show ships for b1 if human not playing or game over
	if(!human || !play){
		for(i = 0; i < state1.ships.length; i++){
			var ship = state1.ships[i];
			for(j = 0; j < ship.getPoints().length; j++){
				var pt = ship.getPoints()[j];
				var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
				e.style.backgroundColor = "blue";
			}
		}
	}
	for(i = 0; i < state2.ships.length; i++){
		var ship = state2.ships[i];
		for(j = 0; j < ship.getPoints().length; j++){
			var pt = ship.getPoints()[j];
			var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
			e.style.backgroundColor = "blue";

		}
	}
	//Show hits
	for(i = 0; i < state1.hit.length; i++){
		var pt = state1.hit[i];
		var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
		e.style.backgroundColor = "red";
	}

	for(i = 0; i < state2.hit.length; i++){
		var pt = state2.hit[i];
		var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
		e.style.backgroundColor = "red";
	}

	//Show misses
	for(i = 0; i < state1.miss.length; i++){
		var pt = state1.miss[i];
		var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
		e.style.backgroundColor = "green";
	}

	for(i = 0; i < state2.miss.length; i++){
		var pt = state2.miss[i];
		var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
		e.style.backgroundColor = "green";
	}
	//console.log("state1.sunk = " + state1.sunk);
	for(i = 0; i < state1.sunk.length; i++){
		var s = state1.sunk[i];
		for(j = 0; j < s.getPoints().length; j++){
			var pt = s.getPoints()[j];
			var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
			e.style.backgroundColor = "black";
		}
	}
	for(i = 0; i < state2.sunk.length; i++){
		var s = state2.sunk[i];
		for(j = 0; j < s.getPoints().length; j++){
			var pt = s.getPoints()[j];
			var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
			e.style.backgroundColor = "black";
		}
	}
	document.getElementById("turnCount").innerHTML = "Turn Count: " + turnCount;

}

//function to disable the settings
function disableSettings(){
	document.getElementById("toggleAI").style.pointerEvents = "none";
	document.getElementById("toggle").style.pointerEvents = "none";
	document.getElementById("rotateShipButton").style.pointerEvents = "none"
	document.getElementById("startButton").style.pointerEvents = "none";
	document.getElementById("AIspeed").style.pointerEvents = "none"
	document.getElementById("AINumGames").style.pointerEvents = "none"
	document.getElementById("sameShipsCheck").style.pointerEvents = "none"
	document.getElementById("aiSelect1").style.pointerEvents = "none"
	document.getElementById("aiSelect1").style.opacity = ".5";
	if(document.getElementById("aiSelect2") != null){
		document.getElementById("aiSelect2").style.pointerEvents = "none"
		document.getElementById("aiSelect2").style.opacity = ".5";
	}
	document.getElementById("aiset").style.opacity = ".5";
	setAIvals();
	//document.getElementById("humanStartGameButton").style.pointerEvents = "none"
}

//function  to set AI vals from the selectors
function setAIvals(){
	if(human){
		ai2 = null;
	}
	else{
		ai2 = document.getElementById("aiSelect2").value;
		console.log("ai2 = " + ai2);
	}
	ai1 = document.getElementById("aiSelect1").value;
}

function resetScoreBoard(){
	player1WinCount = 0;
	player2WinCount = 0;
	document.getElementById("player1score").innerText = player1WinCount;
	document.getElementById("player2score").innerText = player2WinCount;
}

function resetAverageLength(){
	totalTurns = 0;
	numGames = 0;
	setAverageLength();
}
function setAverageLength(){
	var avg = 0;
	if(numGames > 0){
		avg = totalTurns / numGames;
	}
	console.log("setting avgLength");
	document.getElementById("avgTurnCount").innerText = "Average Turn Count: " + avg;
}
