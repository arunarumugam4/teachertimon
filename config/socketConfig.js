// socket configuration
// dependencies
const mongoose = require('mongoose');
const questionModel = mongoose.model('questionModel')
const testModel = mongoose.model('testModel')
const userModel = mongoose.model('userModel');
const attendedTestModel = mongoose.model('attendedTestModel');





// export the socket configuration
module.exports = (io, app) => {

    // connection handler 
    io.on('connection', function(socket) {
        console.log('one socket joined');

        // start test
        socket.on('start', (data) => {
            // create namespace with the testId
            // store the admin id in the socket
            let adminId = data.adminId;
            let testId = data.testId;



            // create the room
            socket.join(testId);

        }) // start test end



        socket.on('attend', (data) => {
            let userId = data.userId;
            let testId = data.testId;

            if (io.sockets.adapter.rooms[testId]) {
                socket.join(testId);

                function numClientsInRoom() {
                    let clients = io.sockets.adapter.rooms[testId].sockets;
                    return Object.keys(clients).length;
                }
                let numberOfUsers = numClientsInRoom();
                io.to(testId).emit('onlineUsers', numberOfUsers);
            } else {
                io.emit('notlive', true);
            }


        }) // attend end

        // on test end
        socket.on('stopTest', function(testId) {

            io.to(testId).emit('stopTest', true);



        })


        // on test result

        socket.on('testResult', function(data) {

            let testId = data.testId;

            function numClientsInRoom() {
                let clients = io.sockets.adapter.rooms[testId].sockets;
                return Object.keys(clients).length;
            }
            let numberOfUsers = numClientsInRoom();

            io.to(testId).emit('testResult', numberOfUsers);

             

        }) // test result end

    }) // connection handler end
}