function Ship(x, y, len, horiz){
    this.x = x;
    this.y = y;
    this.len = len;
    this.horiz = horiz;
}



function Gui(human = true, parent){
    //setup boards
    this.parent = parent;
    this.board1 = document.createElement("div");
    this.board2 = document.createElement("div");
    this.board2.id = "board2";
    this.board1.id = "board1";
    board1.className += "board";
    board2.className += "board";
    //label boards
    var temp = document.createElement("p");
    temp.innerHTML += "Player 1 (AI)";
    temp.className += "boardLabel";
    board1.appendChild(temp);
    temp = document.createElement("p");
    temp.innerHTML += "Player 2";
    temp.className += "boardLabel";
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
	    tempDiv1.onclick = buttonClick;
	    tempDiv2.onclick = buttonClick;
	    tempDiv1.className += "square";
	    tempDiv2.className += "square";
	    tempDiv1.id = "1," + i + "," + j;
	    tempDiv2.id = "2," + i + "," + j;
	    tempRow1.appendChild(tempDiv1);
	    tempRow2.appendChild(tempDiv2);
	}
	this.board1.appendChild(tempRow1);
	this.board2.appendChild(tempRow2);
    }
    parent.appendChild(this.board1);
    parent.appendChild(this.board2);
    this.toggleAI = document.createElement("div");
    var temp = document.createElement("div");
    temp.id = "toggle";
    temp.className = "toggle-down";
    this.toggleHuman = function(){
	var tog = document.getElementById("toggle");
	var ss = document.getElementById("shipSelect");
	if(this.human){
	    tog.className = "toggle-down";
	    tog.innerHTML = "Player 2 AI is OFF";
	    //ss.style.display = "block";
	    ss.style.opacity = "1.0";
	    ss.style.pointerEvents = "auto";
	    this.human = false;
	}
	else{
	    tog.className = "toggle-up";
	    this.human = true;
	    //ss.style.display = "none";
	    ss.style.opacity = "0.5";
	    ss.style.pointerEvents = "none";
	    tog.innerHTML = "Player 2 AI is ON";
	}
    }


    
    
    temp.innerHTML = "Player 2 AI is OFF";
    temp.onclick = this.toggleHuman;
    this.toggleAI.appendChild(temp);
    this.shipSelect = null;
    this.selectedShipLen = null;

    

    
    
    
    //setup ship select bar
    if(human){
	this.shipSelect = document.createElement("div");
	this.shipSelect.id= "shipSelect"
	var temp = document.createElement("p");
	temp.innerHTML += "Carrier";
	temp.id = "Carrier";
	temp.onclick = selectClick;
	//console.log(temp.innerHTML);
	this.shipSelect.appendChild(temp);
	//console.log(temp.innerHTML);
	temp = document.createElement("p");
	temp.innerHTML = "Battleship";
	temp.id = "Battleship";
	this.shipSelect.appendChild(temp);
	temp = document.createElement("p");
	temp.innerHTML = "Submarine";
	temp.id="Submarine";
	this.shipSelect.appendChild(temp);
	temp = document.createElement("p");
	temp.innerHTML = "Destroyer";
	temp.id = "Destroyer";
	this.shipSelect.appendChild(temp);
	temp = document.createElement("p");
	temp.id = "Patrol";
	temp.innerHTML = "Patrol Boat";
	this.shipSelect.appendChild(temp);
	parent.appendChild(this.shipSelect);
    }
    parent.appendChild(this.toggleAI);
    
}





var container = document.getElementById("container");
var gui = Gui(true, container);
/*
container.style.maxWidth = "600px";
container.style.minWidth = "600px";
for(i = 0; i < 10; i++){
    var tempRow = document.createElement("div");
    tempRow.style.width = "600px";
    for(j = 0; j < 10; j++){
	var tempDiv = document.createElement("button");
	tempDiv.onclick = buttonClick;
	tempDiv.id = "" + i + "," + j;
	tempRow.appendChild(tempDiv);
   }
    container.appendChild(tempRow);
}
*/

function placementHover(){
	this.style.backgroundColor = "#000000";
    }
    
function setPlacementOnHovers(){
    board2 = document.getElementById("board2");
    for(r in board2.childNodes){
	if(r.tagName == "div"){
	    for(s in r.childNodes){
		s.onmouseover = placementHover;
	    }
	}
    }
}

function selectClick(){
	if(this.id == "Carrier"){
	    selectedShipLen = 5;
	    setPlacementOnHovers();
	    console.log("got here");
	}
	else{
	    console.log(this.id);
	}
    }

function buttonClick(){
    console.log(this.id);
    this.style.backgroundColor = "#000000";
}



