$(function(){

  // fast-click
  FastClick.attach(document.body);

  //grid-layout
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

  // init
  palettaOff();

  // events
  var $box = $(".box");
  $box.on({
    mouseenter: function(){
      $(this).css("box-shadow", "0 0 20px rgba(0,0,0,.4) inset");
    },
    mouseleave: function(){
      $box.css("box-shadow", "0 0 10px rgba(0,0,0,.4) inset");
    }
  });

  $box.on('click', function(e) {
      palettaOn(this.id);
  });

  $("button#resetButton").on('click', function(e){
    palettaOff();
  });
});

function palettaOn(colorID){
  var $reset_btn = $("button#resetButton");
  var $color_id  = $("#"+colorID);
  $reset_btn.fadeIn(300);
  $reset_btn.css("background-color", $color_id.css("background-color"));
  $(".box").each(function(i){
    if (colorID != "color"+i){
      var hue = $color_id.find(".hue").text();
      var hsv = getRandomeColor(hue);
      var rgb = getRGBCSS(hsv);
      var $color_dom = $("#color"+i);
      $color_dom.css("background-color", getRGBCSS(hsv));
      $color_dom.find(".rgb").attr('data-clipboard-text', rgb);
      $color_dom.find(".rgb").text(rgb);
      $color_dom.find(".hue").text(hsv[0]);
      if(hsv[2] > 0.70 && hsv[1] < 0.30){
        $color_dom.find(".rgb").css("color", "#131516");
      }else{
        $color_dom.find(".rgb").css("color", "#ffffff");
      }
    }
  });
}

function palettaOff(){
  $("button#resetButton").hide();
  var colorIDs = [];
  var colorCount = $(".box").length;
  for (var i = 0; i < colorCount; i ++){
    colorIDs.push(i);
  }
  colorIDs.sort(function(){
    return Math.random() - Math.random();
  });
  $(".box").each(function(i){
    $(this).empty();
    $(this).attr('id', 'color' + colorIDs[i]);
    $(this).append('<span class="rgb" data-clipboard-text="#000000" data-original-title="Click to Copy">#000000</span>');
    $(this).append('<p class="hue">0</p>');
  });
  for (var i = 0; i < colorCount; i ++){
    var hsv = getBaseColor(i, colorCount);
    var rgb = getRGBCSS(hsv);
    var $color_dom = $("#color"+i);
    $color_dom.css("background-color", getRGBCSS(hsv));
    $color_dom.find(".rgb").attr('data-clipboard-text', rgb);
    $color_dom.find(".rgb").text(rgb);
    $color_dom.find(".hue").text(hsv[0]);
  }

  // ZeroClipboard
  var clip = new ZeroClipboard($(".box").find(".rgb"), {
    moviePath: "/static/flash/ZeroClipboard.swf"
  });

  clip.on('complete', function(client, args) {
    var $notify_message = $(".notifyMessage");
    $notify_message.text("Copied " + args.text + " to your clip board");
    $notify_message.stop().fadeIn(400).delay(1000).fadeOut(700);
  });

  clip.on('mouseover', function(client) {
    $(this).tooltip('show');
  });

  clip.on('mouseout', function(client) {
    $(this).tooltip('hide');
  });

};

function getBaseColor(i, count){
  var h = i / count * 360;
  var s = 0.8;
  var v = 0.8;
  return([h, s, v]);
};

function getRandomeColor(hue){
  var s = Math.random();
  var v = Math.random();
  return([hue, s, v]);
};

function getRGBCSS(hsv){
  var rgb = hsv2rgb(hsv[0], hsv[1], hsv[2]);
  return rgb2css(rgb[0], rgb[1], rgb[2]);
};

function hsv2rgb(h, s, v) {
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

function rgb2css(r, g, b) {
  if (typeof r == 'object') {
    g = r[1];
    b = r[2];
    r = r[0];
  }
  return "#" + dec2hex(r, 2) + dec2hex(g, 2) + dec2hex(b, 2);
};

function dec2hex(n, beam) {
  var hex = "";
  for (var i = 0; i < beam; i++) {
    var m = n & 0xf;
    hex = '0123456789abcdef'.charAt(m) + hex;
    n -= m;
    n >>= 4;
  }
  return hex;
};
