class Database {
	#cid
	#database
	#id = 0
	#index
	#parser
	#promise
	#promiseArray
	#sizeInMB = 0

	constructor(cid) {
		this.#cid = cid
		this.#database = []
		this.#index = new FlexSearch.Worker({
			preset: "performance",
			tokenize: "forward"
		})
		this.#promiseArray = []
		this.#loadParser()
	}

	async populateFromStream(stream) {
		for await (const chunk of stream) {
			let seq = chunk.toString()
			this.#sizeInMB += seq.length
			this.#parser.write(seq)
		}
		this.#parser.end()
		this.#promise = Promise.all(this.#promiseArray)
	}

	async lines() {
		await this.#promise
		return this.#database.length
	}

	async size() {
		await this.#promise
		return this.#sizeInMB
	}

	cid() {
		return this.#cid
	}

	async search(input) {
		await this.#promise

		const results = []
		await this.#index.search(input).
			then(array => array.forEach(i => {
				results.push(this.#database[i])
			}))

		return results
	}

	#loadParser() {
		this.#parser = parse({
			delimiter: ','
		})

		let that = this

		this.#parser.on('readable', async function() {
			let record
			while (record = that.#parser.read()) {
				that.#database.push(record)
				that.#promiseArray.push(that.#index.add(that.#id, record[0]))
				that.#id += 1
			}
		})

		this.#parser.on('error', function(err) {
			console.error(err.message)
		})

		this.#parser.on('end', function() {
			//
		})
	}
}