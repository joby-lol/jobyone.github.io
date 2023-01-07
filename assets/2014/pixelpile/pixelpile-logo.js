//replace images with markup
$('.pixelpile-background-accent').each(function(){
	var $this = $(this).addClass('pixelpile-logo-block-1-1');
	var height = 1;
	var width = Math.floor($this.width()/36);
	for (i = 1;i <= width;i++) {
		$this.append('<div class="pixelpile-logo-block pixelpile-logo-block-'+(Math.ceil(i/4)%4+1)+'-'+(i%4+1)+'" />');
	}
});
$('.pixelpile-logo').html('<div class="pixelpile-logo-block pixelpile-logo-block-1-1 pixelpile-logo-block-c2"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-2-1 pixelpile-logo-block-c3"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-3-1 pixelpile-logo-block-c4"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-4-1 pixelpile-logo-block-c3"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-1-2 pixelpile-logo-block-c3"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-2-2 pixelpile-logo-block-c4"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-3-2 pixelpile-logo-block-c5"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-4-2 pixelpile-logo-block-c4"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-1-3 pixelpile-logo-block-c2"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-2-3 pixelpile-logo-block-c3"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-3-3 pixelpile-logo-block-c4"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-4-3 pixelpile-logo-block-c3"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-1-4 pixelpile-logo-block-c1"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-2-4 pixelpile-logo-block-c2"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-3-4 pixelpile-logo-block-c3"></div>'
						 +'<div class="pixelpile-logo-block pixelpile-logo-block-4-4 pixelpile-logo-block-c2"></div>');
//set up model and display
var model = new sandpileModel();
model.options.height = 12;
model.options.width = 12;
model.options.updateRate = 250;
model.options.toppleHeight = 5;
model.options.distributionMethod = "random";
model.reset();

model.setPoint(4,4,2);
model.setPoint(5,4,3);
model.setPoint(6,4,4);
model.setPoint(7,4,3);

model.setPoint(4,5,3);
model.setPoint(5,5,4);
model.setPoint(6,5,5);
model.setPoint(7,5,4);

model.setPoint(4,6,2);
model.setPoint(5,6,3);
model.setPoint(6,6,4);
model.setPoint(7,6,3);

model.setPoint(4,7,1);
model.setPoint(5,7,2);
model.setPoint(6,7,3);
model.setPoint(7,7,2);

var ppSetColor = function(x,y,color) {
	color = (color>5)?5:color;
	$object = $('.pixelpile-logo-block-'+x+'-'+y);
	$object.removeClass('pixelpile-logo-block-c0').removeClass('pixelpile-logo-block-c1').removeClass('pixelpile-logo-block-c2').removeClass('pixelpile-logo-block-c3').removeClass('pixelpile-logo-block-c4').removeClass('pixelpile-logo-block-c5').addClass('pixelpile-logo-block-c'+color);
}
setTimeout(function(){
	model.play();
	setInterval(model.dropGrain,150);
},3000);
setInterval(function(){
	ppSetColor(1,1,model.getPoint(4,4));
	ppSetColor(2,1,model.getPoint(5,4));
	ppSetColor(3,1,model.getPoint(6,4));
	ppSetColor(4,1,model.getPoint(7,4));

	ppSetColor(1,2,model.getPoint(4,5));
	ppSetColor(2,2,model.getPoint(5,5));
	ppSetColor(3,2,model.getPoint(6,5));
	ppSetColor(4,2,model.getPoint(7,5));

	ppSetColor(1,3,model.getPoint(4,6));
	ppSetColor(2,3,model.getPoint(5,6));
	ppSetColor(3,3,model.getPoint(6,6));
	ppSetColor(4,3,model.getPoint(7,6));

	ppSetColor(1,4,model.getPoint(4,7));
	ppSetColor(2,4,model.getPoint(5,7));
	ppSetColor(3,4,model.getPoint(6,7));
	ppSetColor(4,4,model.getPoint(7,7));
},50);

var hoverTimer;
$('.pixelpile-logo,.pixelpile-logo-lockup').hover(function(){
	hoverTimer = setInterval(model.dropGrain,25);
},function(){
	clearInterval(hoverTimer);
});
