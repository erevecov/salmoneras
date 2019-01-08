import { db } from '../../config/db'
import Joi from 'joi'
import moment from 'moment-timezone'
import _ from 'lodash'
import { createToken, idGenerator } from '../../tools'
import { uploadBags } from '../../socket'

export default [
{
    method: 'POST',
    path: '/api/validateBags',
    options: {
        auth: false,
        handler: async (request, h) => {
            try {
                let token = request.payload.token

                let res = await db.find({
                    selector: {
                        _id: {
                            $gt: 0
                        },
                        type: 'tempBag',
                        token: token
                    }
                })
                
                if(res.docs[0]) {
                    let mapBags = res.docs.map(el=> {
                        el.type = 'bagScan'
                        delete el.token
                        return el    
                    })
                    
                    let bulkBags = await bulkFunc(mapBags)

                    if(bulkBags) {
                        uploadBags(mapBags.length)
                        return {ok: `${mapBags.length} sacos validados correctamente`}
                    } else {
                        return {err: `No hemos podido validar los ${mapBags.length} sacos`}
                    }
                } else {
                    return {err: 'No hemos encontrado datos para validar'}
                }
            } catch (err) {
                throw err
            }
            
            
        },
        validate: {
            payload: Joi.object().keys({
                token: Joi.string().required()
            })
        }
    }
},
{
    method: 'POST',
    path: '/api/uploadBags',
    options: {
        auth: false,
        handler: async (request, h) => {
            try {
                let bags = JSON.parse(request.payload.bags)
                let distribution = await bagsDistribution(bags, createToken())

                console.log('DISTRIBUTION', distribution)
                if(distribution) {
                    return {ok: distribution}
                } else {
                    return {err: 'No hemos podido subir los datos, por favor intentelo nuevamente.'}
                }
                
            } catch (err) {
                throw err
            }
            
            
        },
        validate: {
            payload: Joi.object().keys({
                bags: Joi.string().required()
            })
        }
    }
},
{
    method: 'POST',
    path: '/api/bagsRangeData',
    options: {
        handler: async (request, h) => {
            let credentials = request.auth.credentials
            let initDate  = request.payload.initDate
            let endDate  = request.payload.endDate

            try {
                let result = await db.find({
                    selector: {
                        _id: {
                            $gt: initDate+'T00:00:00',
                            $lt: endDate+'T23:59:59'
                        },
                        type: 'bagScan',
                        enterprise: credentials.enterprise                     
                    }
                })

                console.log(result)

                
                if(result.docs[0]){
                    return { ok: result.docs }
                } else {
                    return { err: 'No se han encontrado registros en el rango de fechas seleccionado' }
                }
                
            } catch (err) {
                throw err
            }
            
        },
        validate: {
            payload: Joi.object().keys({
                initDate: Joi.string().required(),
                endDate: Joi.string().required()
            })
        }
    }
}]

const bagsDistribution = async (bags, token) => {
    //console.log(bags, token)
    let toBulk = []
    _.forEach(bags, (el)=> {
        toBulk.push({
            _id: idGenerator(),
            type: 'tempBag',
            center: el.center,
            enterprise: 'michcom',//el.enterprise,
            weigher: el.weigher,
            provider: el.provider,
            phoneDate: el.phoneDate,
            code: el.code,
            weight: el.weight,
            token: token
        })
    })

    let bulkData = await bulkFunc(toBulk)

    if(bulkData) {
        return token
    } else {
        return null
    } 
}

const bulkFunc = (toBulk) => {
    return new Promise(resolve=> {
        db.bulk({docs:toBulk}, function(er, res) {
            if (er) {console.log(er)}
    
            if(res[0].ok) {
                resolve(true)
            } else {
                resolve(null)
            }      
        })
    })
}