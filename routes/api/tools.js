import Joi from 'joi'
import Wreck from 'wreck'

const schemas = {
    testSchemas : {
        test: Joi.array().items(
            Joi.object({
                code: Joi.string().alphanum().min(3).max(30).required(),
                weight: Joi.number().integer().required()
            })
          )
          
    }
}

export default [
{
    method: ['GET'],
    path: '/api/session',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials

            return credentials
        }
    }
},
{
    method: ['GET'],
    path: '/api/benchmark',
    options: {
        auth: {
            strategies: ['simple']
        },
        handler: (request, h) => {
            try {
                return {ok:Math.floor((Math.random() * 999999999) + 1)}    
            } catch (error) {
                throw error
            }
            
        }
    }
},
{
    method: 'POST',
    path: '/api/testSchemas',
    options: {
        auth:false,
        handler: async (request, h) => {
            try {
                let test = request.payload.test

                return {ok: test}
                
            } catch (err) {
                throw err
            }
            
            
        },
        validate: {
            payload: Joi.object().keys(schemas.testSchemas)
        }
    }
},
]