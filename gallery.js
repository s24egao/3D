import * as THREE from 'three'

export default class Gallery {
    duration = 10
    time = 0
    textures = []

	constructor(duration, w, h) {
        this.color = new THREE.Color(1, 1, 1)
        this.material = new THREE.MeshStandardMaterial({ color: this.color })
        this.geometry = new THREE.PlaneGeometry(w, h)
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.duration = duration
    }

    add(url, loadingManager, isVideo) {
        let onload = texture => {
			if(isVideo) texture = new THREE.VideoTexture(document.getElementById(url))
			texture.colorSpace = THREE.SRGBColorSpace
            this.textures.push(texture)
		}
		if(isVideo)	{
			document.getElementById(url).play()
			if(document.getElementById(url).readyState > 0) onload()
			else document.getElementById(url).addEventListener('loadeddata', onload)
		} else new THREE.TextureLoader(loadingManager).load(url, onload)
    }

    next() {
        this.time += Math.max(0, this.duration - this.time % this.duration) - 0.5
    }

    update(d) {
        this.time += d
		let i = parseInt(this.time / this.duration) % this.textures.length
		this.material.map = this.textures[i]

        let v = Math.min((this.time / this.duration) % 1 * 20, 1) * Math.min(20 - (this.time / this.duration) % 1 * 20, 1)
        this.color.setRGB(v, v, v)
        this.material.color = this.color
    }
}