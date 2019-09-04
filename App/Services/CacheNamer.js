module.exports.convert = function convert(url) {
    
	// Remove prefix "https://a." 
	// to avoid dubilcates of same tile from serevr's mirrors

	var label = ""

	const yandexNarodMapUrlLenght = 580
    const kosmosnimkiUrlLenght = 350
    const regularServerPrefixPartOffset = 13

    if (url.length > yandexNarodMapUrlLenght) {
    	label = url.substring(yandexNarodMapUrlLenght, url.length)

    } else if (url.length > kosmosnimkiUrlLenght) {
    	label = url.substring(kosmosnimkiUrlLenght, url.length)

    } else {
    	label = url.substring(regularServerPrefixPartOffset, url.length)
    }


	return label
}
