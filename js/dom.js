const worker = new Worker('js/worker.js')
worker.postMessage(['start'])
worker.onmessage = function(e) {
	switch (e.data[0]) {
		case 'result':
			showResult(e.data[1])
			break
		case 'progress':
			showProgress(e.data[1])
			break
		default:
			console.log('unrecognized command', e.data[0])
	}
}

$('#searchBoxForm').submit(function(e) {
	return false
})

$('#searchButton').click(function(e) {
	worker.postMessage(['search', $('#searchBox').val()])
})

$('#searchBox').keypress(function(e) {
	if (e.which === 13) {
		worker.postMessage(['search', $('#searchBox').val()])
	}
})

function showResult(result) {
	$('#resultTable tbody').empty()

	result.forEach(row => {
		let rowHTML = ''
		rowHTML += '<tr>'
		// rowHTML += '<th scope="row">' + row[2] + '</th>'
		rowHTML += '<td>' + row[2] + '</td>'
		rowHTML += '<td>' + (row[3] / 1024 / 1024 / 1024).toFixed(2) + ' GB</td>'
		rowHTML += '<td> / </td>'
		rowHTML += '<td>' + map.get(row[4]) + '</td>'
		rowHTML += '<td><a href="magnet:?xt=urn:btih:' + row[1] + '"><img src="img/magnet.png" style="width: 26px;" alt="magnet link"></a></td>'
		rowHTML += '</tr>'
		$('#resultTable tbody').append(rowHTML)
	})
}

function showProgress(percent) {
	$('#searchBox').attr('placeholder', 'Downloading database: ' + '' + percent + '%');
	$('#progressBar').width('' + percent + '%')

	if (percent == '100') {
		$('#progressDiv').css({"visibility": "hidden"})
		$('#searchBox').attr('placeholder', 'Search something');
	}
}

const map = new Map()
map.set(7,  'Anime')
map.set(34, 'Book')
map.set(8,  'Cartoon')
map.set(30, 'Comics')
map.set(14, 'Documentary')
map.set(3,  'Ebook')
map.set(4,  'Film')
map.set(36, 'Kiosk')
map.set(6,  'Linux')
map.set(2,  'Music')
map.set(9,  'Macintosh')
map.set(25, 'Misc')
map.set(37, 'Mobile')
map.set(21, 'Music videos')
map.set(32, 'Nintendo')
map.set(28, 'Other Game')
map.set(11, 'Pc Game')
map.set(12, 'Playstation')
map.set(35, 'Podcast')
map.set(13, 'Students Releases')
map.set(22, 'Sport')
map.set(23, 'Theater')
map.set(31, 'Trash')
map.set(1,  'TV Film')
map.set(29, 'TV Series')
map.set(27, 'Wallpaper')
map.set(10, 'Windows Software')
map.set(24, 'Wrestling')
map.set(26, 'Xbox')