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
	'https://media.discordapp.net/attachments/558759865552732190/974792200082825216/10.png'
	//'https://media.discordapp.net/attachments/558759865552732190/971972859050217522/10.png' // old
]
const cvs = document.getElementById('c')
const ctx = cvs.getContext('2d')
const [w,h,padding] = [cvs.width,cvs.height,359]
const [WP,HP] = [w-(padding*2),h-(padding*2)]
const imgCvs = document.getElementById('imgCvs')
const filePick = document.getElementById('filePick')
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
	urlInput.value = replaceCdn(urlInput.value)
	render()
})

rarityInput.addEventListener('change', ()=>{
	rarity = rarityInput.value
	render()
})
rarityInput.addEventListener('input', ()=>{
	rarityCount.innerText = `Rarity: ${rarityInput.value}`
})

function replaceCdn(txt) {
	return txt.replace('cdn.discordapp.com','media.discordapp.net')
}

function render() {
	let bgDrawn = false

	function check(src) {
		if(!src) return
		if(!bgDrawn) {
			window.setTimeout(()=>{check(src)}, 100) // make sure the background is drawn first before drawing the item
		} else {
			let uploaded = new Image()
			uploaded.crossOrigin = 'anonymous'
			uploaded.onload=()=>{
				let trim = document.createElement('canvas')
				let trimC = trim.getContext('2d')
				trim.width = uploaded.width
				trim.height = uploaded.height
				trimC.drawImage(uploaded,0,0)
				let final = trimCanvas(trim)
				let [width,height,wMult,hMult] = [0,0,1,1]
				
				if(final.width>final.height) {
					let ratio = final.width/final.height
					wMult = WP / final.width
					width = Math.min(final.width * wMult, WP)
					height = Math.min((width/ratio) * hMult, HP)
				} else {
					let ratio = final.height/final.width
					hMult = HP / final.height
					height = Math.min(final.height * hMult, WP)
					width = Math.min((height/ratio) * wMult, HP)
				}
				
				ctx.shadowBlur = 120
				ctx.shadowOffsetX = 30
				ctx.shadowOffsetY = 30
				ctx.shadowColor = '#000000AA'


				ctx.drawImage(final,(w/2)-(width/2),(h/2)-(height/2),width,height)
				imgCvs.src = cvs.toDataURL()
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
	imgCvs.src = cvs.toDataURL()
	let bg = new Image()
	bg.crossOrigin = 'anonymous'
	bg.onload=()=>{
		ctx.drawImage(bg,0,0)
		imgCvs.src = cvs.toDataURL()
		bgDrawn = true
	}
	bg.src = BGs[rarity]
} render()

function trimCanvas(c) {
	let ctx = c.getContext('2d'),
		copy = document.createElement('canvas').getContext('2d'),
		pixels = ctx.getImageData(0, 0, c.width, c.height),
		l = pixels.data.length,
		i,
		bound = {
			top: null,
			left: null,
			right: null,
			bottom: null
		},
		x, y;
	
	// Iterate over every pixel to find the highest
	// and where it ends on every axis ()
	for (i = 0; i < l; i += 4) {
		if (pixels.data[i + 3] !== 0) {
			x = (i / 4) % c.width;
			y = ~~((i / 4) / c.width);

			if (bound.top === null) {
				bound.top = y;
			}

			if (bound.left === null) {
				bound.left = x;
			} else if (x < bound.left) {
				bound.left = x;
			}

			if (bound.right === null) {
				bound.right = x;
			} else if (bound.right < x) {
				bound.right = x;
			}

			if (bound.bottom === null) {
				bound.bottom = y;
			} else if (bound.bottom < y) {
				bound.bottom = y;
			}
		}
	}
	
	// Calculate the height and width of the content
	let trimHeight = bound.bottom - bound.top,
		trimWidth = bound.right - bound.left,
		trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

	copy.canvas.width = trimWidth;
	copy.canvas.height = trimHeight;
	copy.putImageData(trimmed, 0, 0);

	// Return trimmed canvas
	return copy.canvas;
}