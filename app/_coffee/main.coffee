$ ->

  # fast-click
  FastClick.attach document.body

  # grid-layout
  $(".palette-inner").mason
    itemSelector: ".box"
    ratio: 1.1
    sizes: [
      [1, 1]
      [2, 1]
      [1, 2]
    ]
    columns: [
      [0, 400, 3]
      [400, 600, 4]
      [600, 1000, 5]
      [1000, 2000, 6]
    ]
    layout: "fluid"
    gutter: 4

  # input
  $input = $(".code-input")
  $input.keypress (e) ->
    if (e.which and e.which is 13) or (e.keyCode and e.keyCode is 13)
      codeOn $input.val()

  # tab
  $("a[data-toggle='tab']").on "shown", (e) ->
    tabName = e.target.href.split("#").pop()
    if tabName is "palette"
      palettaOff()
    else if tabName is "code"
      codeOn $input.val()

  # init
  palettaOff()

  # events
  $box = $(".box")
  $box.on
    mouseenter: ->
      $(this).css "box-shadow", "0 0 20px rgba(0,0,0,0.4) inset"
    mouseleave: ->
      $box.css "box-shadow", "0 0 10px rgba(0,0,0,0.4) inset"
  $box.on "click", (e) ->
    rgb = $(this).find(".rgb").text()
    $.post("/log/", {color: rgb})
    palettaOn @id
  $("button#resetButton").on "click", (e) ->
    palettaOff()

palettaOn = (colorID) ->
  $reset_btn = $("button#resetButton")
  $color_id = $("#" + colorID)
  $reset_btn.fadeIn 300
  $reset_btn.css "background-color", $color_id.css("background-color")
  $(".box").each (i) ->
    unless colorID is "color" + i
      hue = $color_id.find(".hue").text()
      hsv = getRandomColor(hue)
      rgb = getRGBCSS(hsv)
      $color_dom = $("#color" + i)
      $color_dom.css "background-color", getRGBCSS(hsv)
      $color_dom.find(".rgb").attr "data-clipboard-text", rgb.split("#").pop()
      $color_dom.find(".rgb").text rgb
      $color_dom.find(".hue").text hsv[0]
      if hsv[2] > 0.70 and hsv[1] < 0.30
        $color_dom.find(".rgb").css "color", "#131516"
      else
        $color_dom.find(".rgb").css "color", "#ffffff"

codeOn = (code) ->
  unless code.length is 6
    return
  $(".code-container").css "background-color", "#" + code
  hue = rgb2hsv(code)[0]
  $(".box").each (i) ->
    hsv = getRandomColor(hue)
    rgb = getRGBCSS(hsv)
    $color_dom = $("#color" + i)
    $color_dom.css "background-color", getRGBCSS(hsv)
    $color_dom.find(".rgb").attr "data-clipboard-text", rgb.split("#").pop()
    $color_dom.find(".rgb").text rgb
    $color_dom.find(".hue").text hsv[0]
    if hsv[2] > 0.70 and hsv[1] < 0.30
      $color_dom.find(".rgb").css "color", "#131516"
    else
      $color_dom.find(".rgb").css "color", "#ffffff"

palettaOff = ->
  $("button#resetButton").hide()
  colorIDs = []
  colorCount = $(".box").length
  for i in [0...colorCount]
    colorIDs.push i
  colorIDs.sort ->
    return Math.random() - Math.random()

  $(".box").each (i) ->
    $(this).empty()
    $(this).attr "id", "color" + colorIDs[i]
    $(this).append "<span class=\"rgb\" data-clipboard-text=\"000000\" data-original-title=\"Click to Copy\">#000000</span>"
    $(this).append "<p class=\"hue\">0</p>"

  for i in [0...colorCount]
    hsv = getBaseColor(i, colorCount)
    rgb = getRGBCSS(hsv)
    $color_dom = $("#color" + i)
    $color_dom.css "background-color", getRGBCSS(hsv)
    $color_dom.find(".rgb").attr "data-clipboard-text", rgb.split("#").pop()
    $color_dom.find(".rgb").text rgb
    $color_dom.find(".hue").text hsv[0]

  # ZeroClipboard
  clip = new ZeroClipboard($(".box").find(".rgb"),
    moviePath: "/static/custom/flash/ZeroClipboard.swf"
  )
  clip.on "complete", (client, args) ->
    $notify_message = $(".notifyMessage")
    $notify_message.text "Copied " + args.text + " to your clip board"
    $notify_message.stop().fadeIn(400).delay(1000).fadeOut 700
  clip.on "mouseover", (client) ->
    $(this).tooltip "show"
  clip.on "mouseout", (client) ->
    $(this).tooltip "hide"

getBaseColor = (i, count) ->
  h = i / count * 360
  s = 0.8
  v = 0.8
  return [h, s, v]

getRandomColor = (hue) ->
  s = Math.random()
  v = Math.random()
  return [hue, s, v]

getRGBCSS = (hsv) ->
  rgb = hsv2rgb(hsv[0], hsv[1], hsv[2])
  return rgb2css rgb[0], rgb[1], rgb[2]

hsv2rgb = (h, s, v) ->
  while h < 0
    h += 360
  h %= 360
  if +s is 0
    v *= 255
    return [v, v, v]
  hi = +(h / 60 >> 0)
  f = h / 60 - hi
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)
  rgb = [1, 1, 1]
  if hi is 0
    rgb = [v, t, p]
  else if hi is 1
    rgb = [q, v, p]
  else if hi is 2
    rgb = [p, v, t]
  else if hi is 3
    rgb = [p, q, v]
  else if hi is 4
    rgb = [t, p, v]
  else if hi is 5
    rgb = [v, p, q]
  rgb[0] = rgb[0] * 255 >> 0
  rgb[1] = rgb[1] * 255 >> 0
  rgb[2] = rgb[2] * 255 >> 0
  return rgb

rgb2css = (r, g, b) ->
  if typeof r is "object"
    g = r[1]
    b = r[2]
    r = r[0]
  return "#" + dec2hex(r, 2) + dec2hex(g, 2) + dec2hex(b, 2)

dec2hex = (n, beam) ->
  hex = ""
  for i in [0...beam]
    m = n & 0xf
    hex = "0123456789abcdef".charAt(m) + hex
    n -= m
    n >>= 4
  return hex.slice(-2)

rgb2hsv = (s) ->
  if s.length isnt 6
    return "#00000"
  rgb = [0, 0, 0]
  rgb[0] = parseInt(s.substring(0, 2), 16)
  rgb[1] = parseInt(s.substring(2, 4), 16)
  rgb[2] = parseInt(s.substring(4, 6), 16)
  max = 0
  min = 256

  for i in [0...rgb.length]
    max = rgb[i]  if max < rgb[i]
    min = rgb[i]  if min > rgb[i]
  console.log max

  hsv = [0, 0, 0]
  if max is min
    hsv[0] = 0
  else if max is rgb[0]
    hsv[0] = (60 * (rgb[1] - rgb[2]) / (max - min) + 360) % 360
  else if max is rgb[1]
    hsv[0] = (60 * (rgb[2] - rgb[0]) / (max - min)) + 120
  else hsv[0] = (60 * (rgb[0] - rgb[1]) / (max - min)) + 240  if max is rgb[2]
  if max is 0
    hsv[1] = 0
  else
    hsv[1] = (255 * ((max - min) / max))
  hsv[2] = max
  return hsv
