var container = document.getElementById("container");
container.style.maxWidth = "600px";
container.style.minWidth = "600px";
for(i = 0; i < 10; i++){
    var tempRow = document.createElement("div");
    tempRow.style.width = "600px";
    for(j = 0; j < 10; j++){
	var tempDiv = document.createElement("button");
	tempRow.appendChild(tempDiv);
   }
    container.appendChild(tempRow);
}
