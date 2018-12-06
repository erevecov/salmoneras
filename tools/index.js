import { format, validate } from 'rut.js'

const cleanRut = (rut) => { // limpia un rut de . y -
    var replace1 = rut.split('.').join('')
    var replace2 = replace1.replace('-', '')
    return replace2
}

const ktoK = (rut) => { // cambia la k a K
    let replace1 = rut.replace('k', 'K')
    return replace1
}

const formatRut = (rut) => { // limpia un rut de . y - además cambia de k a K
    return ktoK(cleanRut(rut))
}

const rutFunc = (rut) => { // formatea un rut
    return format(rut)
}

const isRut = (rut) => { // verifica si es un rut ( true | false )
    return validate(rut)
}

function capitalizeAll(val) { // capitaliza todas las palabras
    return (val ? val.toLowerCase() : val).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function capitalizeFirst(val) { // capitaliza la primera palabra
    return val.substr(0,1).toUpperCase() + val.substr(1).toLowerCase();
}




export { ktoK, cleanRut, formatRut, rutFunc, isRut, capitalizeAll, capitalizeFirst }