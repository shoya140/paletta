window.onload = function(){
  var input = document.getElementById("input");
  input.onkeyup = input.onChange = function(){
    var s = this.value;
    var col = getTiniyHSV(s);
    document.getElementById("col").style.background = col;
    document.getElementById("export").innerHTML = col;
  };

  input.value = "06f";
  input.onkeyup.call(input);
};

//$(function(){
//  var input = $("#input");
//  input.onkeyup = input.onChange = $(function(){
//    var s = this.value;
//    var col = getTiniyHSV(s);
//    $("#col").css.background-color= col;
//    $("export").text = col;

//    input.value = "06f";
//    input.onkeyup.call(input);
//  });
//});

var getTiniyHSV = function(s){
  if(s.length !== 3){
    return "#000";
  }
  var n = parseInt(s, 16);
  var h = (n >> 8) / 16 * 360;
  var s = ((n >> 4) & 0xf) / 15;
  var v = (n & 0xf) / 15;
  var rgb = hsv2rgb(h, s, v);
  return rgb2css(rgb[0], rgb[1], rgb[2]);
};

var hsv2rgb = function(h, s, v) {
  while (h < 0)
    h += 360;
  h %= 360;
  if (s == 0) {
    v *= 255;
    return [ v, v, v ];
  }
  var hi = h / 60 >> 0;
  var f = h / 60 - hi;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var rgb = [ 1, 1, 1 ];
  if (hi == 0)
    rgb = [ v, t, p ];
  else if (hi == 1)
    rgb = [ q, v, p ];
  else if (hi == 2)
    rgb = [ p, v, t ];
  else if (hi == 3)
    rgb = [ p, q, v ];
  else if (hi == 4)
    rgb = [ t, p, v ];
  else if (hi == 5)
    rgb = [ v, p, q ];
  rgb[0] = rgb[0] * 255 >> 0;
  rgb[1] = rgb[1] * 255 >> 0;
  rgb[2] = rgb[2] * 255 >> 0;
  return rgb;
};

var rgb2css = function(r, g, b) {
  if (typeof r == 'object') {
    g = r[1];
    b = r[2];
    r = r[0];
  }
  return "#" + dec2hex(r, 2) + dec2hex(g, 2) + dec2hex(b, 2);
};

var dec2hex = function(n, beam) {
    var hex = "";
    for (var i = 0; i < beam; i++) {
        var m = n & 0xf;
        hex = '0123456789abcdef'.charAt(m) + hex;
        n -= m;
        n >>= 4;
    }
    return hex;
};


$(function(){
  $("#container").mason({
    itemSelector: ".box",
    ratio: 1.1,
    sizes: [
    [1,1],
    [2,1],
    [1,2],
    ],
    columns: [
    [0, 400, 3],
    [400, 600, 4],
    [600, 1000, 5],
    [1000, 2000, 6],
//    [0,480,1],
//    [480,780,2],
//    [780,1080,3],
//    [1080,1320,4],
//    [1320,1680,5],
    ],
    filler: {
      itemSelector: '.fillerBox',
      filler_class: 'custom_filler'
    },
    layout: 'fluid',
    gutter: 4
  });
});
