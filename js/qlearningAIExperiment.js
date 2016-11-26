//var Status = {hit: "hit", miss: "miss", sunk: "sunk" }; found in State.js
var qValues = null;//5 dimensional array of q values for each square given the square and state of that square.
//given square[][]
//given state[]
//each square q value[][]
var lastMove = null;
var hitReward = 6;
var learnRate = 0.2;
var discountFactor = 0.9;
var missReward = -1;


function initQLearning(){
	qValues = [];
	for(var i = 0; i < 10; i++){
		var yg = [];
		for(var j = 0; j < 10; j++){
			var xg = [];
			for(var k = 0; k < 4; k++){
				var s = [] ;
				for(var l = 0;l < 10; l++){
					var yo = [];
					for(var m = 0; m < 10; m++){
						yo.push(0);
					}
					s.push(yo);
				}
				xg.push(s);
			
			}
			yg.push(xg);
		}
		qValues.push(yg);
	}
}
						
function qlearningAI(state) {
	if(qValues == null){
		initQLearning();
	}


	console.log("qvals = ");
	console.log(qValues);
	// TODO
	//assumes lastmove holds: [y,x], checks result on board. null if there was no last move.
	if(lastMove != null){
		//update q-values
		/*
		for(var i = 0; i < 10; i++){
			var yg = [];
			for(var j = 0; j < 10; j++){
				var xg = [];
				for(var k = 0; k < 4; k++){
					var s = [] ;
					for(var l = 0;l < 10; l++){
						var yo = [];
						for(var m = 0; m < 10; m++){
						}
					}
				}
			}
		}*/
		/*
		if(ptInArr(lastMove, state.hit)){
			var q = qvalues[lastMove[0]][lastMove[1]][hit];
			for(var i = 0; i < state.hit.length; i++){
				if(lastMove[0] != state.hit[i][0] || lastMove[1] != state.hit[i][1]){
					var oldQVal = q[state.hit[i][0]][state.hit[i][1]];
					q[state.hit[i][0]][state.hit[i][1]] += learnRate * ( hitReward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				}
			}
			for(var i = 0; i < state.miss.length; i++){
				if(lastMove[0] != state.miss[i][0] || lastMove[1] != state.hit[i][1]){
					var oldQVal = q[state.hit[i][0]][state.hit[i][1]];
					q[state.hit[i][0]][state.hit[i][1]] += learnRate * ( hitReward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				}
			}*/
		var reward = 0;
		if(state.getBoard()[lastMove[0]][lastMove[1]] == Status.hit){
			reward = hitReward;
		}
		else if(state.getBoard()[lastMove[0]][lastMove[1]] == Status.miss){
			reward = missReward;
		}
		for(var i = 0; i < 10; i++){			
			for(var j = 0; j < 10; j++){
				if(i!= lastMove[0] || j != lastMove[1]){
					var b = state.getBoard();
					/*
					  var reward = 0;
					  if(b[i][j] == Status.hit){
					  reward = hitReward;
					  }
					  else if(b[i][j] == Status.miss){
					  reward = missReward;
					  }*/
					var oldQVal = qValues[i][j][b[i][j]][lastMove[0]][lastMove[1]];
					qValues[i][j][b[i][j]][lastMove[0]][lastMove[1]] += learnRate * ( reward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				}
			}
		}
		for(var i = 0; i < 10; i++){			
			for(var j = 0; j < 10; j++){
				if(i!= lastMove[0] || j != lastMove[1]){
					var reward = 0;
					var b = state.getBoard();
					if(b[i][j] == Status.miss){
						reward = missReward;
					}
					else if(b[i][j] = Status.hit){
						reward = hitReward;
					}
					
					var oldQVal = qValues[lastMove[0]][lastMove[1]][b[lastMove[0]][lastMove[1]]][i][j];
					qValues[lastMove[0]][lastMove[1]][b[lastMove[0]][lastMove[1]]][i][j] += learnRate * ( reward + (discountFactor * oldQVal - oldQVal) );
				}
				
			}
		}
	}
	console.log("qvals = ");
	console.log(qValues);
	var sum = emptyBoard();
	//console.log("state = ");
	//console.log(state);

	var hitNoSink = [];
	for(var i = 0; i < state.hit.length; i++){
		if(!shipsContainPoints(state.hit[i][0], state.hit[i][1], state.sunk)){
			hitNoSink.push(state.hit[i].slice());
		}
	}
	//if(hitNoSink == []){
	
	//get the sum of the hit q-values
	for(var i = 0; i < hitNoSink.length; i++){
		sum = sumBoard(sum, qValues[hitNoSink[i][0]][hitNoSink[i][1]][Status.hit]);
	}
	for(var i = 0; i < state.miss.length; i++){
		//console.log(state.miss[i]);
		sum = sumBoard(sum, qValues[state.miss[i][0]][state.miss[i][1]][Status.miss]);
	}
	for(var i = 0; i < state.sunk.length; i++){
		for(var j = 0; j < state.sunk[i].len; j++){
			sum = sumBoard(sum, qValues[state.sunk[i].getPoints()[j][0]][state.sunk[i].getPoints()[j][1]][Status.sunk]);
		}
	}
	//console.log(state.getOpen());
	for(var i = 0; i < state.getOpen().length; i++){
		//console.log(state.getOpen()[i]);
		sum = sumBoard(sum, qValues[state.getOpen()[i][0]][state.getOpen()[i][1]][Status.unknown]);
	}
	//}
	/*else{
		for(var i = 0; i < hitNoSink.length; i++){
			sum = sumBoard(sum, qValues[hitNoSink[i][0]][hitNoSink[i][1]][Status.hit]);
		}
	}*/
	console.log("sum = ");
	console.log(sum);

	var bestVal = Number.MIN_SAFE_INTEGER;
	var best = [0,0];
	for(var i = 0 ; i < 10; i++){
		for(var j = 0 ; j < 10; j++){
			if(bestVal < sum[i][j] && ptInArr([i,j], state.getOpen())){
				best = [i,j];
				bestVal = sum[i][j];
			}
		}
	}
	//console.log(best);
	lastMove = best;
	return best;
	//createpossible states for each square - hit, miss, unknown, sunk
//	return randAI(state);
}

function sumBoard(arr2D1, arr2D2){
	var ret = emptyBoard();
	for(var i = 0; i < arr2D1.length; i++){
		for(var j = 0; j < arr2D1[i].length; j++){
			ret[i][j] = arr2D1[i][j] + arr2D2[i][j];
		}
	}
	return ret;
}

function emptyBoard(){
	var ret = [];
	for(var i = 0; i < 10; i++){
		var innerRet = [];
		for(var j = 0; j < 10; j++){
			innerRet.push(0);
			}
		ret.push(innerRet);
	}
	return ret;
}
