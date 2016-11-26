//all of these AI's are written to input states, but to not look at the location of the ships in that state at all. this can be verified by the usage of createStateForAI(state) in battleship.js



function randAI(state){
	var open = state.getOpen();
	//console.log(open);
	return open[Math.floor((Math.random() * open.length))];
}

/*unbeatable AI
  checks if it has a hit on and floating ship
  if it does, calculates different possible ship positions and chooses square with highest # of times a possible ship position contains it
  otherwise, calculate all possible ships, find the ones that have a possible & legal position, and add 1 to the probabilities if a possible & legal ship contains a point.
  take the point w/ the largest probability in probs
*/
function unbeatableAI(state){
	var probs = [];
	var doneShips = state.sunk.slice();
	for(var i = 0; i < 10; i++){
		var temp = [];
		for(var j = 0; j < 10; j++){
			temp.push(0);
		}
		probs.push(temp);
	}
	//kindof cheating here still
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	if(hitNoSunk.length > 0){
		for(var h = 0; h < hitNoSunk.length; h++){
			for(var s = 0; s < state.ships.length; s++){
				var shipLen = state.ships[s].len;
				for(var i = 0; i < 10; i++){
					for(var j = 0; j < 10; j++){
						var ship = new Ship(j,i, shipLen, true);
						if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints([hitNoSunk[h]], [ship]) && !intersectOtherShips(ship, state.sunk)){
							for(var p = 0; p < ship.getPoints().length; p++){
								var x = ship.getPoints()[p][1];
								var y = ship.getPoints()[p][0];
								probs[y][x] += 1;
							}
						}
						var ship = new Ship(j,i, shipLen, false);
						if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints([hitNoSunk[h]], [ship]) && !intersectOtherShips(ship, state.sunk)){
							for(var p = 0; p < ship.getPoints().length; p++){
								var x = ship.getPoints()[p][1];
								var y = ship.getPoints()[p][0];
								probs[y][x] += 1;
							}
						}
					}
				}
			}
		}
	}
	else{
		for(var s = 0; s < state.ships.length; s++){
			//console.log(state.ships[s]);
			var shipLen = state.ships[s].len;
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					var ship = new Ship(j,i, shipLen, true);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && !intersectOtherShips(ship, state.sunk)){
					   for(var p = 0; p < ship.getPoints().length; p++){
						   var x = ship.getPoints()[p][1];
						   var y = ship.getPoints()[p][0];
						   probs[y][x] += 1;
					   }
					}
					var ship = new Ship(j,i, shipLen, false);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && !intersectOtherShips(ship, state.sunk)){
					   for(var p = 0; p < ship.getPoints().length; p++){
						   var x = ship.getPoints()[p][1];
						   var y = ship.getPoints()[p][0];
						   probs[y][x] += 1;
					   }
					}
				}
				
			}
			
		}
	}
	


	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			if(ptInArr([j,i], state.hit) || ptInArr([j,i], state.miss)){
				probs[j][i] = 0;
			}
		}
	}
	
	var bestVal = 0;
	var best = [0,0];
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			if(probs[i][j] > bestVal){
				bestVal = probs[i][j];
				best = [i,j];
			}
		}
	}
	//console.log("best = " + best + ", bestVal = " + bestVal);
	return best;
}
