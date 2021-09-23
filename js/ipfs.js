class IpfsNode { // Singleton
	#node
	#nodePromise
	
	constructor() {
		this.#createNode()
	}
	
	getCidsFromDirectory(directoryCid) {
		return this.#nodePromise.
			then(_ => this.#get(directoryCid)).
			then(content => content.split('\n'))
	}
	
	getBuffer(cid) {
		return this.#nodePromise.
			then(_ => this.#node.cat(cid))
	}

	async #createNode() {
		this.#nodePromise = Ipfs.create()
		this.#node = await this.#nodePromise
	}

	async #get(cid) {
		const stream = await this.#nodePromise.
			then(_ => this.#node.cat(cid))
		
		let data = ''
		for await (const chunk of stream) {
			data += chunk.toString()
		}
	
		return data
	}
}