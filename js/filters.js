$(function() {
  $('#negative').click(function() {
    transformador.convolve([[0,0,0],[0,-1,0],[0,0,0]], 1, 256);
  });

  $('#reset').click(function() {
    transformador.reset();
  });

  var negative = function(r, g, b) {
    return [255 - r, 255 - g, 255 - b, 255];
  };

  var reset = function() {
  };

  function CanvasImage(canvas, src) {
    var context = canvas.getContext('2d');
    var i = new Image();
    i.width = 290;
    i.height = 211;
    var that = this;
    i.onload = function() {
      canvas.width = i.width;
      canvas.height = i.height;
      context.drawImage(i, 0, 0, i.width, i.height);
      that.original = that.getData();
    };
    i.src = src;
    this.context = context;
    this.image = i;
  }

  var transformador = new CanvasImage(document.getElementById('pic'), $('#my-image').attr('src'));

  CanvasImage.prototype.getData = function() {
    return this.context.getImageData(0, 0, this.image.width, this.image.height);
  };

  CanvasImage.prototype.setData = function(data) {
    return this.context.putImageData(data, 0, 0);
  };

  CanvasImage.prototype.reset = function() {
    this.setData(this.original);
  };

  CanvasImage.prototype.convolve = function(matrix, divisor, offset) {
    var m = [].concat(matrix[0], matrix[1], matrix[2]); // flatten
    if (!divisor) {
      divisor = m.reduce(function(a, b) {return a + b;}) || 1; // sum
    }
    var olddata = this.original;
    var oldpx = olddata.data;
    var newdata = this.context.createImageData(olddata);
    var newpx = newdata.data
    var len = newpx.length;
    var res = 0;
    var w = this.image.width;
    for (var i = 0; i < len; i++) {
      if ((i + 1) % 4 === 0) {
        newpx[i] = oldpx[i];
        continue;
      }
      res = 0;
      var these = [
        oldpx[i - w * 4 - 4] || oldpx[i],
        oldpx[i - w * 4]     || oldpx[i],
        oldpx[i - w * 4 + 4] || oldpx[i],
        oldpx[i - 4]         || oldpx[i],
        oldpx[i],
        oldpx[i + 4]         || oldpx[i],
        oldpx[i + w * 4 - 4] || oldpx[i],
        oldpx[i + w * 4]     || oldpx[i],
        oldpx[i + w * 4 + 4] || oldpx[i]
      ];
      for (var j = 0; j < 9; j++) {
        res += these[j] * m[j];
      }
      res /= divisor;
      if (offset) {
        res += offset;
      }
      newpx[i] = res;
    }
    this.setData(newdata);
  };
});
