const webHandler = require('./Services/WebHandler')
const cacheNamer = require('./Services/CacheNamer')
const cacheHandler = require('./Services/CacheHandler')
const imageProcessor = require('./Services/ImageProcessor')
const imageProcessor2 = require('./Services/ImageProcessor2')


// work

module.exports.move = async function move(urlTL, urlTR, urlBR, urlBL, xOffset, yOffset) {
	const imgTL = await load(urlTL)
	const imgTR = await load(urlTR)
	const imgBR = await load(urlBR)
	const imgBL = await load(urlBL)

	const processedImage = await imageProcessor.move(imgTL, imgTR, imgBR, imgBL, xOffset, yOffset)
	return processedImage
}


// not work

module.exports.overlay = async function overlay(urlBackground, urlOverlay) {

	const bufferBackground = await load(urlBackground)
	const bufferOverlay = await load(urlOverlay)

	const processedImage = imageProcessor.overlay(bufferBackground, bufferOverlay)

	return processedImage
}


module.exports.overlayBuffer = async function overlayBuffer(bufferBackground, urlOverlay) {
	
	const bufferOverlay = await load(urlOverlay)

	const processedImage = imageProcessor.overlay(bufferBackground, bufferOverlay)

	return processedImage
}



module.exports.addOpacity = async function addOpacity(url, opacity) {
	const imageBuffer = await load(url)
	const processedImage = imageProcessor.opacity(imageBuffer, opacity)

	return processedImage
}











module.exports.writeText = async function writeText(text) {

}


// work

async function load(url) {

	const cacheName = cacheNamer.convert(url)

	var loadedObject = await cacheHandler.load(cacheName)
	
	if (loadedObject.isError == true) {

		const buffer = await webHandler.getContent(url)
		loadedObject = await {isError: false, data: buffer}
		await cacheHandler.save(cacheName, buffer)
	}

	return loadedObject.data
}


// module.exports.test = async function test(url) {
// 	return cacheNamer.convert(url)
// }