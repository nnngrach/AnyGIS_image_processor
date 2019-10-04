const axios = require('axios')


module.exports.getContent = async function getContent(url) {

	return await axios
		.get(url, {responseType: 'arraybuffer'})

		// handle success
		.then(function (response) {
			const buffer = Buffer.from( response.data, 'base64' )
			return { isError: false, data: buffer}
		})

		// handle error
		.catch(function (error) {		
			//console.log(error)
			console.log('Download error - ', url)
			return { isError: true, data: ""}
		})
		
		// always executed
		.finally(function () {
			// nothing yet
		})
	
}
