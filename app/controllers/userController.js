const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const AuthModel = mongoose.model('Auth')

/** nodemailer for sending mails on user signup */
const nodemailer = require('nodemailer')
const mail = require('./../libs/generateMail')


/* Models */
const UserModel = mongoose.model('User')

var events = require('events');
var eventEmitter = new events.EventEmitter();



/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user



let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let resetPassword = (req, res) => {
    
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email && req.body.password && req.body.verificationCode) {
                UserModel.findOne( { $and: [{ email: req.body.email }, {userId: req.body.verificationCode } ] } )
                .exec((err, result) => {
                    if (err) {
                        logger.error('Error', 'usercontroller: resetPassword', 10)
                        let apiResponse = response.generate( true, 'Database Error', 500, null)
                        reject(apiResponse)
                    } else if(check.isEmpty(result)) {
                        logger.error('user not found', 'usercontroller: resetPassword', 10)
                        let apiResponse = response.generate( true, 'No user found', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log(result)
                        resolve(result)
                    }
                })
            } else {
                logger.error('one or more parameter missing', 'userController: resetPassword', 400)
                let apiResponse = response.generate(true, 'Email or password is missing', 400, null)
                reject(apiResponse)
            }
        })
    } // end  of findUser
    

    let updatePassword = (result) => {
        return new Promise((resolve, reject) => {
                    UserModel.findOne({ email: req.body.email }).exec((err, userDetails) => {
                        if (err) {
                            logger.error('Error', 'usercontroller: updatePassword', 10)
                            let apiResponse = response.generate( true, 'Database Error', 500, null)
                            reject(apiResponse)
                        }  else  {
                            userDetails.password = passwordLib.hashpassword(req.body.password)
                            userDetails.save()
                            
                            logger.info('password updated successfully', 'userController: updatePassord', 500)
                            let finalDetails = userDetails.toObject()
                            delete finalDetails.password,
                            delete finalDetails.__v,
                            delete finalDetails._id
                            resolve(finalDetails)
                        }   
                    })
        })
    }

    findUser(req, res)
       .then(updatePassword)
       .then((resolve) => {
        
        console.log(resolve)
        let apiResponse = response.generate(false, 'Password Updates Success', 200, resolve)
        res.send(apiResponse)
        mail.passwordChanged(req.body.email,"<p>Hii!!,<br><p>You password has been changed successfully.</p><br><br><b>Thanks</b>")
       })
       .catch((err) => {
        console.log(err);
        res.send(err);
    })

}// end edit user


// listening eventEmitter to generate welcome mail to the user
eventEmitter.on('welcomeEmail', function(data) {
    console.log("event emitter called")
    console.log(data)
    mail.generateMail(data.mail, data.name, 'Welcome to our chat application. We are always ready to serve you better.')
   
})
// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)


            let name = req.body.firstName + " "+ req.body.lastName
            //mail.generateMail(req.body.email, name, 'Welcome to our chat application. We are always ready to serve you better.')
            let data = {
                mail: req.body.email,
                name: name
            }
            eventEmitter.emit('welcomeEmail',  data)   // emitting asynchronous event to make response faster 
        
        
 })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

        
}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
})
        .catch((err) => {
            //console.log("errorhandler");
            console.log(err);
            //res.status(err.status)
            res.send(err)
        })

        
}



// end of the login function 

eventEmitter.on('sendVerificationCode', function(data) {
    console.log("sendVerificationCode event emitter called")
    console.log(data)
    mail.generateVerifyCode(data.mail, data.name, data.verificationCode)
   
})
// send verification code

let sendVerificationCode = (req, res) => {
        console.log(req.body.email)
    UserModel.findOne({ email: req.body.email })
    .exec((err, userDetails) => {
        if (err) {
            logger.error(err.message, 'userController: sendVerificationCode', 10)
            let apiResponse = response.generate( true, 'Database error', '500', null)
            res.send(apiResponse)
        } else if (check.isEmpty(userDetails)) {
            console.log(userDetails)
            let apiResponse = response.generate( true, 'No user Found', 404, null)
            res.send(apiResponse)
        } else {
            console.log("userDetails ====> "+ userDetails)
            logger.info('user found', 'userController: sendVerificationCode', 200, userDetails)
            let apiResponse = response.generate( false, 'Verification Code sent to your mail', 200, 'Success')
            res.send(apiResponse)

            let name = userDetails.firstName + " "+ userDetails.lastName
            //mail.generateMail(req.body.email, name, 'Welcome to our chat application. We are always ready to serve you better.')
            let data = {
                mail: req.body.email,
                name: name,
                verificationCode: userDetails.userId
            }
            eventEmitter.emit('sendVerificationCode', data)
        }
    })

}


/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
  AuthModel.findOneAndDelete({userId: req.params.userId}, (err, result) => {
    if (err) {
        console.log(err)
        logger.error(err.message, 'user Controller: logout', 10)
        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
        res.send(apiResponse)
    } else if (check.isEmpty(result)) {
        let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
        res.send(apiResponse)
    }
  })
} // end of the logout function.


module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    sendVerificationCode: sendVerificationCode,
    resetPassword: resetPassword,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    loginFunction: loginFunction,
    logout: logout

}// end exports
