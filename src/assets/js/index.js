require('./main.js')

// init

$('.palette-inner').mason({
  itemSelector: '.box',
  ratio: 1.1,
  sizes: [[1, 1], [2, 1], [1, 2]],
  columns: [[0, 400, 3], [400, 600, 4], [600, 1000, 5]],
  gutter: 4
})

resetBoxes()

// Add events

document.querySelector('.reset-button').addEventListener('click', function (e) {
  resetBoxes()
})

document.querySelector('.dark-mode-toggle-button').addEventListener('click', function (e) {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
})

document.querySelector('.code-input').addEventListener('keyup', function (e) {
  if (e.keyCode === 13 && this.value.length === 6) {
    document.querySelector('.code-container').style.backgroundColor = '#' + this.value
    updateBoxes(rgb2hsv(this.value)[0], -1)
  }
})

document.querySelectorAll('.box').forEach(function (element, index) {
  element.addEventListener('mouseenter', function (e) {
    this.classList.add('highlighted')
  })
  element.addEventListener('mouseleave', function (e) {
    this.classList.remove('highlighted')
  })
  element.addEventListener('click', function (e) {
    document.querySelector('.reset-button').style.display = 'inline'
    document.querySelector('.reset-button').style.backgroundColor = element.querySelector('.rgb').innerHTML
    updateBoxes(element.getAttribute('data-hue'), index)
  })
})

document.querySelectorAll('.rgb').forEach(function (element) {
  element.setAttribute('data-original-title', 'Click to Copy')

  element.addEventListener('mouseenter', function (e) {
    $(this).tooltip('show')
  })
  element.addEventListener('mouseleave', function (e) {
    $(this).tooltip('hide')
  })
  element.addEventListener('click', function (e) {
    e.stopPropagation()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.innerHTML)
    }
    if (window.clipboardData) {
      window.clipboardData.setData('Text', this.innerHTML)
    }
    document.querySelectorAll('.rgb').forEach(function (element) {
      element.setAttribute('data-original-title', 'Click to Copy')
    })
    $(this).tooltip('hide')
    this.setAttribute('data-original-title', '✓ Copied')
    $(this).tooltip('show')
  })
})

// functions

function resetBoxes () {
  document.querySelector('.reset-button').style.display = 'none'
  const colorCount = document.querySelectorAll('.box').length
  document.querySelectorAll('.box').forEach(function (element, index) {
    const hsv = getBaseColor(index, colorCount)
    const rgb = getRGBCSS(hsv)
    element.setAttribute('data-original-title', 'Click to Copy')
    element.setAttribute('data-hue', hsv[0])
    element.querySelector('.rgb').innerHTML = rgb
    element.querySelector('.rgb').style.color = (hsv[2] > 0.70 && hsv[1] < 0.30) ? '#131516' : '#ffffff'
    element.style.backgroundColor = rgb
  })
}

function updateBoxes (hue, colorID) {
  document.querySelectorAll('.box').forEach(function (element, index) {
    if (colorID !== index) {
      const hsv = getRandomColor(hue)
      const rgb = getRGBCSS(hsv)
      element.style.backgroundColor = getRGBCSS(hsv)
      element.querySelector('.rgb').setAttribute('data-original-title', 'Click to Copy')
      element.querySelector('.rgb').innerHTML = rgb
      element.querySelector('.rgb').style.color = (hsv[2] > 0.70 && hsv[1] < 0.30) ? '#131516' : '#ffffff'
      element.setAttribute('data-hue', hsv[0])
    }
  })
}

function getBaseColor (i, count) {
  const h = i / count * 360
  const s = 0.8
  const v = 0.8
  return [h, s, v]
}

function getRandomColor (hue) {
  const s = Math.random()
  const v = Math.random()
  return [hue, s, v]
}

function getRGBCSS (hsv) {
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

function rgb2css (r, g, b) {
  if (typeof r === 'object') {
    g = r[1]
    b = r[2]
    r = r[0]
  }
  return '#' + dec2hex(r) + dec2hex(g) + dec2hex(b)
}

function dec2hex (n) {
  n = parseInt(n)
  const c = 'abcdef'
  var b = n / 16
  var r = n % 16
  b = b - (r / 16)
  b = ((b >= 0) && (b <= 9)) ? b : c.charAt(b - 10)
  return ((r >= 0) && (r <= 9)) ? b + '' + r : b + '' + c.charAt(r - 10)
}

function rgb2hsv (s) {
  var hsv, i, max, min, rgb, _i, _ref
  if (s.length !== 6) {
    return '#00000'
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
