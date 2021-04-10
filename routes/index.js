var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const MessageController = require('../controllers/messageController');

router.get('/',  MessageController.index);
router.get('/sign-up', UserController.sign_up_get);
router.post('/sign-up', UserController.sign_up_post);
router.get('/log-in', UserController.log_in_get);
router.post('/log-in', UserController.log_in_post);
router.get('/log-out', UserController.log_out_get);
router.get('/create_post', MessageController.message_create);
router.post('/create_post', MessageController.message_create_post);
router.get('/become_member', UserController.become_member);
router.post('/become_member', UserController.become_member_post);
router.get('/:id/delete', MessageController.delete_message);

module.exports = router;
