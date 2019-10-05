const sharp = require('sharp');
var Jimp = require('jimp');


module.exports.move = async function move(imgTL, imgTR, imgBR, imgBL, xOffset, yOffset) {
	
	// Sharp makes errors with 0px offset value

	if (xOffset == 0 && yOffset == 0) {
		return imgTL

	} else if (xOffset == 0) {
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
	    background: { r: 0, g: 0, b: 0, alpha: 0.0 }
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
	    background: { r: 0, g: 0, b: 0, alpha: 0.0 }
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
	    background: { r: 0, g: 0, b: 0, alpha: 0.0 }
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




module.exports.overlayScreen = async function overlayScreen(bufferBackground, bufferOverlay) {

	const backgroundDark = await brightness(bufferBackground, 0.5)
	const overlayDark = await brightness(bufferOverlay, 0.5)

	const combinedImage = await sharp(backgroundDark)	
	.composite([{ input: overlayDark, gravity: 'centre', blend: 'add' }])
	.toBuffer()	

	const tweakedImage = await contrast(combinedImage, 0.1)
	
	return await tweakedImage 
}



async function brightness(imageBuffer, value) {
	return await sharp(imageBuffer)	
	.modulate({brightness: value})
	.toBuffer()
}


async function contrast(imageBuffer, value) {

	return Jimp.read(imageBuffer)
	  .then(image => {
	    image.contrast( value );
	    return image.getBufferAsync(Jimp.MIME_PNG);
	  })
}


async function opacity(imageBuffer, value) {

	return Jimp.read(imageBuffer)
	  .then(image => {
	    image.opacity( value );
	    return image.getBufferAsync(Jimp.MIME_PNG);
	  })
}





module.exports.opacity = opacity





module.exports.writeText = async function writeText(message, isWhite) {

	const fileName = './App/Resources/osm_tile_grid.png'

	var loadedImage
	var font

	if (isWhite == 'true') {
		font = Jimp.FONT_SANS_16_WHITE
	} else {
		font = Jimp.FONT_SANS_16_BLACK
	}

	

	return Jimp.read(fileName)
	    .then(function (image) {
	        loadedImage = image;
	        return Jimp.loadFont(font)
	    })
	    .then(function (font) {
	        loadedImage.print(
	        	font, 
	        	0, 
	        	0, 
	        	{
      				text: message,
      				alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      				alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    			},
    			256,
    			256
    			)
	        return loadedImage.getBufferAsync(Jimp.MIME_PNG)
	    })
	    .catch(function (err) {
	        console.error(err)
	    })
}
