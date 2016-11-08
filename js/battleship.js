
function Gui(human = true, parent){


    this.board1 = document.createElement("div");
    this.board2 = document.createElement("div");
    this.board2.id = "board2";
    this.board1.id = "board1";
    board1.className += "board";
    board2.className += "board";
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
function buttonClick(){
    console.log(this.id);
    this.style.backgroundColor = "#000000";
}



