const express = require('express');
const router = express.Router();
const chatController = require("./../../app/controllers/chatController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/chat`;

 
  // params: senderId, receiverId, skip.
  app.get(`${baseUrl}/get/for/user`, auth.isAuthorized, chatController.getUsersChat);
   /**
   * @apiGroup chat
   * @apiVersion  1.0.0
   * @api {get} /api/v1/chat/get/for/user to get paginated chats of user.
   * 
   * @apiParam {string} senderId userId of logged in user. (query params) (required)
   * @apiParam {string} receiverId userId receiving user. (query params) (required)
   * @apiParam {number} skip skip value for pagination. (query params) (optional)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
        "error": false,
        "message": "All Chats Listed",
        "status": 200,
        "data": [
          {
            "chatId": "IELO6EVjx",
            "modifiedOn": "2018-03-05T15:36:31.026Z",
            "createdOn": "2018-03-05T15:36:31.025Z",
            "message": "hello .. .. sourav",
            "receiverId": "-E9zxTYA8",
            "receiverName": "Rishabh Sengar",
            "senderId": "-cA7DiYj5",
            "senderName": "sourav das"
          },
          {
            "chatId": "ZcaxtEXPT",
            "modifiedOn": "2018-03-05T15:36:39.548Z",
            "createdOn": "2018-03-05T15:36:39.547Z",
            "message": "hello rishabh .. .. .. ",
            "receiverId": "-cA7DiYj5",
            "receiverName": "sourav das",
            "senderId": "-E9zxTYA8",
            "senderName": "Rishabh Sengar"
          },
          .........................
        ]

      }
 */


  // params: chatRoom, skip.
  app.get(`${baseUrl}/get/for/group`, auth.isAuthorized, chatController.getGroupChat);
    /**
   * @apiGroup chat
   * @apiVersion  1.0.0
   * @api {get} /api/v1/chat/get/for/group to get paginated chats of group.
   * 
   * @apiParam {string} chatRoom roomName of group. (query params) (required)
   * @apiParam {string} authToken authToken of user. (query params) (required)
   * @apiParam {number} skip skip value for pagination. (query params) (optional)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, data.
   * 
   * @apiSuccessExample {object} Success-Response:
      {
    "error": false,
    "message": "All Group Chats Listed",
    "status": 200,
    "data": [
        {
            "senderName": "Deepak singh",
            "senderId": "Zfu2gWJOd",
            "message": "my name is pankj",
            "chatRoom": "temp",
            "seen": false,
            "chatId": "I4e4jQBz1",
            "createdOn": "2018-09-20T18:04:09.548Z",
            "modifiedOn": "2018-09-20T18:04:11.618Z"
        },
        {
            "senderName": "Deepak singh",
            "senderId": "Zfu2gWJOd",
            "message": "l",
            "chatRoom": "temp",
            "seen": false,
            "chatId": "HfpzWPaYA",
            "createdOn": "2018-09-20T18:04:20.932Z",
            "modifiedOn": "2018-09-20T18:04:22.950Z"
        },
        {
            "senderName": "pankaj singh",
            "senderId": "-jzKDERxz",
            "message": "kl",
            "chatRoom": "temp",
            "seen": false,
            "chatId": "XkSvT-q8W",
            "createdOn": "2018-09-20T18:04:27.761Z",
            "modifiedOn": "2018-09-20T18:04:29.778Z"
        }
    ]
}
   @apiErrorExample {json} Error-Response:
   *
   *  {
          "error": true,
          "message": "No Chat Found",
          "status": 404,
          "data": null
}
 */



  
  // params: chatIdCsv.
  app.post(`${baseUrl}/mark/as/seen`, auth.isAuthorized, chatController.markChatAsSeen);

  /**
   * @apiGroup chat
   * @apiVersion  1.0.0
   * @api {get} /api/v1/chat/count/unseen to get count of unseen messages.
   * 
   * @apiParam {string} userId userId of logged in user. (query params) (required)
   * @apiParam {string} senderId userId sending user. (query params) (required)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
        "error": false,
        "message": "unseen chat count found.",
        "status": 200,
        "data": 5

      }
 */
  // params: userId, senderId.
  app.get(`${baseUrl}/count/unseen`, auth.isAuthorized, chatController.countUnSeenChat);

  /**
   * @apiGroup chat
   * @apiVersion  1.0.0
   * @api {get} /api/v1/chat/find/unseen to get paginated unseen chats of user.
   * 
   * @apiParam {string} userId userId of logged in user. (query params) (required)
   * @apiParam {string} senderId userId sending user. (query params) (required)
   * @apiParam {number} skip skip value for pagination. (query params) (optional)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
        "error": false,
        "message": "chat found and listed.",
        "status": 200,
        "data": [
          {
            "chatId": "IELO6EVjx",
            "modifiedOn": "2018-03-05T15:36:31.026Z",
            "createdOn": "2018-03-05T15:36:31.025Z",
            "message": "hello .. .. sourav",
            "receiverId": "-E9zxTYA8",
            "receiverName": "Rishabh Sengar",
            "seen": false,
            "senderId": "-cA7DiYj5",
            "senderName": "sourav das"
          },
          {
            "chatId": "ZcaxtEXPT",
            "modifiedOn": "2018-03-05T15:36:39.548Z",
            "createdOn": "2018-03-05T15:36:39.547Z",
            "message": "hello rishabh .. .. .. ",
            "receiverId": "-cA7DiYj5",
            "receiverName": "sourav das",
            "seen": false,
            "senderId": "-E9zxTYA8",
            "senderName": "Rishabh Sengar"
          },
          .........................
        ]

      }
 */
  // params: userId, senderId, skip.
  app.get(`${baseUrl}/find/unseen`, auth.isAuthorized, chatController.findUnSeenChat);

  /**
   * @apiGroup chat
   * @apiVersion  1.0.0
   * @api {get} /api/v1/chat/unseen/user/list to get user list of unseen chats.
   * 
   * @apiParam {string} userId userId of logged in user. (query params) (required)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
        "error": false,
        "message": "All Chats Listed",
        "status": 200,
        "data": [
          {
            "chatId": "IELO6EVjx",
            "modifiedOn": "2018-03-05T15:36:31.026Z",
            "createdOn": "2018-03-05T15:36:31.025Z",
            "message": "hello .. .. sourav",
            "receiverId": "-E9zxTYA8",
            "receiverName": "Rishabh Sengar",
            "senderId": "-cA7DiYj5",
            "senderName": "sourav das"
          },
          {
            "chatId": "ZcaxtEXPT",
            "modifiedOn": "2018-03-05T15:36:39.548Z",
            "createdOn": "2018-03-05T15:36:39.547Z",
            "message": "hello rishabh .. .. .. ",
            "receiverId": "-cA7DiYj5",
            "receiverName": "sourav das",
            "senderId": "-E9zxTYA8",
            "senderName": "Rishabh Sengar"
          },
          .........................
        ]

      }
 */
  // params: userId.
  app.get(`${baseUrl}/unseen/user/list`, auth.isAuthorized, chatController.findUserListOfUnseenChat);

}
