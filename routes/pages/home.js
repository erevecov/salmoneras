import dotEnv from 'dotenv'
dotEnv.load()

export default {
    method: ['GET'],
    path: '/',
    options: {
        handler: (request, h) => {
            
            return h.view('dashboard', {socket: process.env.SOCKET_SERVER})
        }
    }
}
