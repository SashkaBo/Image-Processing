function CanvasImage(canvas, src) {
  var context = canvas.getContext('2d');
  var i = new Image();
  var that = this;
  image.onload = function() {
    canvas.width = i.width;
    canvas.height = i.height;
    context.drawImage(i, 0, 0, i.width, i.height);
    that.original = that.getData();
  };
  i.src = src;
  this.context = context;
  this.image = i;
}

var transformador = new CanvasImage($('pic'), $('#my-image').attr('src'))

CanvasImage.prototype.getData = function() {
  return this.context.getImageData(0, 0, this.image.width, this.image.heiht);
};

CanvasImage.prototype.setData = function(data) {
  return this.context.putImageData(data, 0, 0);
};

CanvasImage.prototype.reset = function() {
  this.setData(this.original);
};

