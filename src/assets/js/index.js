require('./main.js')

$(function() {
  $(".palette-inner").mason({
    itemSelector: ".box",
    ratio: 1.1,
    sizes: [[1, 1], [2, 1], [1, 2]],
    columns: [[0, 400, 3], [400, 600, 4], [600, 1000, 5], [1000, 2000, 6]],
    gutter: 4
  })
  const $input = $(".code-input")
  $input.keypress(function(e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
      return codeOn($input.val())
    }
  })
  $("a[data-toggle='tab']").on("shown", function(e) {
    var tabName
    tabName = e.target.href.split("#").pop()
    if (tabName === "palette") {
      return palettaOff()
    } else if (tabName === "code") {
      return codeOn($input.val())
    }
  })
  palettaOff()
  const $box = $(".box")
  $box.on({
    mouseenter: function() {
      return $(this).css("box-shadow", "0 0 10px rgba(0,0,0,0.2) inset")
    },
    mouseleave: function() {
      return $box.css("box-shadow", "none")
    }
  })
  $box.on("click", function(e) {
    return palettaOn(this.id)
  })
  return $("#reset-button").on("click", function(e) {
    return palettaOff()
  })
})

$(".dark-mode-toggle-button").on("click", function(e) {
  const theme = $(document.documentElement).attr("data-theme-mode") === "dark" ? "light" : "dark"
  $(document.documentElement).attr("data-theme-mode", theme)
})

function palettaOn(colorID) {
  const $resetButton = $("#reset-button")
  const $colorID = $("#" + colorID)
  $resetButton.fadeIn(300)
  $resetButton.css("background-color", $colorID.css("background-color"))
  return $(".box").each(function(i) {
    if (colorID !== "color" + i) {
      const hue = $colorID.find(".hue").text()
      const hsv = getRandomColor(hue)
      const rgb = getRGBCSS(hsv)
      const $colorDom = $("#color" + i)
      $colorDom.css("background-color", getRGBCSS(hsv))
      $colorDom.find(".rgb").attr("data-original-title", "Click to Copy")
      $colorDom.find(".rgb").text(rgb)
      $colorDom.find(".hue").text(hsv[0])
      if (hsv[2] > 0.70 && hsv[1] < 0.30) {
        return $colorDom.find(".rgb").css("color", "#131516")
      } else {
        return $colorDom.find(".rgb").css("color", "#ffffff")
      }
    }
  })
}

function codeOn(code) {
  var hue
  if (code.length !== 6) {
    return
  }
  $(".code-container").css("background-color", "#" + code)
  hue = rgb2hsv(code)[0]
  return $(".box").each(function(i) {
    var $colorDom, hsv, rgb
    hsv = getRandomColor(hue)
    rgb = getRGBCSS(hsv)
    $colorDom = $("#color" + i)
    $colorDom.css("background-color", getRGBCSS(hsv))
    $colorDom.find(".rgb").attr("data-original-title", "Click to Copy")
    $colorDom.find(".rgb").text(rgb)
    $colorDom.find(".hue").text(hsv[0])
    if (hsv[2] > 0.70 && hsv[1] < 0.30) {
      return $colorDom.find(".rgb").css("color", "#131516")
    } else {
      return $colorDom.find(".rgb").css("color", "#ffffff")
    }
  })
}

function palettaOff() {
  var colorCount, colorIDs, hsv, i, rgb, _i, _j
  $("#reset-button").hide()
  colorIDs = []
  colorCount = $(".box").length
  for (i = _i = 0; 0 <= colorCount ? _i < colorCount : _i > colorCount; i = 0 <= colorCount ? ++_i : --_i) {
    colorIDs.push(i)
  }
  colorIDs.sort(function() {
    return Math.random() - Math.random()
  })
  $(".box").each(function(i) {
    $(this).empty()
    $(this).attr("id", "color" + colorIDs[i])
    $(this).append("<span class=\"rgb\" data-original-title=\"Click to Copy\">#000000</span>")
    return $(this).append("<p class=\"hue\">0</p>")
  })
  for (i = _j = 0; 0 <= colorCount ? _j < colorCount : _j > colorCount; i = 0 <= colorCount ? ++_j : --_j) {
    hsv = getBaseColor(i, colorCount)
    rgb = getRGBCSS(hsv)
    const $colorDom = $("#color" + i)
    $colorDom.css("background-color", getRGBCSS(hsv))
    $colorDom.find(".rgb").text(rgb)
    $colorDom.find(".hue").text(hsv[0])
  }

  $(".rgb").each(function(i) {
    $(this).on("mouseover", function(client) {
      $(this).tooltip("show")
    })

    $(this).on().on("mouseout", function(client) {
      $(this).tooltip("hide")
    })

    $(this).on("click", function(e) {
      e.stopPropagation()
      if(navigator.clipboard){
        navigator.clipboard.writeText($(this).text())
      }
      if(window.clipboardData){
        window.clipboardData.setData("Text" , $(this).text())
      }
      $(".rgb").each(function(i) {
        $(this).attr("data-original-title", "Click to Copy")
      })
      $(this).tooltip('hide')
      $(this).attr("data-original-title", "✓ Copied")
      $(this).tooltip('show')
    })
  })
}

function getBaseColor(i, count) {
  const h = i / count * 360
  const s = 0.8
  const v = 0.8
  return [h, s, v]
}

function getRandomColor(hue) {
  const s = Math.random()
  const v = Math.random()
  return [hue, s, v]
}

function getRGBCSS(hsv) {
  const rgb = hsv2rgb(hsv[0], hsv[1], hsv[2])
  return rgb2css(rgb[0], rgb[1], rgb[2])
}

function hsv2rgb (h, s, v) {
  var f, hi, p, q, rgb, t
  while (h < 0) {
    h += 360
  }
  h %= 360
  if (+s === 0) {
    v *= 255
    return [v, v, v]
  }
  hi = +(h / 60 >> 0)
  f = h / 60 - hi
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)
  rgb = [1, 1, 1]
  if (hi === 0) {
    rgb = [v, t, p]
  } else if (hi === 1) {
    rgb = [q, v, p]
  } else if (hi === 2) {
    rgb = [p, v, t]
  } else if (hi === 3) {
    rgb = [p, q, v]
  } else if (hi === 4) {
    rgb = [t, p, v]
  } else if (hi === 5) {
    rgb = [v, p, q]
  }
  rgb[0] = rgb[0] * 255 >> 0
  rgb[1] = rgb[1] * 255 >> 0
  rgb[2] = rgb[2] * 255 >> 0
  return rgb
}

function rgb2css(r, g, b) {
  if (typeof r === "object") {
    g = r[1]
    b = r[2]
    r = r[0]
  }
  return "#" + dec2hex(r) + dec2hex(g) + dec2hex(b)
}

function dec2hex(n){
  n = parseInt(n)
  const c = 'abcdef'
  var b = n / 16
  var r = n % 16
  b = b-(r/16)
  b = ((b>=0) && (b<=9)) ? b : c.charAt(b-10)
  return ((r>=0) && (r<=9)) ? b+''+r : b+''+c.charAt(r-10)
}

function rgb2hsv(s) {
  var hsv, i, max, min, rgb, _i, _ref
  if (s.length !== 6) {
    return "#00000"
  }
  rgb = [0, 0, 0]
  rgb[0] = parseInt(s.substring(0, 2), 16)
  rgb[1] = parseInt(s.substring(2, 4), 16)
  rgb[2] = parseInt(s.substring(4, 6), 16)
  max = 0
  min = 256
  for (i = _i = 0, _ref = rgb.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (max < rgb[i]) {
      max = rgb[i]
    }
    if (min > rgb[i]) {
      min = rgb[i]
    }
  }
  hsv = [0, 0, 0]
  if (max === min) {
    hsv[0] = 0
  } else if (max === rgb[0]) {
    hsv[0] = (60 * (rgb[1] - rgb[2]) / (max - min) + 360) % 360
  } else if (max === rgb[1]) {
    hsv[0] = (60 * (rgb[2] - rgb[0]) / (max - min)) + 120
  } else {
    if (max === rgb[2]) {
      hsv[0] = (60 * (rgb[0] - rgb[1]) / (max - min)) + 240
    }
  }
  if (max === 0) {
    hsv[1] = 0
  } else {
    hsv[1] = 255 * ((max - min) / max)
  }
  hsv[2] = max
  return hsv
}