// Initialising the canvas
const container = document.querySelector('.section#intro')
const canvas = document.querySelector('canvas#matrix')
const ctx = canvas.getContext('2d')

// Setting up the letters
var letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ1234567890987654321234567890876543212345678907654321'
letters = letters.split('')

let fontSize = 10
var drops = []

function drawInit() {
  // Setting the width and height of the canvas
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
  // Setting up the columns
  var columns = canvas.width / fontSize
  // var drops = []
  // Setting up the drops
  for (var i = 0; i < columns; i++) {
    drops[i] = 1
  }
}

// Setting up the draw function
function draw() {
  // var drops = []
  ctx.fillStyle = 'rgba(0, 0, 0, .1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (var i = 0; i < drops.length; i++) {
    var text = letters[Math.floor(Math.random() * letters.length)]
    ctx.fillStyle = '#0f0'
    ctx.fillText(text, i * fontSize, drops[i] * fontSize)
    drops[i]++
    if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
      drops[i] = 0
    }
  }
}

drawInit()

// Loop the animation
// setInterval(drawInit, 1000)
setInterval(draw, 50)
