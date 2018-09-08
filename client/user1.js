// connecting with sockets.

const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlVJalNYSEcxcSIsImlhdCI6MTUzNjMyNDk3NzIyNywiZXhwIjoxNTM2NDExMzc3LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Ii1qektERVJ4eiIsImZpcnN0TmFtZSI6InBhbmthaiIsImxhc3ROYW1lIjoic2luZ2giLCJlbWFpbCI6InBhbmthanNhaW5pOTgyMTM0QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6MTIzNDU2Nzg5fX0.5huo-GHLBX2yRa5rBfVfLR_3w2OEfSeQxJoqcEeU_dc"
const userId= "-jzKDERxz"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'FrfNScDna',//putting user2's id here 
  receiverName: "pankajsaini9911874311@gmail.com",
  senderId: userId,
  senderName: "abc"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });


  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });


 

  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing", userId)

  })

  socket.on("typing", (data) => {

    console.log(data+" is typing")
    
    
  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });



}// end chat socket function

chatSocket();
