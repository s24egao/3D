class ShowInfo {
	constructor(id) {
		let canvasElement = document.createElement('canvas')
		canvasElement.setAttribute('id', id)
		canvasElement.setAttribute('style', `top: 0px; position: fixed; width: 100%; height: 100%; pointer-events: none; z-index: 2;`)
		document.body.append(canvasElement)

		this.canvas = document.getElementById(id)
		this.c = this.canvas.getContext('2d')

		this.canvas.width = innerWidth * devicePixelRatio
		this.canvas.height = innerHeight * devicePixelRatio
		this.c.scale(devicePixelRatio, devicePixelRatio)

		addEventListener('resize', () => {
			this.canvas.width = innerWidth * devicePixelRatio
			this.canvas.height = innerHeight * devicePixelRatio
			this.c.scale(devicePixelRatio, devicePixelRatio)
		})

		this.transition = 0
		this.x = 0
		this.y = 0
		this.display = false
		this.text = ''
		this.width = 150
		this.flipX = 1
	}

	set(d, x, y, text) {
		this.display = d
		if(!d) return
		this.x = x
		this.y = y
		this.text = text
		this.width = 150 + Math.max(0, this.c.measureText(text).width - 90)
	}

	draw() {
		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.transition = this.transition + (((this.display)? 1 : 0) - this.transition) * 0.3
		if(this.transition < 0.01) return
	
		if(this.x > innerWidth - 250) this.flipX = this.flipX + (-1 - this.flipX) * 0.3
		else if(this.x < 250) this.flipX = this.flipX + (1 - this.flipX) * 0.3
		else if(Math.abs(this.flipX) < 0.99) this.flipX = this.flipX + (((this.x < innerWidth / 2)? 1 : -1) - this.flipX) * 0.3
	
		this.c.fillStyle = `rgb(255, 255, 255)`
		this.c.beginPath()
		this.c.arc(this.x, this.y, 6 * this.transition, 0, 6.28318)
		this.c.fill()
	
		this.c.strokeStyle = `rgb(255, 255, 255)`
		this.c.lineWidth = 2
		this.c.beginPath()
		this.c.moveTo(this.x, this.y)
		this.c.lineTo(this.x + 60 * this.transition * this.flipX, this.y + 60 * this.transition)
		this.c.stroke()
	
		this.c.beginPath()
		this.c.moveTo(this.x + 60 * this.transition * this.flipX, this.y + 60 * this.transition)
		this.c.lineTo(this.x + (this.width + 90) * this.transition * this.flipX, this.y + 60 * this.transition)
		this.c.stroke()
	
		this.c.fillStyle = `rgba(255, 255, 255, 0.8)`
		this.c.fillRect(this.x + ((this.flipX > 0)? 90 : -this.width - 90), this.y + 30 + 30 * (1 - this.transition), this.width, 30 * this.transition)
	
		this.c.fillStyle = `rgba(119, 136, 170, ${this.transition})`
		this.c.font = '24px Noto Sans TC'
		this.c.fillText(this.text, this.x + ((this.flipX > 0)? 90 : -this.width - 90), this.y + 60)
	}
}