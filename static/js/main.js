//init
$(function(){

  $(".container").mason({
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
  ],
  layout: 'fluid',
  gutter: 4
  });

  var colorIDs = [];
  var colorCount = $(".box").length;
  for (var i = 0; i < colorCount; i ++){
    colorIDs.push(i);
  }
  colorIDs.sort(function(){
    return Math.random() - Math.random();
  });
  $(".box").each(function(i){
    $(this).attr('id', 'color' + colorIDs[i]);
  });
  for (var i = 0; i < colorCount; i ++){
    $("#color"+i).css("background-color", getBaseColor(i,colorCount));
  }

});

// color clicked
$(function() {

  $("div.box").mouseover(function(){
    $(".box").css("box-shadow", "0 0 10px rgba(0,0,0,.4) inset");
    $(this).css("box-shadow", "0 0 10px rgba(0,0,0,.1)");
  });
  $("div.box").click(function(e) {
      alert("hoge");
    });
});

function getBaseColor(i, count){
  var h = i / count * 360;
  var s = 0.8;
  var v = 0.8;
  var rgb = hsv2rgb(h, s, v);
  return rgb2css(rgb[0], rgb[1], rgb[2]);
};

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
