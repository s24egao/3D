if(window.innerWidth / window.innerHeight < 1) $('#wide-screen').css('opacity', '1')
else $('#wide-screen').css('opacity', '0')

console.log('要更快 還要更快')

const loadingManager = new THREE.LoadingManager()
loadingManager.onProgress = (url, loaded, total) => {
	$('#loading div div').css('width', `${loaded / total * 100}%`)
	if(loaded / total >= 1) setTimeout(() => { $('#loading').css('opacity', 0) }, 2000)
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 1000)
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
particles.mesh = new THREE.Points(particles.geometry, new THREE.PointsMaterial({ color: 0xaabbdd, size: 0.5, depthTest: false}))
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

new THREE.GLTFLoader(loadingManager).load('./assets/station.glb', gltf => {
new THREE.TextureLoader().load('./assets/baked.png', image => {
	image.flipY = false
	let material = new THREE.MeshBasicMaterial({ map: image })
	gltf.scene.traverse(child => {
		if(child instanceof THREE.Mesh) {
			if(child.material.name == 'Baked') child.material = material
			if(child.material.name == 'Glass') child.material.transparent = true
			if(child.material.name == 'Glass') child.material.opacity = 0.3
		}
	})
	scene.add(gltf.scene)
})})

new THREE.TextureLoader(loadingManager).load('./assets/image.png', texture => {
	addImage({
		texture: texture, 
		scale: { x: 1.6 * 3.5, y: 0.9 * 3.5 },
		position: { x: 0, y: 3.63, z: -3.5 },
		onclick: () => {
			loadDialogue([
				'你看這是我畫的畫',
				'要不要到 Pixiv 看看大圖？',
				'可是你不能拒絕耶',
				() => { window.open('https://www.pixiv.net/artworks/97978612', '_blank') }
			])
		}
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
		rotation: { x: 0, y: 0, z: 6 }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/text.jpg', texture => {
	addImage({
		alphaMap: texture, 
		scale: { x: 1, y: 1 },
		position: { x: -4, y: 3.9, z: -3.7 }
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/sketch.jpg', texture => {
	addImage({
		texture: texture, 
		scale: { x: 2, y: 1.5 },
		position: { x: -4.2, y: 2.6, z: -3.7 },
		rotation: { x: 0, y: 0, z: 3 },
		onclick: () => {
			loadDialogue([
				'這張圖是這個 3D 網頁的草稿 :)',
				'我本來覺得畫得很好 畫面稍微雜亂但豐富 有點魚眼效果但有張力的透視',
				'結果我 3D 建模變成這個樣子 :('
			])
		}
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/twitter.png', texture => {
	addImage({
		alphaMap: texture, 
		color: 0x1d9bf0,
		scale: { x: 0.8, y: 0.68 },
		position: { x: 6.02, y: 4.87, z: 2.95 },
		rotation: { x: 0, y: -31, z: 0 },
		onclick: () => {
			loadDialogue([
				'歡迎到我的推特看看！',
				() => { window.open('https://twitter.com/s24egao', '_blank') }
			])
		}
	})
})

const video1 = document.getElementById('video1')
video1.play()
setTimeout(() => {
	const hello = new THREE.VideoTexture(video1)
	animatedTextures.push(hello)
	addImage({
		alphaMap: hello, 
		emissive: 0xffffff,
		scale: { x: 2, y: 0.7 },
		position: { x: 6.06, y: 2.45, z: 2.88 },
		rotation: { x: 0, y: -17, z: 1.8 }
	})
}, 1000)

const display = new THREE.CanvasTexture(clock.canvas)
animatedTextures.push(display)
addImage({
	alphaMap: display,
	emissive: 0xffffff,
	scale: { x: 3.75, y: 1.8 },
	position: { x: 5.96, y: 5.3, z: -0.3 },
	rotation: { x: 0, y: -90, z: 0 },
	onclick: () => {
		loadDialogue([
			`現在是 ${new Date().getHours()} 點`,
			`然後 ${new Date().getMinutes()} 分`,
			`然後 ${new Date().getSeconds()} 秒`,
			':)',
		])
	},
})

function animate() {
	requestAnimationFrame(animate)

	lookOffsetX = lerp(lookOffsetX, mouseX, 0.1)
	lookOffsetY = lerp(lookOffsetY, mouseY, 0.1)
	camera.lookAt(3 + lookOffsetX * 0.8, 4.2 - lookOffsetY * 0.8, -1)
	camera.position.set(-3.6 + lookOffsetX * 0.6, 3.6 - lookOffsetY * 0.6, 12 + lookOffsetX)

	particles.update()
	for(let texture of animatedTextures) {
		texture.needsUpdate = true
	}

	renderer.render(scene, camera)
}
animate()

let ray = new THREE.Raycaster()
window.addEventListener('click', e => {
	ray.setFromCamera(new THREE.Vector2(mouseX, -mouseY), camera)
	let intersects = ray.intersectObjects(interactiveObjects)
	if(intersects.length > 0) intersects[0].object.click()
})

window.addEventListener('mousemove', e => {
	mouseX = (e.clientX / window.innerWidth) * 2 - 1
	mouseY = (e.clientY / window.innerHeight) * 2 - 1

	ray.setFromCamera(new THREE.Vector2(mouseX, -mouseY), camera)
	let intersects = ray.intersectObjects(interactiveObjects)
	if(intersects.length > 0) renderer.domElement.style.cursor = 'pointer'
	else renderer.domElement.style.cursor = 'default'
})

window.addEventListener('resize', e => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	if(window.innerWidth / window.innerHeight < 1) $('#wide-screen').css('opacity', '1')
	else $('#wide-screen').css('opacity', '0')
})

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
		transparent: true
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