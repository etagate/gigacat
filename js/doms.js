/* Animations */

let loadingAnimation
const dots = ['', '.', '..', '...', '....', '.....']
let dotsId = 0

function startLoadingAnimation() {
	document.querySelector('#progress-bar').style.display = 'flex'
	loadingAnimation = setInterval(() => {
		if (dotsId === dots.length) {
			dotsId = 0
		}
		searchBox.placeholder = searchBox.placeholder.split('.')[0] + dots[dotsId]
		dotsId += 1
	}, 150)
	searchBox.disabled = true
	searchButton.disabled = true
	searchBox.value = ''
}

function endLoadingAnimation() {
	document.querySelector('#progress-bar').style.display = 'none'
	document.querySelector('#progress-space').style.display = 'none'
	clearInterval(loadingAnimation)
}

function loadFinish() {
	searchBox.placeholder = 'Search something'
	searchBox.disabled = false
	searchButton.disabled = false
	endLoadingAnimation()
}

function hideForCustom() {
	document.querySelectorAll('.to-hide-on-custom').forEach(element => {
		element.style.display = 'none'
	})
}

/* Info */

function displayBanner(message) {
	document.querySelector('#custom-cid').style.display = 'flex'
	document.querySelectorAll('.def-check').forEach(element => {
		element.checked = false
		element.disabled = true
	})
	document.querySelector('#list-or-dir').innerText = (message[0] === 'list_cid') ? 'List: ' : 'Directory: '
	document.querySelector('#display-cid').innerText = message[1]
	document.querySelector('#remove-custom-cid').addEventListener('click', () =>
		(setTimeout(() => (window.location = window.location.pathname), 500)))
}

function displayDbInfo(size, lines) {
	document.querySelector('#dump-info').innerText = '' + (size / 1024 / 1024).toFixed(1) + 'MB, ' + lines + ' lines'
}

/* Table */

function displayResults(results) {
	let tbody = document.querySelector('#tbody')

	while(tbody.rows.length) {
		tbody.deleteRow(0)
	}

	results.forEach(r => {
		tbody.appendChild(createRow(r))
	})
}

function createRow(r) {
	let tr = document.createElement('tr')

	let tdTitle = document.createElement('td')
	tdTitle.innerText = r[0]
	tr.appendChild(tdTitle)

	let tdSize = document.createElement('td')
	tdSize.innerText = '' + (+(r[1]) / 1024 / 1024).toFixed(2) + ' GB'
	tr.appendChild(tdSize)
	
	let tdFormat = document.createElement('td')
	tdFormat.innerText = r[2]
	tr.appendChild(tdFormat)

	let tdCategory = document.createElement('td')
	tdCategory.innerText = map.get(r[3])
	tr.appendChild(tdCategory)

	let tdImg = document.createElement('td')
	let a = document.createElement('a')
	a.href = r[4]
	let img = document.createElement('img')
	img.src = 'img/magnet.png'
	img.style.width = '26px'
	img.alt = 'magnet link'
	a.appendChild(img)
	tdImg.appendChild(a)
	tr.appendChild(tdImg)

	return tr
}

const map = new Map()
map.set('7',  'Anime')
map.set('34', 'Book')
map.set('8',  'Cartoon')
map.set('30', 'Comics')
map.set('14', 'Documentary')
map.set('3',  'Ebook')
map.set('4',  'Film')
map.set('36', 'Kiosk')
map.set('6',  'Linux')
map.set('2',  'Music')
map.set('9',  'Macintosh')
map.set('25', 'Misc')
map.set('37', 'Mobile')
map.set('21', 'Music videos')
map.set('32', 'Nintendo')
map.set('28', 'Other Game')
map.set('11', 'Pc Game')
map.set('12', 'Playstation')
map.set('35', 'Podcast')
map.set('13', 'Students Releases')
map.set('22', 'Sport')
map.set('23', 'Theater')
map.set('31', 'Trash')
map.set('1',  'TV Film')
map.set('29', 'TV Series')
map.set('27', 'Wallpaper')
map.set('10', 'Windows Software')
map.set('24', 'Wrestling')
map.set('26', 'Xbox')