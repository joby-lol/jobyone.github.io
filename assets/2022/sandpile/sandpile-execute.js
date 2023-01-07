//set up model and display
var model = new sandpileModel();
var display = new sandpileDisplay(document.getElementById('sandpile'), model);
display.options.left = 0;
display.options.top = 0;
display.options.width = model.options.width;
display.options.height = model.options.height;
model.options.heightComparison = "default";
model.options.distributionMethod = "random";
model.options.neighborsMethod = "square";
model.options.toppleHeight = 4;
model.reset();
model.play();
//drop a bunch of grains to get it started
for (i = 0; i < 15000; i++) {
	model.dropGrain();
}
//drop more grains
setInterval(function () {
	model.dropGrain();
}, 100);