import { format, validate } from 'rut.js'
import uuid from 'uuid/v4'
import moment from 'moment-timezone'

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

function createToken() {
    return uuid()
}

function idGenerator() {
    return moment.tz('America/Santiago').format('YYYY-MM-DDTHH:mm:ss.SSSSS') + Math.floor((Math.random() * 999999999) + 1)
}

export { ktoK, cleanRut, formatRut, rutFunc, isRut, capitalizeAll, capitalizeFirst, createToken, idGenerator }