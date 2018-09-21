/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const mail = require('./../libs/generateMail')
const tokenLib = require("./tokenLib");
const check = require("./checkLib");
const response = require('./responseLib')
const ChatModel = mongoose.model('Chat');

//const redisLib = require("./redisLib");



let setServer = (server) => {

    let allOnlineUsers = []

    let listOfRoomAndNames = []

   

    

    let io = socketio.listen(server);

    let myIo = io.of('/')

    let myData = []
   // let pankaj = [10,15,20]

    

    

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
                    let userObj = { userId: currentUser.userId, fullName:fullName }
                    myData = userObj
                    //allOnlineUsers.push(userObj)  
                    
                    console.log(Object.keys(listOfRoomAndNames))
                    myIo.emit('allRooms', Object.keys(listOfRoomAndNames))


            // create new room
            socket.on('create-room', (roomName) => {
            console.log("roomName ============> " + roomName )

            if (socket.room != undefined) {

            socket.emit('disconnect')
            } 
       

            socket.room = roomName;

            let groupName = socket.room
            //let users = []
            let userObj = { userId: socket.userId, fullName: socket.fullName }
            allOnlineUsers.push(userObj)

            let details = {
                    groupName : groupName,
                    users: allOnlineUsers
            }
           
            
            

            if (listOfRoomAndNames[socket.room] != undefined ) {
                //listOfRoomAndNames[socket.room] = []

                listOfRoomAndNames[socket.room].push(groupName)

                listOfRoomAndNames[socket.room][users] = new Array()
                listOfRoomAndNames[socket.room][users].push(userObj)

            } else {
            listOfRoomAndNames[socket.room] = new Object()
            //listOfRoomAndNames[socket.room].push(groupName)
            //listOfRoomAndNames[socket.room][users] = new Array()
            //listOfRoomAndNames[socket.room].push(users)
            //listOfRoomAndNames[socket.room][users].push(userObj)
             //listOfRoomAndNames[socket.room][users] = new Object()
            // listOfRoomAndNames[socket.room][users] = new Array()
             //listOfRoomAndNames[socket.room][users].push(userObj)
             //listOfRoomAndNames[socket.room].push(details)
             listOfRoomAndNames[socket.room]['data'] =  details


            }
            console.log("room created")
            console.log(listOfRoomAndNames)
            console.log(listOfRoomAndNames)
            console.log(listOfRoomAndNames[socket.room].data.users)

            socket.join(socket.room)


            //console.log(listOfRoomAndNames[socket.room])
            //socket.to(socket.room).broadcast.emit('group-online-users', listOfRoomAndNames[socket.room])
            socket.to(socket.room).broadcast.emit('online-user-list', listOfRoomAndNames[socket.room].data.users)

            //console.log(Object.keys(listOfRoomAndNames))
            //myIo.emit('allRooms', Object.keys(listOfRoomAndNames))
            
            myIo.emit('allRooms',  Object.keys(listOfRoomAndNames))
            

        })
                    

                
                        }
                    })             

        }) // end of listening set-user event

       /*  console.log(Object.keys(listOfRoomAndNames))
        myIo.emit('allRooms', Object.keys(listOfRoomAndNames))  */


        socket.on('editRoom', (editedRoomData) => {

            console.log(editedRoomData)



        })


        socket.on('deleteThisRoom', (roomName) => {

            
           
            socket.emit('disconnect')
            delete listOfRoomAndNames[roomName]
             allOnlineUsers = []
            //delete listOfRoomAndNames[socket.room].data.users
            console.log(allOnlineUsers)
            console.log(`${roomName}  room is deleted`)
            console.log(listOfRoomAndNames)
            myIo.emit('allRooms',  Object.keys(listOfRoomAndNames))
            //socket.to(socket.room).broadcast.emit('online-user-list', listOfRoomAndNames[socket.room].data.users)
            myIo.emit('online-user-list', allOnlineUsers)
            socket.emit('online-user-list', allOnlineUsers)

            socket.emit('room-deleted','' )
            myIo.emit('room-deleted','' )
        
        })

       

       


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel
            console.log("disconnected socket is called.")

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            //console.log(socket.userId);
            //socket.emit('valueForJoin',0);
            socket.to(socket.room).broadcast.emit('leftRoom',socket.fullName);
            console.log(socket.room +  '<================ socket.room') 
            
             if ( allOnlineUsers != undefined) {

            /* var removeIndex = listOfRoomAndNames[socket.room].data.users.map(function(user) { return user.userId }).indexOf(socket.userId);
            listOfRoomAndNames[socket.room].data.users.splice(removeIndex,1) 

            if(listOfRoomAndNames[socket.room].data.users.length == 0)
            delete listOfRoomAndNames[socket.room]  */

            /* var removeIndex = listOfRoomAndNames[socket.room].data.users.map(function(user) { return user.userId }).indexOf(socket.userId);
            listOfRoomAndNames[socket.room].data.users.splice(removeIndex,1) 

            if(listOfRoomAndNames[socket.room].data.users.length == 0)
            delete listOfRoomAndNames[socket.room] */

            var removeIndex = allOnlineUsers.map(function(user) { return user.userId }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1) 

            /* if(allOnlineUsers.length == 0)
            delete listOfRoomAndNames[socket.room] */

             }
            
            //deleting room from array if no user exist in room
            /*  if(listOfRoomAndNames[socket.room].length == 0)
                delete listOfRoomAndNames[socket.room] 
                */

                
             
 
            
            //listing rooms and users
            console.log("list of room and users")
            console.log(listOfRoomAndNames)
           // console.log(listOfRoomAndNames[socket.room].data.users)

            //listing room names
            //console.log(Object.keys(listOfRoomAndNames));
             /* var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1) */
            console.log("allonline users")
            console.log(allOnlineUsers) 

            //socket.to(socket.room).broadcast.emit('group-online-users',listOfRoomAndNames[socket.room]);
            //socket.broadcast.emit('allRooms',Object.keys(listOfRoomAndNames))
            if ( listOfRoomAndNames[socket.room] != undefined) {
            socket.emit('online-user-list', listOfRoomAndNames[socket.room].data.users)
            socket.to(socket.room).broadcast.emit('online-user-list', listOfRoomAndNames[socket.room].data.users)
            }
            socket.leave(socket.room)
            //socket.disconnect()
               

        }) // end of on disconnect







        socket.on('switch-room', (joinRoomName) => {
            console.log(socket.room)

            console.log(socket.fullName + "has left" + socket.room)


             if (socket.room != undefined) {
                socket.emit('disconnect')
               //socket.leave(socket.room)
            } 

            socket.room = joinRoomName
            socket.join(socket.room)
            console.log(socket.fullName + " has joined " + socket.room)


            socket.to(socket.room).broadcast.emit('joinedRoom', socket.fullName)

            let userObj = { userId: socket.userId, fullName: socket.fullName }
            allOnlineUsers.push(userObj)
            console.log(allOnlineUsers)
            //console.log(userObj + "<==================== userObj")

            /* if(listOfRoomAndNames[socket.room] != undefined) {
                
                //listOfRoomAndNames[socket.room].data.users.push(userObj);  
                allOnlineUsers.push(userObj)                  
               
            }
            else{
                //listOfRoomAndNames[socket.room] = new Object();
                //listOfRoomAndNames[socket.room].data.users.push(userObj);
                //allOnlineUsers.push(userObj)
            } */
            console.log("*********room details*********************************")
            console.log(listOfRoomAndNames)
            //console.log(`${listOfRoomAndNames[socket.room]} <=================== all users of  ${socket.room}  group`)
            //console.log(listOfRoomAndNames[socket.room] + "<=================== all users of" + socket.room + "group")
            //socket.to(socket.room).broadcast.emit('group-online-users', listOfRoomAndNames[socket.room])
            //myIo.emit('group-online-users', listOfRoomAndNames[socket.room])
            console.log("switch room online user list")
            console.log(listOfRoomAndNames[socket.room].data)
            //socket.to(socket.room).broadcast.emit('group-online-users', listOfRoomAndNames[socket.room])
            socket.emit('online-user-list', allOnlineUsers)
            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers)

            console.log(Object.keys(listOfRoomAndNames))
            myIo.emit('allRooms', Object.keys(listOfRoomAndNames))

        })


        


        


        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            console.log(data);
            data['chatId'] = shortid.generate()
            data['chatRoom'] = socket.room
            console.log(data);
            

            // event to save chat.
            setTimeout(function () {

                eventEmitter.emit('save-chat', data);

            }, 2000)

            socket.to(socket.room).broadcast.emit("msg-received", data)

        });






        // listening eventEmitter to generate welcome mail to the user
    eventEmitter.on('invitation-link', function(tempData) {
    console.log("event emitter called")
    console.log(tempData)
    mail.generateMail(tempData.mailReceiver, 'Buddy !  ', "Welcome to our chat application. Let\'s chat for free.<br><br> Use this link to connect<br><b>http://localhost:3000/chat/" + socket.room)
   
   })

    socket.on('invitaion-mail', (tempData) => {
    eventEmitter.emit('invitation-link', tempData)
})






        socket.on('i-am-typing', (data) => {
            console.log(`${data.myName}  is typing`)

            socket.to(socket.room).broadcast.emit('typing', data);

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