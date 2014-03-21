//example of histogram
var spin = null;
var ctx = null;

var img = null;

var circle = Math.PI * 2;

var drawSpin = 1;
var drawHist = false;

var spinDot = new Array([10,4],[14,6],[16,10],[14,14],[10,16],[6,14],[4,10],[6,6]);
var spinPos = 0;

var imgMax = -1;
var imgPos = -1;

var lines = new Array();

var errorSpan = 0;

function $(id) {
	return document.getElementById(id);
}

function init() {

	spin = $('spin').getContext('2d');
	ctx =  $('canvas').getContext('2d');

	ctx.fillStyle = '#919990';
	for(var i=0; i < 256; i++) {
		lines.push(new Line(i));
	}

	img = $('picture');

	img.onload = function() {

		try {

			var r, g, b;

			var n = img.height * img.width;

			for (var i=0; i < 256; i++) {
				lines[i].dest = 0;
			}

			var canvas = document.createElement('canvas');
			canvas.setAttribute('width', img.width);
			canvas.setAttribute('height', img.height);

			var tmp = canvas.getContext('2d');
			tmp.drawImage(img, 0, 0);

			var img_data = tmp.getImageData(0, 0, img.width, img.height);

			for (var i = 0; i < img.height; i++) {

				for (var j = 0; j < img.width; j++) {

					var ndx = (i * (img.width << 2)) + (j << 2);

					r = img_data.data[ndx + 0];
					g = img_data.data[ndx + 1];
					b = img_data.data[ndx + 2];

					var slot = Math.round((r + g + b) / 3);

					lines[slot].dest+= slot / n;
				}
			}

			for (var i = 0; i < 256; i++) {
				imgMax = Math.max(imgMax, lines[i].dest);
			}

			drawHist = true;
		} catch(e) {
			drawSpin = 0;
			$('picture').style.cursor = 'pointer';
		}
	}

	draw();
}

function Line(ndx) {

	this.x = ndx;
	this.y = 0;

	this.dest = 0;

	this.draw = function() {

		this.tmp = (this.y - this.dest * 300 / imgMax) / 10;
		this.y-= this.tmp;

		ctx.fillRect(this.x, 300 - this.y, 1, 300);

		return Math.abs(this.tmp) < 0.01;
	}
}

function draw() {

	if(0 != drawSpin && 0 == (drawSpin++ % 5)) {

		spin.clearRect(0, 0, 20, 20);

		if(errorSpan++ > 100) {
			errorSpan = 0;
			drawSpin = 0;
			alert("The requested image could not be displayed.");
		} else {

			spin.fillStyle = '#fff';

			spin.beginPath();
			spin.arc(10, 10, 10, 0, circle, true);
			spin.closePath();
			spin.fill();

			for (var i=0; i < 8; i++) {

				spin.fillStyle = 'rgba(50,50,50,'+(0.3 + ((spinPos + i) & 7) * 0.1)+')';

				spin.beginPath();
				spin.arc(spinDot[i][0], spinDot[i][1], 2, 0, circle, true);
				spin.closePath();
				spin.fill();
			}
			spinPos--;
		}
	}

	if(drawHist) {

		var finish = 1;

		ctx.clearRect(0, 0, 256, 300);

		for (var i = 0; i < 256; i++) {
			finish&= lines[i].draw();
		}

		if (finish == 1) {
			drawHist = false;
			drawSpin = 0;
			errorSpan = 0;
			spin.clearRect(0, 0, 20, 20);
			$('picture').style.cursor = 'pointer';
		}
	}
	window.setTimeout('draw()', 20);
}
