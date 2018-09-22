const mongoose = require('mongoose')


const Schema = mongoose.Schema

let chatGroupSchema = new Schema({
    
    chatGroupId: {
        type: String,
        unique: true,
        required: true,
    },
    chatGroupTitle: {
        type: String,
        default: ''
    },
   /*  adminName: {
        type: String,
        default: ''
    },
    adminId: {
        type: String,
        default: ''
    }, */ 
    isActive: {
        type: Boolean,
        default: true
    },
  /*  isMember: {
        type: Boolean,
        default: false
    },
     status: {
        type: String,
        default: 'active'
    },
 */
    messageList: [],

    createdOn: {
        type: String,
        default: Date.now
    },
    lastModified: {
        type: String,
        default: Date.now
    }   



})

mongoose.model('chatGroup', chatGroupSchema)