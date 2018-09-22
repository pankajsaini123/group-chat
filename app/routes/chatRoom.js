const express = require('express');
// const router = express.Router();
const chatRoomController = require("./../controllers/chatRoomController");
const appConfig = require("./../../config/appConfig")
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/group`;

    app.get(`${baseUrl}/all`, auth.isAuthorized, chatRoomController.getAllGroup)

    
    app.post(`${baseUrl}/create`, auth.isAuthorized, chatRoomController.createGroup)

    app.get(`${baseUrl}/getUser/:userId`, auth.isAuthorized, chatRoomController.getUserGroups)

    app.get(`${baseUrl}/getGroup/:groupId`, auth.isAuthorized, chatRoomController.getSingleGroup)

    app.get(`${baseUrl}/active/:userId`, auth.isAuthorized, chatRoomController.getActiveGroup)

    app.put(`${baseUrl}/deactive`, auth.isAuthorized, chatRoomController.deActiveGroup)

    app.put(`${baseUrl}/edit`, auth.isAuthorized, chatRoomController.editGroup)

    app.post(`${baseUrl}/delete`, auth.isAuthorized, chatRoomController.deleteGroup)
}
