import * as THREE from 'three'
import { GLTFLoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/GLTFLoader.js'

const loadingManager = new THREE.LoadingManager()
loadingManager.onProgress = (url, loaded, total) => {
	document.querySelector('#progress div div').style.width = `${loaded / total * 100}%`
	if(loaded / total >= 1) {
		document.querySelector('#language').style.display = 'flex'
		setTimeout(() => {
			document.querySelector('#progress').style.opacity = 0
			document.querySelector('#language').style.opacity = 1
		}, 1000)
	}
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, 0.1, 1000)
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x7788aa, 0, 150)
scene.background = new THREE.Color(0x7788aa)

let mouseX = 0, mouseY = 0, lookOffsetX = 0, lookOffsetY = 0
let interactiveObjects = []
let animatedTextures = []

const directionalLight = new THREE.DirectionalLight(0x888888, 1)
directionalLight.position.set(1, 1, 1)
const rectLight = new THREE.RectAreaLight(0xffffff, 0.5, 1.6 * 3.5, 0.9 * 3.5)
rectLight.position.set(0, 3.65, -3)
scene.add(directionalLight)
scene.add(rectLight)
scene.add(new THREE.AmbientLight(0x607cad, 1))

let particles = {}
particles.geometry = new THREE.BufferGeometry()
particles.points = []
for(let i = 0; i < 1000; i++) {
	particles.points.push(Math.random() * 100 - 20, Math.random() * 20, Math.random() * -80)
}
particles.bufferAttribute = new THREE.Float32BufferAttribute(particles.points, 3)
particles.geometry.setAttribute('position', particles.bufferAttribute)
particles.mesh = new THREE.Points(particles.geometry, new THREE.PointsMaterial({ color: 0xaabbdd, size: 0.5}))
particles.update = () => {
	particles.bufferAttribute.needsUpdate = true
	for(let i = 0; i < 1000; i++) {
		let x = particles.bufferAttribute.getX(i)
		if(x < -20) x = 80
		particles.bufferAttribute.setX(i, x + Math.sin(i * 123.45) * 0.1 - 0.1)
		let y = particles.bufferAttribute.getY(i)
		particles.bufferAttribute.setY(i, (y > 0)? y - 0.1 : 20)

	}
}
scene.add(particles.mesh)

let gallery = {
	time: 600,
	frameCount: 0,
	artworks: [],
	addImage: image => {
		let geometry = new THREE.PlaneGeometry(5.6, 3.15)
		let material = new THREE.MeshStandardMaterial({ map: image.texture, transparent: true })
		let mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(0, 3.63, -3.5)
		if(image.onclick) {
			mesh.click = image.onclick
			interactiveObjects.push(mesh)
		}
		scene.add(mesh)
		gallery.artworks.push(mesh)
	},
	update: () => {
		gallery.frameCount++
		let display_index = parseInt(gallery.frameCount / gallery.time) % gallery.artworks.length
		for(let i = 0; i < gallery.artworks.length; i++) {
			if(display_index == i) {
				gallery.artworks[i].position.z = -3.5
				gallery.artworks[i].material.opacity = Math.min(((gallery.frameCount / gallery.time) % gallery.artworks.length - i) * 10, 1)
				gallery.artworks[i].material.map.needsUpdate = true
			}
			else if(display_index == (i + 1) % gallery.artworks.length) {
				gallery.artworks[i].position.z = -3.51
				gallery.artworks[i].material.opacity = 1
				gallery.artworks[i].material.map.needsUpdate = true
			}
			else gallery.artworks[i].position.z = -3.52
		}
	}
}

let skipButton = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 0.05), new THREE.MeshStandardMaterial())
skipButton.position.set(0, 1.9, -3.49)
skipButton.click = () => { gallery.frameCount += Math.max(0, 600 - gallery.frameCount % 600) }
interactiveObjects.push(skipButton)
scene.add(skipButton)

new GLTFLoader(loadingManager).load('./assets/station.glb', gltf => {
new THREE.TextureLoader().load('./assets/baked.png', image => {
	image.flipY = false
	let material = new THREE.MeshBasicMaterial({ map: image })
	gltf.scene.traverse(child => {
		if(child instanceof THREE.Mesh) {
			if(child.material.name == 'Baked') child.material = material
			if(child.material.name == 'Glass') child.material.transparent = true
			if(child.material.name == 'Glass') child.material.opacity = 0.3

			if(child.name == 'Can') {
				interactiveObjects.push(child)
				child.click = dialogue1
			}
			if(child.name == 'Fence2') {
				interactiveObjects.push(child)
				child.click = dialogue2
			}
			if(child.name == 'Lamp') {
				interactiveObjects.push(child)
				child.click = dialogue3
			}
		}
	})
	scene.add(gltf.scene)
})})

new THREE.TextureLoader(loadingManager).load('./assets/artwork1.jpg', texture => {
	gallery.addImage({
		texture: texture,
		onclick: dialogue4
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/artwork2.jpg', texture => {
	gallery.addImage({
		texture: texture,
		onclick: dialogue10
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/artwork3.jpg', texture => {
	gallery.addImage({
		texture: texture,
		onclick: dialogue11
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/artwork4.jpg', texture => {
	gallery.addImage({
		texture: texture,
		onclick: dialogue12
	})
})

addVideo(document.getElementById('video3'), () => {
	let texture = new THREE.VideoTexture(video3)
	gallery.addImage({
		texture: texture,
		onclick: () => { open('https://s24egao.github.io/motion', '_blank') }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/artwork6.jpg', texture => {
	gallery.addImage({
		texture: texture,
		onclick: dialogue13
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/artwork7.jpg', texture => {
	gallery.addImage({
		texture: texture,
		onclick: () => {}
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/poster1.jpg', texture => {
	addImage({
		texture: texture, 
		scale: { x: 1.5, y: 2 },
		position: { x: 4.2, y: 4.5, z: -3.7 },
		rotation: { x: 0, y: 0, z: -6 }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/icon.png', texture => {
	addImage({
		texture: texture, 
		scale: { x: 1, y: 1 },
		position: { x: 4.8, y: 2.6, z: -3.7 },
		rotation: { x: 0, y: 0, z: 6 },
		onclick: () => { open('https://s24egao.github.io') }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/youtube.jpg', texture => {
	addImage({
		texture: texture, 
		scale: { x: 0.5, y: 0.5 },
		position: { x: 3.8, y: 2.9, z: -3.7 },
		rotation: { x: 0, y: 0, z: -8 },
		onclick: () => { open('https://www.youtube.com/channel/UCudLKarfLoiMVZW0zyApMVA', '_blank') }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/pixiv.jpg', texture => {
	addImage({
		texture: texture, 
		scale: { x: 0.5, y: 0.5 },
		position: { x: 3.6, y: 2.2, z: -3.7 },
		rotation: { x: 0, y: 0, z: 3 },
		onclick: () => { open('https://www.pixiv.net/users/80929565', '_blank') }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/text2.jpg', texture => {
	addImage({
		alphaMap: texture, 
		scale: { x: 1, y: 1 },
		position: { x: 4.8, y: 1.6, z: -3.7 }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/text.jpg', texture => {
	addImage({
		alphaMap: texture, 
		scale: { x: 1, y: 1 },
		position: { x: -4, y: 4.1, z: -3.7 }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/sketch.jpg', texture => {
	addImage({
		texture: texture, 
		scale: { x: 2, y: 1.5 },
		position: { x: -4.2, y: 2.8, z: -3.7 },
		rotation: { x: 0, y: 0, z: 3 },
		onclick: dialogue5
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/twitter.png', texture => {
	addImage({
		alphaMap: texture, 
		color: 0x1d9bf0,
		scale: { x: 0.8, y: 0.68 },
		position: { x: 6.02, y: 4.87, z: 2.95 },
		rotation: { x: 0, y: -31, z: 0 },
		onclick: dialogue6
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/moon.jpg', texture => {
	addImage({
		alphaMap: texture,
		emissive: 0xffffff,
		scale: { x: 5, y: 5 },
		position: { x: 52.8, y: 7, z: -39.2 },
		rotation: { x: 0, y: 279.2, z: 0 },
		onclick: () => { toggleDarkMode() }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/too_wide.jpg', texture => {
	addImage({
		alphaMap: texture,
		emissive: 0xffffff,
		scale: { x: 3, y: 0.6 },
		position: { x: -7.5, y: 3.5, z: 0 },
		rotation: { x: 0, y: 60, z: 90 },
		onclick: dialogue7
	})
})

addVideo(document.getElementById('video1'), () => {
	let texture = new THREE.VideoTexture(video1)
	animatedTextures.push(texture)
	addImage({
		alphaMap: texture, 
		emissive: 0xffffff,
		scale: { x: 2, y: 0.7 },
		position: { x: 6.06, y: 2.45, z: 2.88 },
		rotation: { x: 0, y: -17, z: 1.8 }
	})
})

addVideo(document.getElementById('video2'), () => {
	let texture = new THREE.VideoTexture(video2)
	animatedTextures.push(texture)
	addImage({
		alphaMap: texture, 
		emissive: 0xffffff,
		scale: { x: 1, y: 1.8 },
		position: { x: -3.64, y: 1.2, z: -1.8 },
		onclick: dialogue8
	})
})

const display = new THREE.CanvasTexture(clock.canvas)
animatedTextures.push(display)
addImage({
	alphaMap: display,
	emissive: 0xffffff,
	scale: { x: 3.75, y: 1.8 },
	position: { x: 5.96, y: 5.3, z: -0.3 },
	rotation: { x: 0, y: -90, z: 0 },
	onclick: dialogue9
})

function animate() {
	requestAnimationFrame(animate)

	lookOffsetX = lerp(lookOffsetX, mouseX, 0.1)
	lookOffsetY = lerp(lookOffsetY, mouseY, 0.1)
	camera.lookAt(3 + lookOffsetX * 0.8, 4.2 - lookOffsetY * 0.8, -1)
	camera.position.set(-3.6 + lookOffsetX * 0.6, 3.6 - lookOffsetY * 0.6, 12 + lookOffsetX)

	gallery.update()
	particles.update()
	for(let texture of animatedTextures) {
		texture.needsUpdate = true
	}

	renderer.render(scene, camera)
}
animate()

let ray = new THREE.Raycaster()
renderer.domElement.addEventListener('click', e => {
	ray.setFromCamera(new THREE.Vector2(mouseX, -mouseY), camera)
	let intersects = ray.intersectObjects(interactiveObjects)
	if(intersects.length > 0) if(intersects[0].object.click) intersects[0].object.click()
})

addEventListener('mousemove', e => {
	mouseX = (e.clientX / innerWidth) * 2 - 1
	mouseY = (e.clientY / innerHeight) * 2 - 1

	ray.setFromCamera(new THREE.Vector2(mouseX, -mouseY), camera)
	let intersects = ray.intersectObjects(interactiveObjects)
	if(intersects.length > 0) renderer.domElement.style.cursor = 'pointer'
	else renderer.domElement.style.cursor = 'default'
})

onresize = e => {
	camera.aspect = innerWidth / innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(innerWidth, innerHeight)
	if(innerWidth / innerHeight < 1) document.querySelector('#wide-screen').style.opacity = '1'
	else document.querySelector('#wide-screen').style.opacity = '0'
}
onresize()

function lerp(a, b, f) {
	return a + (b - a) * f
}

function addImage(image) {
	let geometry = new THREE.PlaneGeometry(image.scale.x, image.scale.y)
	let material 
	if(!image.alphaMap) material = new THREE.MeshStandardMaterial({ map: image.texture })
	else material = new THREE.MeshStandardMaterial({
		alphaMap: image.alphaMap,
		color: (image.color)? image.color : 0xffffff,
		emissive: (image.emissive)? image.emissive : 0x000000,
		transparent: true,
		depthWrite: false
	})
	let mesh = new THREE.Mesh(geometry, material)
	if(image.position) mesh.position.set(image.position.x, image.position.y, image.position.z)
	if(image.rotation) {
		mesh.rotation.x = image.rotation.x / 57.29577
		mesh.rotation.y = image.rotation.y / 57.29577
		mesh.rotation.z = image.rotation.z / 57.29577
	}
	if(image.onclick) {
		mesh.click = image.onclick
		interactiveObjects.push(mesh)
	}
	scene.add(mesh)
	return mesh
}

function addVideo(video, onload) {
	video.play()
	if(video.readyState > 0) {
		onload()
	}
	else video.addEventListener('loadeddata', onload)
}

let darkMode = false
function toggleDarkMode() {
	darkMode = !darkMode
	if(darkMode) {
		scene.traverse(child => { if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) 
		child.material.color = new THREE.Color(0x222222) })
	loadDialogue([[ '夜間模式已開啟' ], [ 'Night mode enabled' ]])
	} else {
		scene.traverse(child => { if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) 
		child.material.color = new THREE.Color(0xffffff) })
	loadDialogue([[ '夜間模式已關閉' ], [ 'Night mode disabled' ]])
	}
}