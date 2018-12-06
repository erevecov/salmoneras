import Joi from 'joi'
import Wreck from 'wreck'

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
}
]

