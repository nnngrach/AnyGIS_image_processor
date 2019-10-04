const webHandler = require('./Services/WebHandler')
const cacheNamer = require('./Services/CacheNamer')
const cacheHandler = require('./Services/CacheHandler')
const imageProcessor = require('./Services/ImageProcessor')


module.exports.move = async function move(urlTL, urlTR, urlBR, urlBL, xOffset, yOffset) {
	const imgTL = await load(urlTL)
	const imgTR = await load(urlTR)
	const imgBR = await load(urlBR)
	const imgBL = await load(urlBL)

	if (imgTL.isError || imgTR.isError || imgBR.isError || imgBL.isError) {
		return {isError: true, data: ""}
	}

	const processedImage = await imageProcessor.move(imgTL.data, 
													imgTR.data, 
													imgBR.data, 
													imgBL.data, 
													xOffset, 
													yOffset)
	return {isError: false, data: processedImage} 
}


module.exports.overlay = async function overlay(urlBackground, urlOverlay) {

	const bufferBackground = await load(urlBackground)
	const bufferOverlay = await load(urlOverlay)

	if (bufferBackground.isError || bufferOverlay.isError) {
		return {isError: true, data: ""}
	}

	const processedImage = await imageProcessor.overlay(bufferBackground.data, bufferOverlay.data)
	return {isError: false, data: processedImage}
}


module.exports.overlayBuffer = async function overlayBuffer(bufferBackground, urlOverlay) {
	
	const bufferOverlay = await load(urlOverlay)

	if (bufferOverlay.isError) {
		return {isError: true, data: ""}
	}

	const processedImage = await imageProcessor.overlay(bufferBackground.data, bufferOverlay.data)
	return {isError: false, data: processedImage}
}


module.exports.addOpacity = async function addOpacity(url, opacity) {
	
	const imageBuffer = await load(url)

	if (imageBuffer.isError) {
		return {isError: true, data: ""}
	}

	const processedImage = await imageProcessor.opacity(imageBuffer.data, opacity)
	return {isError: false, data: processedImage}
}



module.exports.writeText = async function writeText(message, isWhite) {

	const processedImage = await imageProcessor.writeText(message, isWhite)
	return {isError: false, data: processedImage}
}




async function load(url) {

	const cacheName = cacheNamer.convert(url)

	const cachedObject = await cacheHandler.load(cacheName)
	
	
	if (cachedObject.isError != true) {

		return cachedObject.data

	} else {

		const downloadedObject = await webHandler.getContent(url)

		if (downloadedObject.isError != true) {

			await cacheHandler.save(cacheName, downloadedObject)
			return downloadedObject
			
		} else {

			return {isError: true, data: ""}
		}	
	}
}
