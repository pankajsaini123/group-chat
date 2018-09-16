/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib");
const check = require("./checkLib");
const response = require('./responseLib')
const ChatModel = mongoose.model('Chat');

const redisLib = require("./redisLib");



let setServer = (server) => {

    let allOnlineUsers = []

    let groupOnlineRoomsAndUsers = {}

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user', (authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else {

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                   
                    socket.fullName = fullName
                    let userObj = { userId:socket.userId, fullName:fullName }
                    allOnlineUsers.push(userObj)



                    console.log(allOnlineUsers)
                    socket.emit('online-user-list', allOnlineUsers)


                    
                    

                
                        }
                    })             

        }) // end of listening set-user event

        console.log(Object.keys(groupOnlineRoomsAndUsers))
        myIo.emit('allRooms', Object.keys(groupOnlineRoomsAndUsers))



        socket.on('create-room', (roomName) => {
            console.log("roomName ============> " + roomName )
            
            socket.room = roomName;
            groupOnlineRoomsAndUsers[socket.room] = new Array()
            groupOnlineRoomsAndUsers[socket.room].push(this.userObj)
            console.log("group Online users")
            console.log(groupOnlineRoomsAndUsers[socket.room] )
            console.log('=====================')
            socket.join(socket.room)
            socket.to(socket.room).broadcast.emit('group-online-users', groupOnlineRoomsAndUsers[socket.room])

            console.log(Object.keys(groupOnlineRoomsAndUsers))
            myIo.emit('allRooms', Object.keys(groupOnlineRoomsAndUsers))
            

        })

        socket.on('editRoom', (editedRoomData) => {
            
            console.log("edited room called")
            console.log(editedRoomData)
            socket.leave(socket.room)
            //socket.emit('disconnect')


            delete groupOnlineRoomsAndUsers[socket.room]
            console.log(groupOnlineRoomsAndUsers)


            socket.room = editedRoomData.newRoomName

            //delete this.groupOnlineUserList[editedRoomData.currentRoomName]
            groupOnlineRoomsAndUsers[socket.room] = new Array()
            groupOnlineRoomsAndUsers[socket.room].push(this.userObj)

            console.log(socket.room)
            socket.join(socket.room)
            socket.to(socket.room).broadcast.emit('group-online-users', groupOnlineRoomsAndUsers[socket.room])
        
            console.log(Object.keys(groupOnlineRoomsAndUsers))
            myIo.emit('allRooms', Object.keys(groupOnlineRoomsAndUsers))
        
            /* console.log("edited room name list")
            console.log(this.groupOnlineRoomsAndUsers) */
        })


        


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);
            //socket.emit('valueForJoin',0);
           // socket.to(socket.room).broadcast.emit('leftRoom',socket.fullName); 
            
            /* if(socket.room!=undefined){ 
            var removeIndex = groupOnlineRoomsAndUsers[socket.room].map(function(user) { return user.userId; }).indexOf(socket.userId);
            groupOnlineRoomsAndUsers[socket.room].splice(removeIndex,1)

            //deleting room from array if no user exist in room
            if(groupOnlineRoomsAndUsers[socket.room].length==0)
                delete groupOnlineRoomsAndUsers[socket.room]}
            //listing rooms and users
            console.log(groupOnlineRoomsAndUsers)

            //listing room names
            console.log(Object.keys(groupOnlineRoomsAndUsers));
            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers) */

            socket.to(socket.room).broadcast.emit('online-user-list',groupOnlineRoomsAndUsers[socket.room]);
            socket.broadcast.emit('allRooms',Object.keys(groupOnlineRoomsAndUsers))
            socket.leave(socket.room)

        }) // end of on disconnect


        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            console.log(data);
            data['chatId'] = shortid.generate()
            console.log(data);
            

            // event to save chat.
            setTimeout(function () {

                eventEmitter.emit('save-chat', data);

            }, 2000)
            myIo.emit(data.receiverId, data)

        });

        socket.on('typing', (fullName) => {

            socket.to(socket.room).broadcast.emit('typing', fullName);

        });
    });

}


// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-chat', (data) => {

    // let today = Date.now();

    let newChat = new ChatModel({

        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn

    });

    newChat.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });

}); // end of saving chat.









module.exports = {
    setServer: setServer
}