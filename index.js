const loadingManager = new THREE.LoadingManager()
loadingManager.onProgress = (url, loaded, total) => {
	document.querySelector('#progress div div').style.width = `${loaded / total * 100}%`
	if(loaded / total >= 1) {
		setTimeout(() => {
			document.querySelector('#loading').style.opacity = 0
			document.querySelector('#title').style.color = 'transparent'
			document.querySelector('#loading').style.opacity = 0
			document.querySelector('#title div').style.animation = 'text 1s 0s ease-in-out'
		}, 500)
		setTimeout(() => { 
			document.querySelector('#loading').style.display = 'none'
			document.querySelector('#title').style.color = 'white'
		 }, 1000)
	}
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

let clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, 0.1, 1000)
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x7788aa, 0, 150)
scene.background = new THREE.Color(0x7788aa)

let mouseX = 0, mouseY = 0, lookOffsetX = 0, lookOffsetY = 0
let animatedTextures = []

const directionalLight = new THREE.DirectionalLight(0x888888, 1)
directionalLight.position.set(1, 1, 1)
const rectLight = new THREE.RectAreaLight(0xffffff, 0.5, 1.6 * 3.5, 0.9 * 3.5)
rectLight.position.set(0, 3.65, -3)
scene.add(directionalLight)
scene.add(rectLight)
scene.add(new THREE.AmbientLight(0x607cad, 1))

let interactive = {
	list: [],
	add(mesh, onclick, text) {
		if(onclick) mesh.click = onclick
		if(text) mesh.text = text
		this.list.push(mesh)
	}
}

let particles = {
	mesh: new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xaabbdd, size: 0.5})),
	update(d) {
		if(!this.mesh.geometry.attributes?.position) {
			let points = []
			for(let i = 0; i < 1000; i++) points.push(Math.random() * 100 - 20, Math.random() * 20, Math.random() * -80)
			this.mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
			scene.add(this.mesh)
		}
		this.mesh.geometry.attributes.position.needsUpdate = true
		for(let i = 0; i < 1000; i++) {
			let position = this.mesh.geometry.attributes.position.array
			position[i * 3] += (position[i * 3] > -20)? (Math.sin(i * 123.45) * 5 - 5) * d : 100
			position[i * 3 + 1] += (position[i * 3 + 1] > 0)? -d * 2 : 20
		}
	}
}

let gallery = {
	duration: 10,
	artworks: [],
	time: 0,
	addImage(url, onclick, type) {
		let onload = texture => {
			if(type == 'video') texture = new THREE.VideoTexture(document.getElementById(url))
			let mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.15), new THREE.MeshStandardMaterial({ map: texture, transparent: true }))
			mesh.position.set(0, 3.63, -3.5)
			if(onclick) interactive.add(mesh, onclick)
			scene.add(mesh)
			this.artworks.push(mesh)
		}
		if(type == 'video')	{
			document.getElementById(url).play()
			if(document.getElementById(url).readyState > 0) onload()
			else document.getElementById(url).addEventListener('loadeddata', onload)
		} else new THREE.TextureLoader(loadingManager).load(url, onload)
	},
	update(d) {
		this.time += d
		let display_index = parseInt(this.time / this.duration) % this.artworks.length
		for(let i = 0; i < gallery.artworks.length; i++) {
			if(display_index == i) {
				this.artworks[i].position.z = -3.5
				this.artworks[i].material.opacity = Math.min(((this.time / this.duration) % this.artworks.length - i) * 10, 1)
				this.artworks[i].material.map.needsUpdate = true
			}
			else if(display_index == (i + 1) % this.artworks.length) {
				this.artworks[i].position.z = -3.51
				this.artworks[i].material.opacity = 1
				this.artworks[i].material.map.needsUpdate = true
			}
			else this.artworks[i].position.z = -3.52
		}
	}
}

let skipButton = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 0.05), new THREE.MeshStandardMaterial())
skipButton.position.set(0, 1.9, -3.49)
interactive.add(skipButton, () => { gallery.time += Math.max(0, 10 - gallery.time % 10) }, ['下一張圖片', 'next image', '次の画像'])
scene.add(skipButton)

function addImage(url, data, type) {
	let onload = texture => {
		if(type == 'video') texture = new THREE.VideoTexture(document.getElementById(url))
		if(type == 'canvas') texture = new THREE.CanvasTexture(document.getElementById(url)) 
		let mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(data.scale.x, data.scale.y),
			(!data.alphaMap)? new THREE.MeshStandardMaterial({ map: texture }) : 
			new THREE.MeshStandardMaterial({
				alphaMap: texture,
				color: (data.color)? data.color : 0xffffff,
				emissive: (data.emissive)? data.emissive : 0x000000,
				transparent: true,
				depthWrite: false
			})
		)
		if(data.position) mesh.position.set(data.position.x, data.position.y, data.position.z)
		if(data.rotation) mesh.rotation.set(data.rotation.x / 57.29577, data.rotation.y / 57.29577, data.rotation.z / 57.29577)
		if(data.onclick) interactive.add(mesh, data.onclick, data.text)
		if(type == 'video' || type == 'canvas')animatedTextures.push(texture)
		scene.add(mesh)
	}
	if(type == 'video') {
		document.getElementById(url).play()
		if(document.getElementById(url).readyState > 0) onload()
		else document.getElementById(url).addEventListener('loadeddata', onload)
	} else if(type == 'canvas') onload()
	else new THREE.TextureLoader(loadingManager).load(url, onload)
}

let darkMode = {
	enabled: false,
	toggle() {
		this.enabled = !this.enabled
		dialogue.load(
			(this.enabled)? [[ '夜間模式已開啟' ], [ 'Night mode enabled' ], [ 'ナイトモードを切り替えました' ]] : [[ '夜間模式已關閉' ], [ 'Night mode disabled' ], [ 'ナイトモードを切り替えました' ]])
		scene.traverse(child => { if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial)
			child.material.color = new THREE.Color((this.enabled)? 0x222222 : 0xffffff) })
	}
}

new THREE.GLTFLoader(loadingManager).load('./assets/station.glb', gltf => new THREE.TextureLoader().load('./assets/baked.png', image => {
	image.flipY = false
	let material = new THREE.MeshBasicMaterial({ map: image })
	gltf.scene.traverse(child => {
		if(child instanceof THREE.Mesh) {
			if(child.material.name == 'Baked') child.material = material
			if(child.material.name == 'Glass') child.material.transparent = true
			if(child.material.name == 'Glass') child.material.opacity = 0.3
			if(child.name == 'Can') interactive.add(child, dialogue1, ['垃圾桶', 'trash can', 'ごみ箱'])
			if(child.name == 'Fence2') interactive.add(child, dialogue2, ['柵欄', 'fence', 'フェンス'])
			if(child.name == 'Lamp') interactive.add(child, dialogue3, ['燈', 'Lamp', 'ランプ'])
		}
	})
	scene.add(gltf.scene)
}))

gallery.addImage('./assets/artwork1.jpg', dialogue4)
gallery.addImage('./assets/artwork2.jpg', dialogue10)
gallery.addImage('./assets/artwork3.jpg', dialogue11)
gallery.addImage('./assets/artwork4.jpg', dialogue12)
gallery.addImage('video3', () => {}, 'video')
gallery.addImage('./assets/artwork6.jpg', dialogue3)
gallery.addImage('./assets/artwork7.jpg', () => {})

addImage('./assets/poster1.jpg', {
	scale: { x: 1.5, y: 2 },
	position: { x: 4.2, y: 4.5, z: -3.7 },
	rotation: { x: 0, y: 0, z: -6 }
})

addImage('./assets/icon.png', {
	scale: { x: 1, y: 1 },
	position: { x: 4.8, y: 2.6, z: -3.7 },
	rotation: { x: 0, y: 0, z: 6 },
	onclick: () => { open('https://s24egao.github.io') },
	text: ['我的個人主網頁', 'my home webpage', 'ホームポージ']
})

addImage('./assets/youtube.jpg', {
	scale: { x: 0.5, y: 0.5 },
	position: { x: 3.8, y: 2.9, z: -3.7 },
	rotation: { x: 0, y: 0, z: -8 },
	onclick: () => { open('https://www.youtube.com/channel/UCudLKarfLoiMVZW0zyApMVA', '_blank') },
	text: ['我的 youtube 頻道', 'my youtube channel', 'youtube チャンエル']
})

addImage('./assets/pixiv.jpg', {
	scale: { x: 0.5, y: 0.5 },
	position: { x: 3.6, y: 2.2, z: -3.7 },
	rotation: { x: 0, y: 0, z: 3 },
	onclick: () => { open('https://www.pixiv.net/users/80929565', '_blank') },
	text: ['我的 pixiv 帳號', 'my pixiv account', 'pixiv アカウント']
})

addImage('./assets/text2.jpg', {
	alphaMap: true, 
	scale: { x: 1, y: 1 },
	position: { x: 4.8, y: 1.6, z: -3.7 }
})

addImage('./assets/text.jpg', {
	alphaMap: true, 
	scale: { x: 1, y: 1 },
	position: { x: -4, y: 4.1, z: -3.7 }
})

addImage('./assets/sketch.jpg', {
	scale: { x: 2, y: 1.5 },
	position: { x: -4.2, y: 2.8, z: -3.7 },
	rotation: { x: 0, y: 0, z: 3 },
	onclick: dialogue5,
	text: ['草稿', 'sketch', '下書き']
})

addImage('./assets/twitter.png', {
	alphaMap: true, 
	color: 0x1d9bf0,
	scale: { x: 0.8, y: 0.68 },
	position: { x: 6.02, y: 4.87, z: 2.95 },
	rotation: { x: 0, y: -31, z: 0 },
	onclick: dialogue6,
	text: ['我的 twitter 帳號', 'my twitter account', 'twitter アカウント']
})

addImage('./assets/moon.jpg', {
	alphaMap: true,
	emissive: 0xffffff,
	scale: { x: 5, y: 5 },
	position: { x: 52.8, y: 7, z: -39.2 },
	rotation: { x: 0, y: 279.2, z: 0 },
	onclick: () => { darkMode.toggle() },
	text: ['夜間模式', 'night mode', 'ナイトモード']
})

addImage('./assets/too_wide.jpg', {
	alphaMap: true,
	emissive: 0xffffff,
	scale: { x: 3, y: 0.6 },
	position: { x: -7.5, y: 3.5, z: 0 },
	rotation: { x: 0, y: 60, z: 90 },
	onclick: dialogue7
})

addImage('video1', {
	alphaMap: true, 
	emissive: 0xffffff,
	scale: { x: 2, y: 0.7 },
	position: { x: 6.06, y: 2.45, z: 2.88 },
	rotation: { x: 0, y: -17, z: 1.8 }
}, 'video')

addImage('video2', {
	alphaMap: true,
	emissive: 0xffffff,
	scale: { x: 1, y: 1.8 },
	position: { x: -3.64, y: 1.2, z: -1.8 },
	onclick: dialogue8,
	text: ['關於我', 'about me', '自己紹介']
}, 'video')

addImage('clock', {
	alphaMap: true,
	emissive: 0xffffff,
	scale: { x: 3.75, y: 1.8 },
	position: { x: 5.96, y: 5.3, z: -0.3 },
	rotation: { x: 0, y: -90, z: 0 },
	onclick: dialogue9,
	text: ['電子鐘', 'digital clock', '時計']
}, 'canvas')

let showInfo = new ShowInfo('show-info')
let lastTime = 0
function animate(time) {
	requestAnimationFrame(animate)

	lookOffsetX += (mouseX - lookOffsetX) * 0.005 * Math.min(time - lastTime, 1000)
	lookOffsetY += (mouseY - lookOffsetY) * 0.005 * Math.min(time - lastTime, 1000)
	camera.lookAt(3 + lookOffsetX * 0.8, 4.2 - lookOffsetY * 0.8, -1)
	camera.position.set(-3 + lookOffsetX * -0.6, 3.6 - lookOffsetY * -0.6, 12.5 + lookOffsetX)

	let d = clock.getDelta()
	particles.update(d)
	gallery.update(d)
	updateClockCanvas(clock.elapsedTime)
	for(let texture of animatedTextures) texture.needsUpdate = true
	showInfo.draw(time - lastTime)
	renderer.render(scene, camera)
	lastTime = time
}
animate(0)

let ray = new THREE.Raycaster()
renderer.domElement.addEventListener('click', e => {
	ray.setFromCamera(new THREE.Vector2(mouseX, -mouseY), camera)
	let intersects = ray.intersectObjects(interactive.list)
	if(intersects.length > 0) if(intersects[0].object.click) intersects[0].object.click()
})

addEventListener('mousemove', e => {
	mouseX = (e.clientX / innerWidth) * 2 - 1
	mouseY = (e.clientY / innerHeight) * 2 - 1

	ray.setFromCamera(new THREE.Vector2(mouseX, -mouseY), camera)
	let intersects = ray.intersectObjects(interactive.list)
	renderer.domElement.style.cursor = (intersects.length > 0)? 'none' : 'default'
	showInfo.set((intersects.length > 0), e.clientX, e.clientY, (intersects[0]?.object?.text)? intersects[0].object.text[dialogue.language] : '???')
})

onresize = () => {
	camera.aspect = innerWidth / innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(innerWidth, innerHeight)
}
onresize()