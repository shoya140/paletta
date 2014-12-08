(function() {
  var codeOn, dec2hex, getBaseColor, getRGBCSS, getRandomColor, hsv2rgb, palettaOff, palettaOn, rgb2css, rgb2hsv;

  $(function() {
    var $box, $input;
    FastClick.attach(document.body);
    $(".palette-inner").mason({
      itemSelector: ".box",
      ratio: 1.1,
      sizes: [[1, 1], [2, 1], [1, 2]],
      columns: [[0, 400, 3], [400, 600, 4], [600, 1000, 5], [1000, 2000, 6]],
      layout: "fluid",
      gutter: 4
    });
    $input = $(".code-input");
    $input.keypress(function(e) {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        return codeOn($input.val());
      }
    });
    $("a[data-toggle='tab']").on("shown", function(e) {
      var tabName;
      tabName = e.target.href.split("#").pop();
      if (tabName === "palette") {
        return palettaOff();
      } else if (tabName === "code") {
        return codeOn($input.val());
      }
    });
    palettaOff();
    $box = $(".box");
    $box.on({
      mouseenter: function() {
        return $(this).css("box-shadow", "0 0 20px rgba(0,0,0,0.4) inset");
      },
      mouseleave: function() {
        return $box.css("box-shadow", "0 0 10px rgba(0,0,0,0.4) inset");
      }
    });
    $box.on("click", function(e) {
      var rgb;
      rgb = $(this).find(".rgb").text();
      $.post("/log/", {
        color: rgb
      });
      return palettaOn(this.id);
    });
    return $("button#resetButton").on("click", function(e) {
      return palettaOff();
    });
  });

  palettaOn = function(colorID) {
    var $color_id, $reset_btn;
    $reset_btn = $("button#resetButton");
    $color_id = $("#" + colorID);
    $reset_btn.fadeIn(300);
    $reset_btn.css("background-color", $color_id.css("background-color"));
    return $(".box").each(function(i) {
      var $color_dom, hsv, hue, rgb;
      if (colorID !== "color" + i) {
        hue = $color_id.find(".hue").text();
        hsv = getRandomColor(hue);
        rgb = getRGBCSS(hsv);
        $color_dom = $("#color" + i);
        $color_dom.css("background-color", getRGBCSS(hsv));
        $color_dom.find(".rgb").attr("data-clipboard-text", rgb.split("#").pop());
        $color_dom.find(".rgb").text(rgb);
        $color_dom.find(".hue").text(hsv[0]);
        if (hsv[2] > 0.70 && hsv[1] < 0.30) {
          return $color_dom.find(".rgb").css("color", "#131516");
        } else {
          return $color_dom.find(".rgb").css("color", "#ffffff");
        }
      }
    });
  };

  codeOn = function(code) {
    var hue;
    if (code.length !== 6) {
      return;
    }
    $(".code-container").css("background-color", "#" + code);
    hue = rgb2hsv(code)[0];
    return $(".box").each(function(i) {
      var $color_dom, hsv, rgb;
      hsv = getRandomColor(hue);
      rgb = getRGBCSS(hsv);
      $color_dom = $("#color" + i);
      $color_dom.css("background-color", getRGBCSS(hsv));
      $color_dom.find(".rgb").attr("data-clipboard-text", rgb.split("#").pop());
      $color_dom.find(".rgb").text(rgb);
      $color_dom.find(".hue").text(hsv[0]);
      if (hsv[2] > 0.70 && hsv[1] < 0.30) {
        return $color_dom.find(".rgb").css("color", "#131516");
      } else {
        return $color_dom.find(".rgb").css("color", "#ffffff");
      }
    });
  };

  palettaOff = function() {
    var $color_dom, clip, colorCount, colorIDs, hsv, i, rgb, _i, _j;
    $("button#resetButton").hide();
    colorIDs = [];
    colorCount = $(".box").length;
    for (i = _i = 0; 0 <= colorCount ? _i < colorCount : _i > colorCount; i = 0 <= colorCount ? ++_i : --_i) {
      colorIDs.push(i);
    }
    colorIDs.sort(function() {
      return Math.random() - Math.random();
    });
    $(".box").each(function(i) {
      $(this).empty();
      $(this).attr("id", "color" + colorIDs[i]);
      $(this).append("<span class=\"rgb\" data-clipboard-text=\"000000\" data-original-title=\"Click to Copy\">#000000</span>");
      return $(this).append("<p class=\"hue\">0</p>");
    });
    for (i = _j = 0; 0 <= colorCount ? _j < colorCount : _j > colorCount; i = 0 <= colorCount ? ++_j : --_j) {
      hsv = getBaseColor(i, colorCount);
      rgb = getRGBCSS(hsv);
      $color_dom = $("#color" + i);
      $color_dom.css("background-color", getRGBCSS(hsv));
      $color_dom.find(".rgb").attr("data-clipboard-text", rgb.split("#").pop());
      $color_dom.find(".rgb").text(rgb);
      $color_dom.find(".hue").text(hsv[0]);
    }
    clip = new ZeroClipboard($(".box").find(".rgb"), {
      moviePath: "/static/custom/flash/ZeroClipboard.swf"
    });
    clip.on("complete", function(client, args) {
      var $notify_message;
      $notify_message = $(".notifyMessage");
      $notify_message.text("Copied " + args.text + " to your clip board");
      return $notify_message.stop().fadeIn(400).delay(1000).fadeOut(700);
    });
    clip.on("mouseover", function(client) {
      return $(this).tooltip("show");
    });
    return clip.on("mouseout", function(client) {
      return $(this).tooltip("hide");
    });
  };

  getBaseColor = function(i, count) {
    var h, s, v;
    h = i / count * 360;
    s = 0.8;
    v = 0.8;
    return [h, s, v];
  };

  getRandomColor = function(hue) {
    var s, v;
    s = Math.random();
    v = Math.random();
    return [hue, s, v];
  };

  getRGBCSS = function(hsv) {
    var rgb;
    rgb = hsv2rgb(hsv[0], hsv[1], hsv[2]);
    return rgb2css(rgb[0], rgb[1], rgb[2]);
  };

  hsv2rgb = function(h, s, v) {
    var f, hi, p, q, rgb, t;
    while (h < 0) {
      h += 360;
    }
    h %= 360;
    if (+s === 0) {
      v *= 255;
      return [v, v, v];
    }
    hi = +(h / 60 >> 0);
    f = h / 60 - hi;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    rgb = [1, 1, 1];
    if (hi === 0) {
      rgb = [v, t, p];
    } else if (hi === 1) {
      rgb = [q, v, p];
    } else if (hi === 2) {
      rgb = [p, v, t];
    } else if (hi === 3) {
      rgb = [p, q, v];
    } else if (hi === 4) {
      rgb = [t, p, v];
    } else if (hi === 5) {
      rgb = [v, p, q];
    }
    rgb[0] = rgb[0] * 255 >> 0;
    rgb[1] = rgb[1] * 255 >> 0;
    rgb[2] = rgb[2] * 255 >> 0;
    return rgb;
  };

  rgb2css = function(r, g, b) {
    if (typeof r === "object") {
      g = r[1];
      b = r[2];
      r = r[0];
    }
    return "#" + dec2hex(r, 2) + dec2hex(g, 2) + dec2hex(b, 2);
  };

  dec2hex = function(n, beam) {
    var hex, i, m, _i;
    hex = "";
    for (i = _i = 0; 0 <= beam ? _i < beam : _i > beam; i = 0 <= beam ? ++_i : --_i) {
      m = n & 0xf;
      hex = "0123456789abcdef".charAt(m) + hex;
      n -= m;
      n >>= 4;
    }
    return hex.slice(-2);
  };

  rgb2hsv = function(s) {
    var hsv, i, max, min, rgb, _i, _ref;
    if (s.length !== 6) {
      return "#00000";
    }
    rgb = [0, 0, 0];
    rgb[0] = parseInt(s.substring(0, 2), 16);
    rgb[1] = parseInt(s.substring(2, 4), 16);
    rgb[2] = parseInt(s.substring(4, 6), 16);
    max = 0;
    min = 256;
    for (i = _i = 0, _ref = rgb.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (max < rgb[i]) {
        max = rgb[i];
      }
      if (min > rgb[i]) {
        min = rgb[i];
      }
    }
    console.log(max);
    hsv = [0, 0, 0];
    if (max === min) {
      hsv[0] = 0;
    } else if (max === rgb[0]) {
      hsv[0] = (60 * (rgb[1] - rgb[2]) / (max - min) + 360) % 360;
    } else if (max === rgb[1]) {
      hsv[0] = (60 * (rgb[2] - rgb[0]) / (max - min)) + 120;
    } else {
      if (max === rgb[2]) {
        hsv[0] = (60 * (rgb[0] - rgb[1]) / (max - min)) + 240;
      }
    }
    if (max === 0) {
      hsv[1] = 0;
    } else {
      hsv[1] = 255 * ((max - min) / max);
    }
    hsv[2] = max;
    return hsv;
  };

}).call(this);
