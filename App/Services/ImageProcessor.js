const sharp = require('sharp');


module.exports.move = async function move(imgTL, imgTR, imgBR, imgBL, xOffset, yOffset) {
	
	// Sharp makes errors with 0px with or height

	if (xOffset == 0) {
		return moveVerticaly(imgTL, imgBL, yOffset)
	} else if (yOffset == 0) {
		return moveHorizontaly(imgTL, imgTR, xOffset)
	} else {
		return move(imgTL, imgTR, imgBR, imgBL, xOffset, yOffset)
	}
}




async function moveVerticaly(imgTop, imageBottom, yOffset) {

	const topImage = await sharp(imgTop)
		.png()
		.extract({ left: 0, top: yOffset, width: 256, height: 256 - yOffset })
		.toBuffer()	

	const bottomImage = await sharp(imageBottom)
		.png()
		.extract({ left: 0, top: 0, width: 256, height: yOffset })
		.toBuffer()	
		
	
	const resultImage = await sharp({
	  create: {
	    width: 256,
	    height: 256,
	    channels: 4,
	    background: { r: 0, g: 0, b: 0, alpha: 0.9 }
	  }
	})	
	.png()
	.composite([{ input: topImage, gravity: 'north' }])
	.toBuffer()		

	const resultImage2 = await sharp(resultImage)	
	.composite([{ input: bottomImage, gravity: 'south' }])
	.toBuffer()	

	return await resultImage2
}




async function moveHorizontaly(imgLeft, imageRight, xOffset) {

	const leftImage = await sharp(imgLeft)
		.png()
		.extract({ left: xOffset, top: 0, width: 256 - xOffset, height: 256 })
		.toBuffer()	

	const rightImage = await sharp(imageRight)
		.png()
		.extract({ left: 0, top: 0, width: xOffset, height: 256 })
		.toBuffer()	
		
	
	const resultImage = await sharp({
	  create: {
	    width: 256,
	    height: 256,
	    channels: 4,
	    background: { r: 0, g: 0, b: 0, alpha: 0.9 }
	  }
	})	
	.png()
	.composite([{ input: top, gravity: 'west' }])
	.toBuffer()		

	const resultImage2 = await sharp(resultImage)	
	.composite([{ input: bottom, gravity: 'east' }])
	.toBuffer()	

	return await resultImage2
}




async function move(imgTL, imgTR, imgBR, imgBL, xOffset, yOffset) {

	const tL = await sharp(imgTL)
		.png()
		.extract({ left: xOffset, top: xOffset, width: 256 - xOffset, height: 256 - yOffset })
		.toBuffer()

	const tR = await sharp(imgTR)
		.png()
		.extract({ left: 0, top: xOffset, width: xOffset, height: 256 - yOffset })
		.toBuffer()	

	const bR = await sharp(imgBR)
		.png()
		.extract({ left: 0, top: 0, width: xOffset, height: yOffset })
		.toBuffer()	

	const bL = await sharp(imgBL)
		.png()
		.extract({ left: xOffset, top: 0, width: 256 - xOffset, height: yOffset })
		.toBuffer()	
		
	
	const resultImage = await sharp({
	  create: {
	    width: 256,
	    height: 256,
	    channels: 4,
	    background: { r: 0, g: 0, b: 0, alpha: 0.9 }
	  }
	})	
	.png()
	.composite([{ input: tL, gravity: 'northwest' }])
	.toBuffer()		

	const resultImage2 = await sharp(resultImage)	
	.composite([{ input: tR, gravity: 'northeast' }])
	.toBuffer()	

	const resultImage3 = await sharp(resultImage2)	
	.composite([{ input: bR, gravity: 'southeast' }])
	.toBuffer()	

	const resultImage4 = await sharp(resultImage3)	
	.composite([{ input: bL, gravity: 'southwest' }])
	.toBuffer()
	
	return await resultImage4
}





module.exports.overlay = async function overlay(bufferBackground, bufferOverlay) {

	const resultImage = await sharp(bufferBackground)	
	.composite([{ input: bufferOverlay, gravity: 'centre' }])
	.toBuffer()	

	return await resultImage 
}



// not working

module.exports.opacity = async function opacity(imageBuffer, value) {

	//meta = await imageBuffer.metadata(); 


	img = await imageBuffer.joinChannel(Buffer.alloc(200 * 200, 255), {
		raw: {
			width: 200,
			height: 200,
			channels: 1
		}
	})
	.toBuffer()

	return img 
}




module.exports.testFilter = function testFilter(imageBuffer) {
	
	let result = sharp(imageBuffer)
		.resize(900, 900)
		.toBuffer()

  	return result  
}


