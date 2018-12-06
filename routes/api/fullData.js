import { db } from '../../config/db'
import Joi from 'joi'
import moment from 'moment-timezone'

export default [
{
    method: 'POST',
    path: '/api/rangeTotalData',
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