const mongoose = require('mongoose')
const shortId = require('shortId')
const check = require('./../libs/checkLib')
const time = require('./../libs/timeLib')
const logger = require('./../libs/loggerLib')
const response = require('./../libs/responseLib')

const chatGroupModel = require('chatGroup')






module.exports = {
    createGroup: createGroup
}