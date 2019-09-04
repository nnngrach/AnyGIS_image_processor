const express = require( 'express' )


// Запуск сервера
const PORT = process.env.PORT || 5000
const app = express()

app.listen( PORT, () => {
  console.log( 'Listening on port ', PORT )
})


app.get( '/', async ( req, res, next ) => {
  res.writeHead( 200, {'Content-Type': 'text/plain'})
  res.end( 'AnyGIS Image Processor' )
})






/*

// Основной метод Mapshooter
app.get( '/:mode/:x/:y/:z/:minZ', async ( req, res, next ) => {

  const x = req.params.x
  const y = req.params.y
  const z = req.params.z
  const minZ = req.params.minZ
  const scriptName = req.query.script

  var moduleName, defaultUrl, maxZ, params, jsonResult, imageBuffer

  if ( !isInt( x )) return next( error( 400, 'X must must be Intager' ))
  if ( !isInt( y )) return next( error( 400, 'Y must must be Intager' ))
  if ( !isInt( z )) return next( error( 400, 'Z must must be Intager' ))
  if ( !isInt( minZ )) return next( error( 400, 'MinimalZoom must must be Intager' ))
  if ( !scriptName ) return next( error( 400, 'No script paramerer' ) )

  // Выбираем режим обработки карты
  switch ( req.params.mode ) {

    case 'overpass':
      maxZ = 18
      patchToModule = '../Modes/Overpass'
      params = { x: x, y: y, z: z, minZ: minZ, maxZ: maxZ, scriptName: scriptName, patchToModule: patchToModule}
      jsonResult = await workersPool.exec(params)
      sendResponse(jsonResult, res)
      break

    case 'nakarte':
      maxZ = 18
      patchToModule = '../Modes/Nakarte'
      params = { x: x, y: y, z: z, minZ: minZ, maxZ: maxZ, scriptName: scriptName, patchToModule: patchToModule}
      jsonResult = await workersPool.exec(params)
      sendResponse(jsonResult, res)
      break

    case 'waze':
      maxZ = 18
      patchToModule = '../Modes/Waze'
      params = { x: x, y: y, z: z, minZ: minZ, maxZ: maxZ, scriptName: scriptName, patchToModule: patchToModule}
      jsonResult = await workersPool.exec(params)
      sendResponse(jsonResult, res)
      break

    case 'yandex':
      maxZ = 18
      patchToModule = '../Modes/Yandex'
      params = { x: x, y: y, z: z, minZ: minZ, maxZ: maxZ, scriptName: scriptName, patchToModule: patchToModule}
      jsonResult = await workersPool.exec(params)
      sendResponse(jsonResult, res)
      break

    default:
      next( error( 400, 'Unknown mode value' ) )
      break
  }
})



// Вспомогательные функции

function sendResponse(jsonResult, res) {
    switch ( jsonResult.status ) {

      case 'Screenshot':
        imageBuffer = Buffer.from( jsonResult.value, 'base64' )
        res.writeHead( 200, {
          'Content-Type': 'image/png',
          'Content-Length': imageBuffer.length
        })
        res.end( imageBuffer )
        break

      case 'Redirect':
        res.redirect(jsonResult.value)
        break

      case 'Error':
        res.writeHead( 200, {'Content-Type': 'text/plain'})
        res.end( jsonResult.value )
        break

      default:
        next( error( 501, 'Unknown jsonResult status' ) )
        break
      }
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

*/
