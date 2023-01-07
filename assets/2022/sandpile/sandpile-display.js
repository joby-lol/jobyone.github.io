var sandpileDisplay = function (canvas,model,options) {
  var display = this;
  display.canvas = canvas;
  display.model = model;
  display.options = {
      top:0,
      left:0,
      width:model.options.width,
      height:model.options.height
  }
  display.animLoop = function() {
      requestAnimFrame(display.animLoop);
      //setTimeout(display.animLoop,1000);
      display.renderController();
  }
  display.renderController = function() {
      var points = display.getPoints();
      display.renderDebug(points);
  }
  //smooth renderer
  display.renderSmooth = function(points) {
      var ctx = display.canvas.getContext('2d');
      var colors = [
          "#000",
          "#222",
          "#444",
          "#888",
          "#00c",
      ];
      //size canvas to match exact pixel sizes for cells, let the browser do the resampling
      var cellWidth = Math.round(ctx.canvas.width/display.options.width);
      var cellHeight = Math.round(ctx.canvas.height/display.options.height);
      ctx.canvas.width = cellWidth*display.options.width;
      ctx.canvas.height = cellHeight*display.options.height;
      //build gradients
      /*var gradients = [];
      for (var i = 0; i < colors.length; i++) {
          var color = colors[i];
          var grad = ctx.createRadialGradient(cellWidth*1.5,cellHeight*1.5,cellWidth*1.5,cellHeight*1.5,cellWidth*1.5,cellHeight*1.5);
          grad.addColorStop(0,"#fff");
          grad.addColorStop(1,'#666');
          gradients.push(grad);
          console.log(gradients);
      }*/
      //fill background
      ctx.globalAlpha=1;
      ctx.fillStyle = colors[0];
      ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
      ctx.globalAlpha=0.2;
      for (var i = 0; i < points.length; i++) {
          var point = points[i];
          ctx.fillStyle = colors[point.h%colors.length];
          //ctx.fill((cellWidth-1)*point.x,(cellHeight-1)*point.y,cellWidth*3,cellHeight*3);
          ctx.arc(cellWidth*point.x-cellWidth/2,cellHeight*point.y-cellHeight/2,
                  3*cellWidth,0,2*Math.PI);
          ctx.fill();
      }
  }
  //debug renderer
  display.renderDebug = function(points) {
      var colors = [
          "#000",
          "#111",
          "#223",
          "#334",
          "#448",
          "#55a",
          "#66c",
          "#77f",
          "#88f",
          "#99f",
          "#aaf",
          "#bbf",
          "#ccf",
          "#ddf",
          "#eef",
          "#fff"
      ];
      var ctx = display.canvas.getContext('2d');
      //size canvas to match exact pixel sizes for cells, let the browser do the resampling
      var cellWidth = Math.round(ctx.canvas.width/display.options.width);
      var cellHeight = Math.round(ctx.canvas.height/display.options.height);
      ctx.canvas.width = cellWidth*display.options.width;
      ctx.canvas.height = cellHeight*display.options.height;
      //fill background
      ctx.fillStyle = colors[0];
      ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
      for (var i = 0; i < points.length; i++) {
          var point = points[i];
          ctx.fillStyle = colors[point.h%colors.length];
          ctx.fillRect(cellWidth*point.x,cellHeight*point.y,cellWidth,cellHeight);
      }
  }
  //build and sort a list of blocks
  display.getPoints = function() {
      var points = [];
      for (var x = 0; x < display.options.width; x++) {
          for (var y = 0; y < display.options.height; y++) {
              var mx = x+display.options.left;
              var my = y+display.options.top;
              var height = model.getPoint(mx,my);
              if (height > 0) {
                  points.push({x:x,y:y,h:height});
              }
          }
      }
      return points;
  }
  //only begin animation if supported
  if (display.canvas.getContext) {
      display.animLoop();
  }
}
//requestAnimationFrame shim
//shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
          window.setTimeout(callback, 1000 / 60);
        };
})();
