importScripts('https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js')
importScripts('https://cdn.jsdelivr.net/npm/sql.js@1.6.2/dist/sql-wasm.min.js')


onmessage = function(e) {
	switch (e.data[0]) {
		case 'start':
			start()
			break
		case 'search':
			search(e.data[1]).then(result => postMessage(['result', result]))
			break
		default:
			console.log('unrecognized command', e.data[0])
	}
}

function start() { /* do nothing */ }

let dbPromise = new Promise(async (resolve, reject) => {
	try {
		const [SQL, buffer] = await Promise.all([loadDbModule(), fetchDbFromIPFS()])
		const database = new SQL.Database(buffer)
		resolve(database)
	} catch(e) {
		reject(e)
	}
})

// let dbPromise
// async function start() {
// 	try {
// 		const [SQL, buffer] = await Promise.all([loadDbModule(), fetchDbFromIPFS()])
// 		dbPromise = new Promise((resolve, reject) => {
// 			const database = new SQL.Database(buffer)
// 			resolve(database)
// 		})
// 	} catch(e) {
// 		console.error('error while loading essential modules:', e)
// 		return
// 	}
// }

function loadDbModule() {
	return initSqlJs({
		locateFile: file => 'https://cdn.jsdelivr.net/npm/sql.js@1.6.2/dist/sql-wasm.wasm'
	})
}

async function fetchDbFromIPFS() {
	const node = await Ipfs.create()
	const stream = await node.cat('Qmd3ecxQSndUdBA1rS3HG62ZCR2f8L8ybneFS95WNJJroa')

	const data = new Uint8Array(12152832)
	let i = 0
	for await (const chunk of stream) {
		chunk.forEach(byte => {
			data[i] = byte
			i += 1
		})
		postMessage(['progress', ((i / 12152832) * 100).toFixed(0)])
	}

	return data
}

async function search(input) {
	input = input.trim()
	return await dbPromise.
		then(db => {
			const result1 = db.exec(
				'SELECT rowid, * \
				FROM torrents \
				WHERE title LIKE \'' + input + '%\' LIMIT 20')
			
			const result2 = db.exec(
				'SELECT rowid, * \
				FROM torrents \
				WHERE title LIKE \'% ' + input + '%\' LIMIT 20')
			
			let result = []
			if (result1.length > 0) {
				result = [...result, ...result1[0].values]
			}
			if (result2.length > 0) {
				result = [...result, ...result2[0].values]
			}
			return result
		}, reason => {
			console.log('error during the boot process:', reason)
		})
}