//import { redisClient, getAsync } from '../redis'
/*
import { db } from '../config/db'
import moment from 'moment-timezone'
import { ktoK, cleanRut } from '../tools'
import _ from 'lodash'
*/
//import { createLog } from '../tools/logs'

let server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(socket){
    /*
    allBinScans().then(res=>{
        io.emit('dailyData', res.ok);
    })
    /*
    
    
    /*
    client.on('event', function(data){});
    client.on('disconnect', function(){});
    */
});

server.listen(3211);

const uploadBags = (bagsLength) => {
    console.log('TEEEEEST')
    io.emit('uploadBags', bagsLength);
}

const initSocket = () => {
    console.log('Socket Running on port: 3211')      
}

export { initSocket, uploadBags }