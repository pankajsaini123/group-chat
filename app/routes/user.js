const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUser);
          /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/view/all api for viewing all users.
     *
     * @apiParam {string} authToken authToken of the user. (body params) (required)
     *
     * 
     * 
     * @apiSuccessExample {object} Success-Response:
         {
                "error": false,
                "message": "All User Details Found",
                "status": 200,
                "data": [
                    {
                        "userId": "YkWh52D0e",
                        "firstName": "pankaj",
                        "lastName": "singh",
                        "password": "$2b$10$4Er8XE8HwffEEsz2Wmx06O0IavU2NCUP0Q7.BNSrfSU4UykUXFg3i",
                        "email": "abc@gmail.com",
                        "mobileNumber": 123456789,
                        "createdOn": "2018-09-03T14:34:28.000Z"
                    },
                    {
                        "userId": "-jzKDERxz",
                        "firstName": "pankaj",
                        "lastName": "singh",
                        "password": "$2b$10$pyieZrzZ5N9Mb7u8Eas1Pu.CxfXg9tM.8yilNvGDHHoN2tpcKS9OO",
                        "email": "pankajsaini982134@gmail.com",
                        "mobileNumber": 123456789,
                        "createdOn": "2018-09-04T06:45:30.000Z"
                    }
      
    ]
}
    
   @apiErrorExample {json} Error-Response:
   *
   * {
    "error": true,
    "message": "Failed to find user details",
    "status": 500,
    "data": null
}
   */

    // params: userId.
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);
            /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:userId/details api for viewing single users.
     *
     * @apiParam {string} authToken authToken of the user. (body params) (required)
     *
     * 
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Details Found",
            "status": 200,
            "data": {
                "userId": "-jzKDERxz",
                "firstName": "pankaj",
                "lastName": "singh",
                "email": "pankajsaini982134@gmail.com",
                "mobileNumber": 123456789,
                "createdOn": "2018-09-04T06:45:30.000Z"
            }
}
    
   @apiErrorExample {json} Error-Response:
   *
   *{
    "error": true,
    "message": "No User Found",
    "status": 404,
    "data": null
}
   */

    // params: firstName, lastName, email, mobileNumber, password, apiKey.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
      /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} firstName firstName of the user. (body params) (optional)
     * @apiParam {string} lastName lastName of the user. (body params) (optional)
     * @apiParam {string} mobileNumber mobileNumber of the user. (body params) (optional)
     * 
     * 
     * @apiSuccessExample {object} Success-Response:
        {
                "error": false,
                "message": "User created",
                "status": 200,
                "data": {
                    "userId": "8cI1Shn7T",
                    "firstName": "pankaj",
                    "lastName": "singh",
                    "email": "1123pankajsaini@gmail.com",
                    "mobileNumber": 123456789,
                    "createdOn": "2018-09-21T09:15:26.000Z",
                    "_id": "5ba4b6ae03bb750fbd5520d9",
                    "__v": 0
                }
}
    
   @apiErrorExample {json} Error-Response:
   *
   * {
        "error": true,
        "message": "One or More Parameter(s) is missing",
        "status": 400,
        "data": null
}
   */

    app.post(`${baseUrl}/login`, userController.loginFunction);
      /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkN6R1ZZd1lscSIsImlhdCI6MTUzNzUxODM2MDAwNiwiZXhwIjoxNTM3NjA0NzYwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Ii1qektERVJ4eiIsImZpcnN0TmFtZSI6InBhbmthaiIsImxhc3ROYW1lIjoic2luZ2giLCJlbWFpbCI6InBhbmthanNhaW5pOTgyMTM0QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6MTIzNDU2Nzg5fX0.IOm-Hvk9RFx4oBs0bDC5G3iw_db7k9Ol18zr8aurZtI",
                "userDetails": {
                    "userId": "-jzKDERxz",
                    "firstName": "pankaj",
                    "lastName": "singh",
                    "email": "pankajsaini982134@gmail.com",
                    "mobileNumber": 123456789
        }
    }
}
    
   @apiErrorExample {json} Error-Response:
   *
   * {
    "error": true,
    "message": "Wrong Password.Login Failed",
    "status": 400,
    "data": null
}
   */

    app.post(`${baseUrl}/sendVerificationCode`, userController.sendVerificationCode)
          /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/sendVerificationCode api for sending verification code.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     *
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Verification Code sent to your mail",
            "status": 200,
            "data": "Success"
         }
    
   @apiErrorExample {json} Error-Response:
   *
   * {
    "error": true,
    "message": "No user Found",
    "status": 404,
    "data": null
}
   */

    app.put(`${baseUrl}/forgot`, userController.resetPassword);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/forgot api for forgot password.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} veificationCode veificationCode of the user. (body params) (required)
     *
     *
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Password Updates Success",
            "status": 200,
            "data": {
                "userId": "-jzKDERxz",
                "firstName": "pankaj",
                "lastName": "singh",
                "email": "pankajsaini982134@gmail.com",
                "mobileNumber": 123456789,
                "createdOn": "2018-09-04T06:45:30.000Z"
            }
}
    
   @apiErrorExample {json} Error-Response:
   *
   * {
    "error": true,
    "message": "No user Found",
    "status": 404,
    "data": null
}
   */

    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);  
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/:userId/delete api for delete user.
     *
     * @apiParam {string} userId userId of the user. (route params) (required)
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Deleted the user successfully",
            "status": 200,
            "data": {
                
            }
}
    
   @apiErrorExample {json} Error-Response:
   *
   * {
    "error": true,
    "message": "No user Found",
    "status": 404,
    "data": null
}
   */  

    app.post(`${baseUrl}/:userId/logout`, auth.isAuthorized, userController.logout);
          /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout api for user logging out.
     *
     * @apiParam {string} authToken authToken of the user. (route params) (required))
     * 
     * @apiSuccessExample {object} Success-Response:
    {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null
}

   @apiErrorExample {json} Error-Response:
   *
   * {
        "error": true,
        "message": "Invalid Or Expired AuthorizationKey",
        "status": 404,
        "data": null
}
   */

}
