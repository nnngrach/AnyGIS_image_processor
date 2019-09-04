const sharp = require('sharp');


module.exports.testFilter = function testFilter(imageBuffer) {
	
	let result = sharp(imageBuffer)
		.resize(900, 900)
		.toBuffer()

  	return result  
}


