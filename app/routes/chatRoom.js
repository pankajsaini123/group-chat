const express = require('express');
const router = express.Router();
const chatgroupController = require("../controllers/chatRoomController");
const appConfig = require("../../config/appConfig")
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/chatgroup`;
    
    app.post(`${baseUrl}/create`, auth.isAuthorized, chatgroupController.createGroup)

    app.get(`${baseUrl}/user_group/:userId`, auth.isAuthorized, chatgroupController.getUSerGroups)

    app.get(`${baseUrl}/get_group/:groupId`, auth.isAuthorized, chatgroupController.getSingleGroup)

    app.get(`${baseUrl}/active/:userId`, auth.isAuthorized, chatgroupController.getActiveGroup)

    app.put(`${baseUrl}/edit/:groupId`, auth.isAuthorized, chatgroupController.editGroup)

    app.post(`${baseUrl}/delete/:groupId`, auth.isAuthorized, chatgroupController.deleteGroup)
}
