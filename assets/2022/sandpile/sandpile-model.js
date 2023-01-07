var sandpileModel = function(options) {
  var model = this;
  model.options = {
      updateRate:50,//updates every n ms
      toppleHeight:4,
      heightComparison:"global",
      distributionMethod:"ordered",
      neighborsMethod:"cross",
      height:100,
      width:100,
      maxStepsInProgress:2
  };
  model.data = [];
  //play/pause/reset handler
  model.playing = false;
  model.play = function () {
      console.log('playing');
      if (model.resetting) {
          setTimeout(model.play,model.options.updateRate);
      }else {
          model.playing = true;
          model.stepSimulation();
      }
  }
  model.pause = function () {
      model.playing = false;
  }
  model.reset = function () {
      console.log('resetting');
      model.pause;
      model.resetting = true;
      //wait if a simulation step is in progress
      if (model.stepsInProgress > 0) {
          setTimeout(model.reset,model.options.updateRate);
      }else {
          model.data = [];
          model.stepsFinished = 0;
          model.stepsInProgress = 0;
          for (var i = 0; i < model.options.height*model.options.width*model.options.toppleHeight/8; i++) {
              model.dropGrain();
          }
          model.resetting = false;
      }
  }
  //simulation step handler
  model.stepSimulation = function() {
      //check if playing
      if (!model.playing) {
          return false;
      }
      //set next timer
      setTimeout(model.stepSimulation,model.options.updateRate);
      //iterate, check if too many steps are in progress
      model.stepsInProgress++;
      if (model.stepsInProgress > model.options.maxStepsInProgress) {
          console.alert('dropped simulation step');
          model.stepsInProgress--;
          return false;
      }
      //not stepping on any toes (most likely)
      //run through simulation
      for (var x = 0; x < model.options.width; x++) {
          if (model.data[x]) {
              for (var y = 0; y < model.options.height; y++) {
                  //identify neighbors once, because it's needed twice below
                  if (model.options.neighborsMethod == "square") {
                      //neighbors are all 9 neighboring squares
                      /*
                          TODO: square neighbors method
                      */
                      var neighbors = [
                          [x-1,y-1],
                          [x,y-1],
                          [x+1,y-1],
                          [x+1,y],
                          [x+1,y+1],
                          [x,y+1],
                          [x-1,y+1],
                          [x-1,y]
                      ];
                  }else if (model.options.neighborsMethod == "diagonal") {
                      //diagonal neighbors
                      var neighbors = [
                          [x-1,y-1],
                          [x+1,y-1],
                          [x+1,y+1],
                          [x-1,y+1]
                      ]
                  }else {
                      //default is cross neighbors
                      var neighbors = [
                          [x,y-1],
                          [x+1,y],
                          [x,y+1],
                          [x-1,y]
                      ];      
                  }
                  /*
                  begin comparisons
                  */
                  var topple = 0;
                  if (model.options.heightComparison == "localLow") {
                      //instead of a maximum global height, localLow comparison checks if a cell is toppleHeight
                      //higher than its lowest neighbor
                      var lowestNeighbor = -1;
                      for (neighbor in neighbors) {
                          if (model.getPoint(neighbor[x],neighbor[y]) < lowestNeighbor || lowestNeighbor == -1) {
                              lowestNeighbor = model.getPoint(neighbor[x],neighbor[y]);
                          }
                      }
                      if (model.getPoint(x,y) >= lowestNeighbor+model.options.toppleHeight) {
                          topple = model.getPoint(x,y)-lowestNeighbor;
                          model.setPoint(x,y,lowestNeighbor);
                      }
                  }else if (model.options.heightComparison == "localHigh") {
                      //instead of a maximum global height, localLow comparison checks if a cell is toppleHeight
                      //higher than its lowest neighbor
                      var highestNeighbor = -1;
                      for (neighbor in neighbors) {
                          if (model.getPoint(neighbor[x],neighbor[y]) < highestNeighbor) {
                              highestNeighbor = model.getPoint(neighbor[x],neighbor[y]);
                          }
                      }
                      if (model.getPoint(x,y) >= highestNeighbor+model.options.toppleHeight) {
                          topple = model.getPoint(x,y)-highestNeighbor;
                          model.setPoint(x,y,highestNeighbor);
                      }
                  }else {
                      //default is global height comparison
                      if (model.getPoint(x,y) >= model.options.toppleHeight) {
                          topple = model.options.toppleHeight;
                          model.addToPoint(x,y,-topple);
                      }
                  }
                  /*
                  end comparisons
                  */
                  //distribute pile to neighbors
                  for (var i = 0; i < topple; i++) {
                      if (model.options.distributionMethod == "random") {
                          //random distribution on topple
                          var toppleTo = neighbors[Math.floor(Math.random()*neighbors.length)];
                          model.dropGrain(toppleTo[0],toppleTo[1]);
                      }else {
                          //default is ordered distribution on topple
                          var toppleTo = neighbors[i%(neighbors.length)];
                          model.dropGrain(toppleTo[0],toppleTo[1]);
                      }
                  }
              }
          }
      }
      //record step as finished
      model.stepsFinished++;
      //console.log(model.stepsFinished+' steps finished');
      if (model.stepsInProgress > 1) {
          console.log(model.stepsInProgress);
      }
      //de-iterate
      model.stepsInProgress--;
  }
  //point getter
  model.getPoint = function (x,y) {
      if (x >= model.options.width || x < 0 || y >= model.options.height || y < 0) {
          return 0;
      }
      if (!model.data[x]) {
          return 0;
      }
      if (!model.data[x][y]) {
          return 0;
      }
      return model.data[x][y]*1;
  }
  model.setPoint = function (x,y,value) {
      if (x >= model.options.width || x < 0 || y >= model.options.height || y < 0) {
          return;
      }
      if (!model.data[x]) {
          model.data[x] = [];
      }
      model.data[x][y] = value;
  }
  model.addToPoint = function (x,y,amount) {
      if (x >= model.options.width || x < 0 || y >= model.options.height || y < 0) {
          return;
      }
      if (!model.data[x]) {
          model.data[x] = [];
      }
      if (!model.data[x][y]) {
          model.data[x][y] = 0;
      }
      model.data[x][y] = model.data[x][y]+amount;
  }
  //grain dropper
  model.dropGrain = function (x,y) {
      if (x !== 0) {
          x = x?x:Math.floor(Math.random()*model.options.width);
      }
      if (y !== 0) {
          y = y?y:Math.floor(Math.random()*model.options.height);
      }
      model.addToPoint(x,y,1);
  }
}