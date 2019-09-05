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
    if ( !isInt( xOffset ) ) return next( error( 400, 'No xOffset paramerer' ) )
    if ( !isInt( yOffset ) ) return next( error( 400, 'No yOffset paramerer' ) )  

    const resultImage = await facade.move(urlTL, urlTR, urlBR, urlBL, parseInt(xOffset), parseInt(yOffset))

    makeResponseFrom(resultImage, res)
})




app.post( '/overlay', async ( req, res, next ) => {

    const backgroundUrl = req.body.backgroundUrl
    const overlayUrl = req.body.overlayUrl

    if ( !backgroundUrl ) return next( error( 400, 'No backgroundUrl paramerer' ) )
    if ( !overlayUrl ) return next( error( 400, 'No overlayUrl paramerer' ) )
    
    //const backgroundUrl = 'https://1.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/10/619/318/256/png8?app_id=xWVIueSv6JL0aJ5xqTxb&app_code=djPZyynKsbTjIUDOBcHZ2g&lg=rus&ppi=72&pview=RUS'
    //const overlayUrl = 'http://tiles.traffic.cit.api.here.com/traffic/6.0/tiles/10/619/318/256/png8?app_id=xWVIueSv6JL0aJ5xqTxb&app_code=djPZyynKsbTjIUDOBcHZ2g'

    const resultImage = await facade.overlay(backgroundUrl, overlayUrl)

    makeResponseFrom(resultImage, res)

})


app.post( '/move_and_overlay', async ( req, res, next ) => {

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
    if ( !isInt( xOffset ) ) return next( error( 400, 'No xOffset paramerer' ) )
    if ( !isInt( yOffset ) ) return next( error( 400, 'No yOffset paramerer' ) )  
    if ( !overlayUrl ) return next( error( 400, 'No overlayUrl paramerer' ) )
    
    
    const moverBackgroundImage = await facade.move(urlTL, urlTR, urlBR, urlBL, parseInt(xOffset), parseInt(yOffset))

    const resultImage = await facade.overlayBuffer(moverBackgroundImage, overlayUrl)

    makeResponseFrom(resultImage, res)

})




app.get( '/opacity', async ( req, res, next ) => {

    const url = 'https://cdn.iconscout.com/icon/free/png-256/nodejs-6-569582.png'
    const value = 50

    const resultImage = await facade.addOpacity(url, value)

    makeResponseFrom(resultImage, res)

})







function makeResponseFrom(buffer, res) {
    
    res.writeHead( 200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length
    })
    
    res.end(buffer)
}


function isInt( value ) {
  var x = parseFloat( value )
  return !isNaN( value ) && ( x | 0 ) === x
}


function error( status, msg ) {
  var err = new Error( msg )
  err.status = status
  return err
}
