let now_dialogues = []
let now_line = ''
let text_index = 0

function loadDialogue(dialogue) {
	$('#dialogue-text').text('')
	$('#dialogue').css('bottom', '0px')
	text_index = 0
	now_line = ''
	setTimeout(() => {
		now_dialogues = dialogue.map(a => a)
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