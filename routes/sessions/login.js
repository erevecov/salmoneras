import md5 from 'md5'
import { db } from '../../config/db'
import { formatRut } from '../../tools'
//import { createLog } from '../../tools/logs'

let uuid = 1

const findUser = async (rut, password) => {
    try {
        let res = await db.find({
            selector: {
                _id: {
                    $gt: 0
                },
                type: 'user',
                rut: formatRut(rut),
                password: md5(password),
                status: 'enabled'
            }
        })

        if(res) {
            return res.docs[0] || null
        }
        
    } catch (err) {
        throw err
    }
}

const Login = {
    method: ['GET', 'POST'],
    path: '/login',
    options: {
        handler: async (request, h) => {
            if(request.auth.isAuthenticated) return h.redirect('/')
            let account = null
            
            if(request.method === 'post') {
                if(!request.payload.rut || !request.payload.password) {
                    return h.view('login', {message: 'Rut o contraseña incorrecto.'}, {layout:false})
                } else {
                    try {
                        account = await findUser(request.payload.rut, request.payload.password)
                        if(!account) {
                            return h.view('login', {message: 'Rut o contraseña incorrecto.'}, {layout:false})
                        } else {
                            const sid = String(++uuid)
                            //delete account._id
                            delete account.password
                            delete account._rev
                            await request.server.app.cache.set(sid, { account }, 0)
                            request.cookieAuth.set({ sid })

                            return h.redirect('/')
                        }
                    } catch (err) {
                        throw err
                    }
                    
                }
            }

            if(request.method === 'get') return h.view('login', {}, {layout:false})
        },
        auth: {mode: 'try'},
        plugins: {'hapi-auth-cookie': {redirectTo:false}}
    }
}

export default Login