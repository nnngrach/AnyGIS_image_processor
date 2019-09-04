const axios = require('axios')


module.exports.getContent = async function getContent(url) {

	const response = await axios.get(url, {responseType: 'arraybuffer'})
	const buffer = Buffer.from( response.data, 'base64' )
	return buffer
}
