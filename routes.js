const express = require('express')
const users = require('./NShades/users')
const controllers = require('./NShades/controllers')

const router = express.Router();

router.post('/signup-vendor',users.createServiceProvider)
router.post('/login-vendor',users.loginVendor)
router.post('/edit-profile',controllers.EditWorkersProfile)
router.post('/get-profile',controllers.ViewProfile)
router.get('/get-services',controllers.ViewServices)
router.post('/post-comment',controllers.postComment)
router.post('/get-comments',controllers.getComments)
router.post('/get-likes',controllers.totalLikes)
router.post('/is-liked',controllers.isLiked)
router.post('/add-like',controllers.AddLike)
router.post('/post-enquiry',controllers.EnquiryForm)
router.post('/get-enquiry',controllers.GetAllForms)
router.post('/get-likes-dashboard',controllers.GetAllLikes)
router.post('/get-profilepicture',controllers.GetProfilePicture)
router.post('/forgotpassword',users.forgotPassword)
router.post('/changepassword',users.changePassword)
module.exports = router;