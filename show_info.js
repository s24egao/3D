let canvasElement = document.createElement('canvas')
canvasElement.setAttribute('id', 'show_info')
document.body.append(canvasElement)

let canvas = document.getElementById('show_info')
let c = canvas.getContext('2d')

let info = { transition: 0, x: 0, y: 0, display: false, text: '', width: 150, flipX: 1 }

canvas.setAttribute('style', `position: fixed; width: ${innerWidth}px; height: ${innerHeight}px; pointer-events: none; z-index: 2;`)
canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio
c.scale(devicePixelRatio, devicePixelRatio)
c.lineWidth = 2

addEventListener('resize', () => {
	canvas.setAttribute('style', `position: fixed; width: ${innerWidth}px; height: ${innerHeight}px; pointer-events: none; z-index: 2;`)
	canvas.width = innerWidth * devicePixelRatio
	canvas.height = innerHeight * devicePixelRatio
	c.scale(devicePixelRatio, devicePixelRatio)
	c.lineWidth = 2
})

function show(d, x, y, text) {
	info.display = d
	if(!d) return
	info.x = x
	info.y = y
	info.text = text
	info.width = 150 + Math.max(0, c.measureText(text).width - 90)
}

function draw() {
	requestAnimationFrame(draw)
	c.clearRect(0, 0, canvas.width, canvas.height)
	info.transition = info.transition + (((info.display)? 1 : 0) - info.transition) * 0.3
	if(info.transition < 0.01) return

	if(info.x > innerWidth - 250) info.flipX = info.flipX + (-1 - info.flipX) * 0.3
	else if(info.x < 250) info.flipX = info.flipX + (1 - info.flipX) * 0.3
	else if(Math.abs(info.flipX) < 0.99) info.flipX = info.flipX + (((info.x < innerWidth / 2)? 1 : -1) - info.flipX) * 0.3

	c.fillStyle = `rgb(255, 255, 255)`
	c.beginPath()
	c.arc(info.x, info.y, 6 * info.transition, 0, 6.28318)
	c.fill()

	c.strokeStyle = `rgb(255, 255, 255)`
	c.beginPath()
	c.moveTo(info.x, info.y)
	c.lineTo(info.x + 60 * info.transition * info.flipX, info.y + 60 * info.transition)
	c.stroke()

	c.beginPath()
	c.moveTo(info.x + 60 * info.transition * info.flipX, info.y + 60 * info.transition)
	c.lineTo(info.x + (info.width + 90) * info.transition * info.flipX, info.y + 60 * info.transition)
	c.stroke()

	c.fillStyle = `rgba(255, 255, 255, 0.8)`
	c.fillRect(info.x + ((info.flipX > 0)? 90 : -info.width - 90), info.y + 30 + 30 * (1 - info.transition), info.width, 30 * info.transition)

	c.fillStyle = `rgba(119, 136, 170, ${info.transition})`
	c.font = '24px Noto Sans TC'
	c.fillText(info.text, info.x + ((info.flipX > 0)? 90 : -info.width - 90), info.y + 60)
}
draw()