const BGs = [
	'https://media.discordapp.net/attachments/558759865552732190/971972817891496016/0.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972855665410119/1.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972855958999070/2.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972856273567774/3.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972856542015538/4.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972857116631080/5.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972857439600731/6.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972857779351582/7.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972858093907988/8.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972858559471696/9.png',
	'https://media.discordapp.net/attachments/558759865552732190/971972859050217522/10.png'
]
const cvs = document.getElementById('c')
const ctx = cvs.getContext('2d')
const [w,h,padding] = [cvs.width,cvs.height,359]
const [WP,HP] = [w-(padding*2),h-(padding*2)]
const filePick = document.getElementById('filePick')
const saveBtn = document.getElementById('save')
const rarityInput = document.getElementById('rarity')
const rarityCount = document.getElementById('rarityCount')
const uploadErr = document.getElementById('uploadErr')
const urlInput = document.getElementById('imageURL')
let rarity = 0
ctx.fillStyle = '#fff'
ctx.font = '120px Arial'
ctx.textAlign = 'center'

filePick.addEventListener('change', ()=>{
	urlInput.value = ''
	render()
})
urlInput.addEventListener('change', ()=>{
	filePick.value = ''
	render()
})

rarityInput.addEventListener('change', ()=>{
	rarity = rarityInput.value
	render()
})
rarityInput.addEventListener('input', ()=>{
	rarityCount.innerText = `Rarity: ${rarityInput.value}`
})
saveBtn.addEventListener('click',()=>{
	let link = document.createElement('a')
	link.download = 'BadgeIcon.png'
	link.href = cvs.toDataURL()
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	delete link
})

function render() {
	let bgDrawn = false

	function check(src) {
		if(!src) return
		if(!bgDrawn) {
			window.setTimeout(()=>{check(src)}, 100) // make sure the background is drawn first before drawing the item
		} else {
			let uploaded = new Image()
			uploaded.onload=()=>{
				let [width,height,wMult,hMult] = [0,0,1,1]
				
				if(uploaded.width>uploaded.height) {
					let ratio = uploaded.width/uploaded.height
					wMult = WP / uploaded.width
					width = Math.min(uploaded.width * wMult, WP)
					height = Math.min((width/ratio) * hMult, HP)
				} else {
					let ratio = uploaded.height/uploaded.width
					hMult = HP / uploaded.height
					height = Math.min(uploaded.height * hMult, WP)
					width = Math.min((height/ratio) * wMult, HP)
				}
				
				
				ctx.shadowBlur = 120
				ctx.shadowOffsetX = 30
				ctx.shadowOffsetY = 30
				ctx.shadowColor = '#000000AA'
				ctx.drawImage(uploaded,(w/2)-(width/2),(h/2)-(height/2),width,height)
			}
			uploaded.src = src
		}
	}
	check(urlInput.value)

	let file = filePick.files[0]
	if(file) {
		if(!['image/png','image/jpeg'].includes(file.type)) return uploadErr.innerHTML = '<strong>File must be .png, .jpg, or .jpeg!</strong>'
		uploadErr.innerHTML = ''

		let reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend=e=>{
			check(e.target.result)
		}
	}
	
	ctx.clearRect(0,0,w,h)
	ctx.fillText('Loading background image...',1024,1024)
	let bg = new Image()
	bg.crossOrigin = 'anonymous'
	bg.onload=()=>{
		ctx.drawImage(bg,0,0)
		bgDrawn = true
	}
	bg.src = BGs[rarity]
} render()