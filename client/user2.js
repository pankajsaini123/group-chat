// connecting with sockets.

const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ik9uSm1BY1pzVSIsImlhdCI6MTUzNjMyNTEwMDYwNywiZXhwIjoxNTM2NDExNTAwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IkZyZk5TY0RuYSIsImZpcnN0TmFtZSI6InBhbmthaiIsImxhc3ROYW1lIjoic2luZ2giLCJlbWFpbCI6InBhbmthanNhaW5pOTkxMTg3NDMxMUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjEyMzQ1Njc4OX19.WiBsYPfXLluqbQmB2uhXSKo__WgD9jskTqYi815K1YE"
const userId= "FrfNScDna"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: '-jzKDERxz',//putting user2's id here 
  receiverName: "pankajsaini982134@gmail.com",
  senderId: userId,
  senderName: "def"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

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



}// end chat socket function

chatSocket();
