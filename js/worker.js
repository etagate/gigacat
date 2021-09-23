importScripts('https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js')
importScripts('https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.7.2/dist/flexsearch.bundle.js')
importScripts('bundle.js')
importScripts('ipfs.js')
importScripts('database.js')

const parse = require('csv-parse')

/* Worker */

onmessage = function(e) {
	let message = e.data
	switch (message[0]) { // command
	case 'list_cid':
		let listCid = message[1]
		cids = [listCid]
		createDatabaseFromList(listCid)
		break
	case 'dir_cid':
		let directoryCid = message[1]
		createDatabaseFromDirectory(directoryCid)
		break
	case 'search':
		search(e.data[1], e.data[2])
		break
	case 'search_all':
		const indexes = []
		for (let i = 0; i < cids.length; i++) indexes.push(i)
		search(e.data[1], indexes)
		break
	default:
		console.log('error: unknown message')
	}
}

/* DB */

const IpfsNodeInstance = new IpfsNode()
Object.freeze(IpfsNodeInstance)


let cids
async function createDatabaseFromDirectory(cid) {
	cids = await IpfsNodeInstance.getCidsFromDirectory(cid)

	await Promise.all(cids.map(cid => {
		createDatabaseFromList(cid)
	}))
}

const dbs = []
async function createDatabaseFromList(cid) {
	const len = dbs.push(new Database(cid))
	const db = dbs[len-1]
	
	postMessage(['status', 'List downloading'])
	const stream = await IpfsNodeInstance.getBuffer(cid)

	postMessage(['status', 'Populating database'])
	await db.populateFromStream(stream).
		then(async _ => {
			postMessage(['status', 'Completed'])
			postMessage(['dbinfo', await db.size(), await db.lines()])
		})
}

async function search(input, databases) {
	const results = []

	await Promise.all(databases.map(async i => {
		let db = dbs[i]
		await db.search(input).
			then(response => response.forEach(e => results.push(e))).
			then(_ => postMessage(['result', results]))
	}))

	return results
}