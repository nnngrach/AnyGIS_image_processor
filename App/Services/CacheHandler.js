const NodeCache = require( "node-cache" )

const storingTime = 60 //seconds
//const storingTime = 86400 // 1 day in seconds
const myCache = new NodeCache( { stdTTL: storingTime, checkperiod: storingTime + 60 } )


module.exports.save = function save(name, data) {

	object = { isError: false, data: "Special"}

	isSuccess = myCache.set( name, object )
}



module.exports.load = function load(name) {

	try{
    	const object = myCache.get( name, true )
    	return object

	} catch( err ){
    	const errorObject = { isError: true, data: ""}
    	return errorObject
	}
}