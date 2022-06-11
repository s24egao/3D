let now_dialogues = []
let now_line = ''
let text_index = 0

function loadDialogue(dialogue) {
	if(now_dialogues.length > 0) return
	$('#dialogue-text').text('')
	$('#dialogue').css('bottom', '0px')
	text_index = 0
	now_line = ''
	setTimeout(() => {
		now_dialogues = dialogue[language]
		nextLine()
	}, 300)
}

function nextLine() {
	if(now_dialogues.length <= 0) {
		now_line = ''
		$('#dialogue').css('bottom', '-300px')
		return
	}
	switch(typeof(now_dialogues[0])) {
		case 'string':
			now_line = now_dialogues.shift()
			text_index = 0
			loadText()
			break
		case 'function':
			now_dialogues.shift()()
			nextLine()
			break
	}
}

function loadText() {
	if(text_index >= now_line.length) return
	text_index++
	if(now_line) $('#dialogue-text').text(now_line.slice(0, text_index))
	requestAnimationFrame(loadText)
}

document.body.onkeydown = e => {
	if(e.keyCode == 32) nextLine()
}

let language = 0

let message = [[
	'下一班車即將不會進站',
	'要更快 還要更快', 
	'休息一下 進廣告囉',
	'歡迎光臨 https://s24egao.github.io/3d',
	'往 74 站的列車即將在 10 秒後切換',
	'請緊握扶手 站穩踏階',
	'緊急!!! Blender 閃退怎麼辦!?',
	':O',
	'我應該在每一行對話的結尾加入句點嗎?'
].join('               '),
[
	'There is no bus comming',
	'motto hayaku...', 
	'It\'s relax time!',
	'Welcome to https://s24egao.github.io/3d',
	'Blender is so hard',
	':O'
].join('               ')]

const dialogue1 = () => loadDialogue([[
	'這是建模建的很隨便的垃圾桶',
	'或是回收桶之類的'
], [
	'This is a trash can with very lazy modeling'
]])

const dialogue2 = () => loadDialogue([[
	'這是在前景的柵欄',
	'因為畫草圖的時候覺得前景需要一些物件，讓整體的空間感更平衡',
	'但其實假設這個場景的概念是一個車站的話，柵欄蓋在這裡就很莫名其妙',
	'......'
], [
	'This is fence'
]])

const dialogue3 = () => loadDialogue([[
	'這裡有亮亮的燈',
	'因為光影貼圖是預先烘焙上去的，所以燈關不掉'
], [
	'This is light tube',
	'Because the texture was baked, so we can\'t turn it off'
]])

const dialogue4 = () => loadDialogue([[
	'你看這是我畫的畫',
	'要不要到 Pixiv 看看大圖？',
	'可是你不能拒絕耶',
	() => { window.open('https://www.pixiv.net/artworks/97978612', '_blank') }
], [
	'Look! this is my artwork!',
	'Do you want to view it on Pixiv?',
	() => { window.open('https://www.pixiv.net/artworks/97978612', '_blank') }
]])

const dialogue5 = () => loadDialogue([[
	'這張圖是這個 3D 網頁的草稿',
	'我本來覺得畫得很好，畫面稍微雜亂但豐富、有點魚眼效果但有張力的透視',
	'結果我 3D 建模變成這個樣子 :('
], [
	'This is the original sketch when I\'m designing this scene',
	'I think my drawing is good, but I feel this 3D scene looks totally different'
]])

const dialogue6 = () => loadDialogue([[
	'歡迎到我的 Twitter 看看！',
	() => { window.open('https://twitter.com/s24egao', '_blank') }
], [
	'This is my Twitter account!',
	() => { window.open('https://twitter.com/s24egao', '_blank') }
]])

const dialogue7 = () => loadDialogue([[
	'騙人的吧！你的螢幕也太寬了'
], [
	'Your screen is too wide!'
]])

const dialogue8 = () => loadDialogue([[
	'你好，我是木白。我喜歡畫畫、影像設計、動漫和遊戲開發',
	'歡迎來到我的網站！這裡是一個使用 three.js 所製作的場景',
	'3D 建模和貼圖烘焙是在 Blender 裡完成的，而平面的動畫則是使用 After Effects 和 2D 的 Canvas 所製作的',
	'希望能讓你覺得有趣！'
], [
	'Hello, my name is 木白, I\'m a student interested in drawing, visual design, anime and game development',
	'Welcome to my website! This is a 3D space made with three.js',
	'3D model and baked texture was done in Blender, and 2D animations was made with After Effects and 2D canvas',
	'Hope you enjoy it!'
]])

const dialogue9 = () => loadDialogue([[
	`現在是 ${new Date().getHours()} 點`,
	`然後 ${new Date().getMinutes()} 分`,
	`然後 ${new Date().getSeconds()} 秒`,
	':)'
], [
	`Now is ${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()}`,
	':)'
]])

const dialogue10 = () => loadDialogue([[
	'這是用 Blender 做的小提琴',
], [
	'This is a Violin 3DCG made with Blender'
]])

const dialogue11 = () => loadDialogue([[
	'你可能已經注意到，每次進入這個網頁的時候圖片出現的順序並不一致',
	'大概是因為每張圖片載入完成的時間不一樣'
], [
	'You might notice the order of these image may be different each time you visit this webpage',
	'It\'s probably affect by loading speed of each image'
]])

const dialogue12 = () => loadDialogue([[
	'這張 3D 圖其實原本不是長這樣',
	'我其實在這些圖片顯示的地方放了一個光源',
	'所以所有的圖片看起來都比曝光度更高',
	'這張尤其明顯'
], [
	'These 3DCG looks different with the original image',
	'It\'s because I added a light in front of these images in this 3D space',
	'So all images looks more brightness',
]])

const dialogue13 = () => loadDialogue([[
	'你可以在瀏覽器的控制台輸入 gallery.time = 60 來改變圖片變換的頻率'
], [
	'You can run \'gallery.time = 60\' in console to change the time between switching images'
]])