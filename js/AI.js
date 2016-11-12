function randAI(state){
    var open = state.getOpen();
    //console.log(open);
    return open[Math.floor((Math.random() * open.length))];
}
