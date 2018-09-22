

const mongoose = require('mongoose');
const shortid = require('shortid');
const check = require('./../libs/checkLib')
const time = require('./../libs/timeLib')
const logger = require('./../libs/loggerLib')
const response = require('./../libs/responseLib')
//const token = require('./../libs/tokenLib')
// const Auth = require('./../middlewares/auth')

const chatGroupModel = mongoose.model('chatGroup')

let getAllGroup = (req, res) => {
    chatGroupModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'chatGroup Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find groups Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No group Found', 'chatGroup Controller: getAllGroup')
                let apiResponse = response.generate(true, 'No Group Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Groups', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users



let createGroup = (req, res) => {
    chatGroupModel.findOne({ chatGroupTitle: req.body.title }).exec((err, result) => {
        if (err) {
            logger.error('Database error', 'chatRoomController: createGroup', 10)
            let apiResponse = response.generate( true, 'Database error', 500, null)
            //reject(apiResponse)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            console.log('=====> creating Group')
            //console.log(auth.isAuthorized.req.user.userId)
            
            let newGroup = new chatGroupModel({

                chatGroupId : shortid.generate(),
                chatGroupTitle: req.body.title,
                //adminName: req.body.adminName,
                //adminId: req.body.id,                 
                //isMember: true,
                createdOn: time.convertToLocalTime(),
                lastModified: time.convertToLocalTime()
            })

            newGroup.save((err, newGroup) => {
                if (err) {
                    logger.error('Failed to create group', 'chatRoomController: saveGroup', 10)
                    let apiResponse = response.generate( true, 'Unable to create group', 500, null)
                    //reject(apiResponse)
                    res.send(apiResponse)
                } else {
                    logger.info('group created, modifying response ====> deleting some keys', 'chatRoomController: createGroup', 500)
                    let newGroupObj = newGroup.toObject();
                    delete newGroupObj._id,
                    delete newGroupObj.__v
                    
                    
                    let apiResponse = response.generate( false, 'group creation success', 200, newGroupObj)
                    //resolve(apiResponse)
                    res.send(apiResponse)
                }
            })
        } else {
            logger.error('group already exist', 'chatRoomController: createGroup', 20)
            let apiResponse = response.generate(true, 'group already exist', 403, null)
            //resolve(apiResponse)
            res.send(apiResponse)
        }
    })
}
    
let getUserGroups = (req, res) => {
    chatGroupModel.find({ adminId: req.params.userId })
    .select('-_id -__v')
    .lean()
    
    .exec((err, groupDetails) => {
            if (err) {
                logger.error('Database error', 'chatRoomController: getUsersGroup', 10)
                let apiResponse = response.generate( true, 'Database error', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(groupDetails)) {
                logger.info('No group found on this userId', 'chatGroupController: getUserGroup', 500)
                let apiResponse = response.generate( true, 'No group found', 403, null)
                res.send(apiResponse)
            } else {
                logger.info('groups found', 'chatGroupController: getUserGroup', 200)
                
                let apiResponse = response.generate( false, 'groups found', 200, groupDetails)
                res.send(apiResponse)
            }
    })
}

let getSingleGroup = (req, res) => {
    chatGroupModel.findOne({ chatGroupId: req.params.groupId }).exec((err, groupDetails) => {
            if (err) {
                logger.error('Database error', 'chatRoomController: getSingleGroup', 10)
                let apiResponse = response.generate( true, 'Database error', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(groupDetails)) {
                logger.info('No group found on this userId', 'chatGroupController: getSingleGroup', 500)
                let apiResponse = response.generate( true, 'No group found', 403, null)
                res.send(apiResponse)
            } else {
                logger.info('groups found', 'chatGroupController: getSingleGroup', 200)
                let finalDetails = groupDetails.toObject()
                delete finalDetails._id,
                delete finalDetails.__v
                console.log(finalDetails)
                let apiResponse = response.generate( false, 'group found', 200, finalDetails)
                res.send(apiResponse)
            }
    })
}

let deleteGroup = (req, res) => {
    chatGroupModel.findOneAndRemove({ chatGroupTitle : req.body.title })
    .select('-_id -__v')
    .lean()
    .exec((err, groupDetails) => {
            if (err) {
                logger.error('Database error', 'chatRoomController: deleteGroup', 10)
                let apiResponse = response.generate( true, 'Database error', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(groupDetails)) {
                logger.info('No group found on this groupId', 'chatGroupController: deleteGroup', 500)
                let apiResponse = response.generate( true, 'No group found', 403, null)
                res.send(apiResponse)
            } else {
                logger.info('groups found', 'chatGroupController: deleteGroup', 200)
                
                console.log(groupDetails)
                let apiResponse = response.generate( false, 'group deleted', 200, groupDetails)
                res.send(apiResponse)
            }
    })
}


let getActiveGroup = (req, res) => {
    console.log(req.params.userId)
    chatGroupModel.find({ $and: [{ adminId: { $eq: req.params.userId }},{ isActive: { $eq: true }}] })
    .select('-_id -__v')
    .lean()
    .exec((err, groupDetails) => {
            if (err) {
                logger.error('Database error', 'chatRoomController: getActiveGroup', 10)
                let apiResponse = response.generate( true, 'Database error', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(groupDetails)) {
                logger.info('No group found on this groupId', 'chatGroupController: getActiveGroup', 500)
                let apiResponse = response.generate( true, 'No group found', 403, null)
                res.send(apiResponse)
            } else {
                logger.info('groups found', 'chatGroupController: getActiveGroup', 200)
                
                console.log(groupDetails)
                let apiResponse = response.generate( false, 'group found', 200, groupDetails)
                res.send(apiResponse)
            }
    })
}


let editGroup = (req, res) => {
    console.log('Inside edit group')
    let options = req.body
    console.log(options)
    chatGroupModel.update({ chatGroupId: req.params.groupId }, options, { multi: true })
    .select('-_id -__v')
    .lean()
    .exec((err, result) => {
        if (err) {
            logger.error('Failed to update group details', 'Group Controller:Edit Group', 10)
            let apiResponse = response.generate(true, 'Failed to update group details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller:Edit Group', 10)
            let apiResponse = response.generate(false, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            console.log(result)
            logger.info('Group edited Successfully', 'Group Controller:Edit Group', 4)
            let apiResponse = response.generate(false, 'Edit Successful', 200, result)
            res.send(apiResponse)
        }
    })
}

let deActiveGroup = (req, res) => {
    console.log('Inside deactive group')
  
    chatGroupModel.update({ chatGroupId: req.params.groupId }, { $set: { isActive: false } } )
    .select('-_id -__v')
    .lean()
    .exec((err, result) => {
        if (err) {
            logger.error('Failed to update group details', 'Group Controller: deactive Group', 10)
            let apiResponse = response.generate(true, 'Failed to update group details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller:deactiveGroup', 10)
            let apiResponse = response.generate(false, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            //result.isActive = false
            //result.save()
            console.log(result)
            logger.info('Group deactivated Successfully', 'Group Controller:deactiveGroup', 4)
            let apiResponse = response.generate(false, 'deactive Successful', 200, result)
            res.send(apiResponse)
        }
    })
}


module.exports = {
    getAllGroup: getAllGroup,
    createGroup: createGroup,
    getUserGroups: getUserGroups,
    getSingleGroup: getSingleGroup,
    deleteGroup: deleteGroup,
    getActiveGroup: getActiveGroup,
    editGroup: editGroup,
    deActiveGroup: deActiveGroup
}