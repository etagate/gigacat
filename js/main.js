window.addEventListener('DOMContentLoaded', () => {
	loadDOMVariables()
	startWorker()
})

/* Worker */

let worker = new Worker('js/worker.js')

worker.onmessage = function(e) {
	let message = e.data
	switch (message[0]) {
	case 'dbinfo':
		displayDbInfo(message[1], message[2])
		break
	case 'status':
		if (message[1] === 'Completed') {
			loadFinish()
			return
		}
		setTimeout(() => {
			searchBox.placeholder = message[1]
		}, 1000)
		break
	case 'result':
		displayResults(message[1])
		break
	default:
		console.log('error')
	}
}

function startWorker() {
	const message = getCidParams()
	if (message.length === 0) {
		message.push('list_cid', 'QmZjTdTfjuMtc8wxDLwL9YEn2TueAMvv3stjj5ZBDkX8oX')
	} else {
		displayBanner(message)
		hideForCustom()
	}
	worker.postMessage(message)
}

function getCidParams() {
	const params = []
	
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	if (urlParams.has('list') || urlParams.has('dir')) {
		if (urlParams.has('list')) {
			params.push('list_cid', urlParams.get('list'))
		} else if (urlParams.has('dir')) {
			params.push('dir_cid', urlParams.get('dir'))
		}
	}

	return params
}

/* DOM */

let searchBox
let searchButton

function loadDOMVariables() {
	searchBox = document.querySelector('#search-box')
	searchBox.addEventListener('keyup', checkIfEnter)
	searchBox.placeholder = 'Building IPFS node'

	searchButton = document.querySelector('#search-button')
	searchButton.addEventListener('click', search)

	startLoadingAnimation()
}

function search() {
	let input = searchBox.value

	if (getCidParams().length === 0) { // Default
		let dbList = []
		let id = 0
		document.querySelectorAll('.def-check').forEach(element => {
			if (element.checked) {
				dbList.push(id)
			}
			id += 1
		})
		worker.postMessage(['search', input, dbList])
	} else { // Custom cid
		worker.postMessage(['search_all', input])
	}
}

function checkIfEnter(e) {
	let key = e.key | e.keyCode
	if (key === 13) { // Enter
		search()
	}
}