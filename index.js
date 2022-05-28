const loadingManager = new THREE.LoadingManager()
loadingManager.onProgress = (url, loaded, total) => {
	$('#loading div div').css('width', `${loaded / total * 100}%`)
	if(loaded / total >= 1) {
		setTimeout(() => { $('#loading').css('opacity', 0) }, 2000)
		setTimeout(() => { $('#loading').css('display', 'none') }, 2500)
	}
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x7788aa)
const camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 0.1, 1000)

let mouseX = 0, mouseY = 0, lookOffsetX = 0, lookOffsetY = 0
let interactiveObjects = []

const directionalLight = new THREE.DirectionalLight(0x7788aa, 1)
directionalLight.position.set(0, 1, 1)
scene.add(directionalLight)
const aimbientLight = new THREE.AmbientLight(0x7788aa, 0.6)
scene.add(aimbientLight)
const rectLight = new THREE.RectAreaLight(0xffffff, 0.5, 1.6 * 3.5, 0.9 * 3.5)
rectLight.position.set(0, 3.65, -3)
scene.add(rectLight)

let particles = {}
particles.geometry = new THREE.BufferGeometry()
particles.points = []
for(let i = 0; i < 1000; i++) {
	particles.points.push(Math.random() * 100 - 50, Math.random() * 15, Math.random() * -100)
}
particles.bufferAttribute = new THREE.Float32BufferAttribute(particles.points, 3)
particles.geometry.setAttribute('position', particles.bufferAttribute)
particles.mesh = new THREE.Points(particles.geometry, new THREE.PointsMaterial({ color: 0xaabbdd, size: 0.5, depthTest: false}))
particles.update = () => {
	particles.bufferAttribute.needsUpdate = true
	for(let i = 0; i < 1000; i++) {
		let x = particles.bufferAttribute.getX(i)
		if(x > 50) x = -50
		else if(x < -50) x = 50
		particles.bufferAttribute.setX(i, x + Math.sin(i * 123.45) * 0.1)
		let y = particles.bufferAttribute.getY(i)
		particles.bufferAttribute.setY(i, (y > 0)? y - 0.1 : 15)

	}
}
scene.add(particles.mesh)

new THREE.GLTFLoader(loadingManager).load('./assets/station.glb', gltf => {
	new THREE.TextureLoader().load('./assets/baked.png', image => {
		image.flipY = false
		let m = new THREE.MeshBasicMaterial({ map: image })
		gltf.scene.traverse(child => {
			if(child instanceof THREE.Mesh) {
				if(child.material.name == 'Baked') child.material = m
				if(child.material.name == 'Glass') child.material.thickness = 0.1
				if(child.material.name == 'Glass') child.material.transmission = 0.5
			}
		})
		scene.add(gltf.scene)
	})
})

new THREE.TextureLoader(loadingManager).load('./assets/image.png', texture => {
	let g = new THREE.PlaneGeometry(1.6 * 3.5, 0.9 * 3.5)
	let m = new THREE.MeshStandardMaterial({ map: texture })
	let mesh = new THREE.Mesh(g, m)
	mesh.position.set(0, 3.63, -3.5)
	mesh.click = () => {
		loadDialogue([
			'你看這是我畫的畫',
			'要不要到 Pixiv 看看大圖？',
			'可是你不能拒絕耶',
			() => { window.open('https://www.pixiv.net/artworks/97978612', '_blank') }
		])
	}
	interactiveObjects.push(mesh)
	scene.add(mesh)
})

new THREE.TextureLoader(loadingManager).load('./assets/poster1.jpg', texture => {
	let g = new THREE.PlaneGeometry(1.5, 2)
	let m = new THREE.MeshStandardMaterial({ map: texture })
	let mesh = new THREE.Mesh(g, m)
	mesh.position.set(4.2, 4.5, -3.7)
	mesh.rotation.z = -0.1
	scene.add(mesh)
})

new THREE.TextureLoader(loadingManager).load('./assets/icon.png', texture => {
	let g = new THREE.PlaneGeometry(1, 1)
	let m = new THREE.MeshStandardMaterial({ map: texture })
	let mesh = new THREE.Mesh(g, m)
	mesh.position.set(4.8, 2.6, -3.7)
	mesh.rotation.z = 0.1
	scene.add(mesh)
})

new THREE.TextureLoader(loadingManager).load('./assets/sketch.jpg', texture => {
	let g = new THREE.PlaneGeometry(2, 1.5)
	let m = new THREE.MeshStandardMaterial({ map: texture })
	let mesh = new THREE.Mesh(g, m)
	mesh.position.set(-4.2, 2.6, -3.7)
	mesh.rotation.z = 0.05
	mesh.click = () => {
		loadDialogue([
			'這張圖是這個 3D 網頁的草稿 :)',
			'我本來覺得畫得很好 畫面稍微雜亂但豐富 有點魚眼效果但有張力的透視',
			'結果我 3D 建模變成這個樣子 :('
		])
	}
	interactiveObjects.push(mesh)
	scene.add(mesh)
})

new THREE.TextureLoader(loadingManager).load('./assets/text.jpg', texture => {
	let g = new THREE.PlaneGeometry(1 , 1)
	let m = new THREE.MeshStandardMaterial({ alphaMap: texture, color: 0xffffff, transparent: true })
	let mesh = new THREE.Mesh(g, m)
	mesh.position.set(-4, 3.9, -3.7)
	scene.add(mesh)
})

new THREE.TextureLoader(loadingManager).load('./assets/twitter.png', texture => {
	let g = new THREE.PlaneGeometry(1 * 0.8, 0.85 * 0.8)
	let m = new THREE.MeshStandardMaterial({ alphaMap: texture, color: 0x1d9bf0, transparent: true })
	let mesh = new THREE.Mesh(g, m)
	mesh.position.set(6.02, 4.87, 2.95)
	mesh.rotation.y = -31 / 57.29577
	mesh.click = () => {
		loadDialogue([
			'歡迎到我的推特看看！',
			() => { window.open('https://twitter.com/s24egao', '_blank') }
		])
	}
	interactiveObjects.push(mesh)
	scene.add(mesh)
})

const clock_texture = new THREE.CanvasTexture(document.getElementById('clock').getContext('2d').canvas)
const clock_g = new THREE.PlaneGeometry(3.75, 1.25)
const clock_m = new THREE.MeshStandardMaterial({ alphaMap: clock_texture, emissive: 0xffffff, transparent: true })
const clock_mesh = new THREE.Mesh(clock_g, clock_m)
clock_mesh.position.set(5.96, 5.6, -0.4)
clock_mesh.rotation.y = -90 / 57.29577
clock_mesh.click = () => {
	loadDialogue([
		`現在是 ${new Date().getHours()} 點`,
		`然後 ${new Date().getMinutes()} 分`,
		`然後 ${new Date().getSeconds()} 秒`,
		':)',
	])
}
interactiveObjects.push(clock_mesh)
scene.add(clock_mesh)

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
})

function lerp(a, b, f) {
	return a + (b - a) * f
}

function animate() {
	requestAnimationFrame(animate)

	lookOffsetX = lerp(lookOffsetX, mouseX, 0.1)
	lookOffsetY = lerp(lookOffsetY, mouseY, 0.1)
	camera.lookAt(3 + lookOffsetX * 0.8, 4 - lookOffsetY * 0.8, -1)
	camera.position.set(-3.6 + lookOffsetX * 0.6, 3.6 - lookOffsetY * 0.6, 17)

	particles.update()
	clock_texture.needsUpdate = true

	renderer.render(scene, camera)
}
animate()