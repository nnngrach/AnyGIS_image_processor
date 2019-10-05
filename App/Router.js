const express = require( 'express' )
var bodyParser = require('body-parser')

const facade = require('./Facade')

const webHandler = require('./Services/WebHandler')
const cacheHandler = require('./Services/CacheHandler')
const imageProcessor = require('./Services/ImageProcessor')

const PORT = process.env.PORT || 5000
const app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



app.listen( PORT, () => {
    console.log( 'Listening on port ', PORT )
})


app.get( '/', async ( req, res, next ) => {
    res.writeHead( 200, {'Content-Type': 'text/plain'})
    res.end( 'AnyGIS Image Processor' )
})


app.post( '/move', async ( req, res, next ) => {

    const urlTL = req.body.urlTL
    const urlTR = req.body.urlTR
    const urlBR = req.body.urlBR
    const urlBL = req.body.urlBL
    const xOffset = req.body.xOffset
    const yOffset = req.body.yOffset


    if ( !urlTL ) return next( error( 400, 'No urlTL paramerer' ) )
    if ( !urlTR ) return next( error( 400, 'No urlTR paramerer' ) )
    if ( !urlBR ) return next( error( 400, 'No urlBR paramerer' ) )
    if ( !urlBL ) return next( error( 400, 'No urlBL paramerer' ) )
    if ( !isNumber( xOffset ) ) return next( error( 400, 'No xOffset paramerer' ) )
    if ( !isNumber( yOffset ) ) return next( error( 400, 'No yOffset paramerer' ) )

    const resultImage = await facade.move(urlTL, urlTR, urlBR, urlBL, parseInt(xOffset), parseInt(yOffset))
    
    makeResponseFrom(resultImage, res, next)
 
})


app.post( '/overlay', async ( req, res, next ) => {

    const backgroundUrl = req.body.backgroundUrl
    const overlayUrl = req.body.overlayUrl

    if ( !backgroundUrl ) return next( error( 400, 'No backgroundUrl paramerer' ) )
    if ( !overlayUrl ) return next( error( 400, 'No overlayUrl paramerer' ) )
    
    const resultImage = await facade.overlay(backgroundUrl, overlayUrl)

    makeResponseFrom(resultImage, res, next)

})



app.post( '/addictive_overlay', async ( req, res, next ) => {

    const backgroundUrl = req.body.backgroundUrl
    const overlayUrl = req.body.overlayUrl

    if ( !backgroundUrl ) return next( error( 400, 'No backgroundUrl paramerer' ) )
    if ( !overlayUrl ) return next( error( 400, 'No overlayUrl paramerer' ) )

    const resultImage = await facade.overlayScreen(backgroundUrl, overlayUrl)

    makeResponseFrom(resultImage, res, next)

})



app.post( '/move_background_and_overlay', async ( req, res, next ) => {

    const urlTL = req.body.urlTL
    const urlTR = req.body.urlTR
    const urlBR = req.body.urlBR
    const urlBL = req.body.urlBL
    const xOffset = req.body.xOffset
    const yOffset = req.body.yOffset
    const overlayUrl = req.body.overlayUrl

    if ( !urlTL ) return next( error( 400, 'No urlTL paramerer' ) )
    if ( !urlTR ) return next( error( 400, 'No urlTR paramerer' ) )
    if ( !urlBR ) return next( error( 400, 'No urlBR paramerer' ) )
    if ( !urlBL ) return next( error( 400, 'No urlBL paramerer' ) )
    if ( !isNumber( xOffset ) ) return next( error( 400, 'No xOffset paramerer' ) )
    if ( !isNumber( yOffset ) ) return next( error( 400, 'No yOffset paramerer' ) )  
    if ( !overlayUrl ) return next( error( 400, 'No overlayUrl paramerer' ) )
     
    const movedBackgroundImage = await facade.move(urlTL, urlTR, urlBR, urlBL, parseInt(xOffset), parseInt(yOffset))
    const resultImage = await facade.overlayBuffer(movedBackgroundImage, overlayUrl)

    makeResponseFrom(resultImage, res, next)
})



app.post( '/opacity/', async ( req, res, next ) => {

    const url = req.body.url
    const value = req.body.value
    if ( !url ) return next( error( 400, 'No url paramerer' ) )
    if ( !value ) return next( error( 400, 'No value paramerer' ) )

    const resultImage = await facade.addOpacity(url, parseFloat(value))
 
    makeResponseFrom(resultImage, res, next)
})



app.post( '/text/', async ( req, res, next ) => {

    const message = req.body.message
    const isWhite = req.body.isWhite
    if ( !message ) return next( error( 400, 'No message paramerer' ) )
    if ( !isWhite ) return next( error( 400, 'No isWhite paramerer' ) )

    const resultImage = await facade.writeText(message, isWhite)

    makeResponseFrom(resultImage, res, next)
})



// Supporting functions:

function makeResponseFrom(result, res, next) {

    if (result.isError) {

        return next( error( 500, 'Error with downloading tile' ) )

    } else {

        const imageBuffer = result.data

        res.writeHead( 200, {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length
        })
    
        return res.end(imageBuffer)
    }    
}




function isNumber( value ) {
  var x = parseFloat( value )
  return !isNaN( value ) && ( x | 0 ) === x
}


function error( status, msg ) {
  var err = new Error( msg )
  err.status = status
  return err
}
