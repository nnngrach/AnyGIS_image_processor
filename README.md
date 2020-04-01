# AnyGIS_image_processor

Service for tile image processing

### Installation

`docker run --name tileimageprocessor --rm -p 3000:5000 -d nnngrach/tileimageprocessor`


### API


Add opacity for tile image

`POST http://localhost:3000/opacity
parameters:
"url" - URL of downloading tile
"value" - Opacity value from 0 to 1
`


Add text for tile image

`POST http://localhost:3000/text
parameters:
"message" - Text for printing in tile
"isWhite" - 1 for white text. 0 for black
`


Overlay tile A to tile B (default mode):

`POST http://localhost:3000/overlay
parameters:
"backgroundUrl" - URL of background tile
"overlayUrl" - URL of foreground tile
`

Overlay tile A to tile B (addictive mode)

`POST http://localhost:3000/addictive_overlay
parameters:
"backgroundUrl" - URL of background tile
"overlayUrl" - URL of foreground tile
`


Get tile with offset (for ellipsoid projections)

`POST http://localhost:3000/move
parameters:
"urlTL" - URL of top left tile
"urlTR" - URL of top right tile
"urlBR" - URL of bottom right tile
"urlBL" - URL of bottom left tile
"xOffset" - Offset for X axis
"yOffset" - Offset for Y axis
`

Get tile with offset and static overlay (for ellipsoid projections)

`POST http://localhost:3000/move_background_and_overlay
parameters:
"urlTL" - URL of top left tile
"urlTR" - URL of top right tile
"urlBR" - URL of bottom right tile
"urlBL" - URL of bottom left tile
"xOffset" - Offset for X axis
"yOffset" - Offset for Y axis
"overlayUrl" - URL of foreground tile
`
