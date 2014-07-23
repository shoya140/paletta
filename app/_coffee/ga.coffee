colors = []
color_size = 12
mutate_prob = 0.5

$ ->

  # fast-click
  FastClick.attach document.body

  # grid-layout
  $(".palette-inner").mason
    itemSelector: ".box"
    ratio: 1.1
    sizes: [
      [1, 1]
    ]
    columns: [
      [0, 400, 3]
      [400, 800, 4]
      [800, 1000, 6]
    ]
    layout: "fluid"
    gutter: 4

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
    colors.unshift [
      $(this).find(".hue").text(),
      $(this).find(".chroma").text(),
      $(this).find(".brightness").text()
    ]
    if colors.length == 1
      seed @id
    else
      gen()

  $("button#resetButton").on "click", (e) ->
    palettaOff()

seed = (colorID)->
  $reset_btn = $("button#resetButton")
  $reset_btn.fadeIn 300
  $reset_btn.css "background-color", getRGBCSS(colors[0])
  $color_id = $("#" + colorID)
  $(".box").each (i) ->
    unless colorID is "color" + i
      hue = parseInt(colors[0][0]) + rand(40) - 20
      hsv = getRandomColor(hue)
      rgb = getRGBCSS(hsv)
      $color_dom = $("#color" + i)
      $color_dom.css "background-color", getRGBCSS(hsv)
      $color_dom.find(".rgb").attr "data-clipboard-text", rgb.split("#").pop()
      $color_dom.find(".rgb").text rgb
      $color_dom.find(".hue").text hsv[0]
      $color_dom.find(".chroma").text hsv[1]
      $color_dom.find(".brightness").text hsv[2]
      if hsv[2] > 0.70 and hsv[1] < 0.30
        $color_dom.find(".rgb").css "color", "#131516"
      else
        $color_dom.find(".rgb").css "color", "#ffffff"

mutate = (c) ->
  position = rand(3)
  if position == 0
    hue = parseInt(c[0]) + rand(40) - 20
    if hue > 360
      hue -= 360
    else if hue < 0
      hue += 360
    return [hue, c[1], c[2]]
  else if position == 1
    return [c[0], Math.random(), c[2]]
  else
    return [c[0], c[1], Math.random()]

crossover = (c0, c1) ->
  if Math.random < 0.5
    tmp = c0
    c0 = c1
    c1 = tmp
  position = rand(2)+1
  return c0.slice(0, position).concat(c1.slice(position, c1.length))

gen = ->
  while colors.length < color_size
    if Math.random() < mutate_prob
      colors.push mutate(colors[rand(2)])
    else
      colors.push crossover(colors[0], colors[1])

  $(".box").each (i) ->
    hsv = colors[i]
    rgb = getRGBCSS(hsv)
    $color_dom = $("#color" + i)
    $color_dom.css "background-color", getRGBCSS(hsv)
    $color_dom.find(".rgb").attr "data-clipboard-text", rgb.split("#").pop()
    $color_dom.find(".rgb").text rgb
    $color_dom.find(".hue").text hsv[0]
    $color_dom.find(".chroma").text hsv[1]
    $color_dom.find(".brightness").text hsv[2]
    if hsv[2] > 0.70 and hsv[1] < 0.30
      $color_dom.find(".rgb").css "color", "#131516"
    else
      $color_dom.find(".rgb").css "color", "#ffffff"
  colors = colors.slice(0, 1)

palettaOff = ->
  colors = []

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
    $(this).append "<p class=\"chroma\">0</p>"
    $(this).append "<p class=\"brightness\">0</p>"

  for i in [0...colorCount]
    hsv = getBaseColor(i, colorCount)
    rgb = getRGBCSS(hsv)
    $color_dom = $("#color" + i)
    $color_dom.css "background-color", getRGBCSS(hsv)
    $color_dom.find(".rgb").attr "data-clipboard-text", rgb.split("#").pop()
    $color_dom.find(".rgb").text rgb
    $color_dom.find(".hue").text hsv[0]
    $color_dom.find(".chroma").text hsv[1]
    $color_dom.find(".brightness").text hsv[2]

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

rand = (n) ->
  return Math.floor(Math.random()*n)

shuffle = (array) ->
  for x in array
    i = rand(array.length-1)
    j = rand(array.length-1)
    tmp = array[i]
    array[i] = array[j]
    array[j] = tmp
  return array
