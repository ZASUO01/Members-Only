const Message = require('../models/message');
const User = require('../models/user');
const {body, validationResult} = require('express-validator');

exports.index = function(req, res, next){
    Message.find()
    .populate('user')
    .exec((err, messages)=> {
        if(err) {
            return next(err);
        }
        res.render(
          'index', 
          { 
            title: 'Members Only', 
            user: res.locals.currentUser,
            messages: messages
          }
        ); 
    });
}


exports.message_create = function(req, res, next){
      res.render(
        'post_create', 
        {
          title: 'Members Only | Create post',
          user: res.locals.currentUser
        }
      )    
}

exports.message_create_post = [
  body('title')
  .trim()
  .isLength({min: 1}).withMessage('Title must be not empty'),
  body('message')
  .trim()
  .isLength({min: 1}).withMessage('Message must be not empty'),

  (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: res.locals.currentUser._id
    })
    if(!errors.isEmpty()){
      res.render(
        'post_create', 
        {
          title: 'Members Only | Create post',
          user: res.locals.currentUser,
          errors: errors.array()
        }
      );
    return;  
    }
    else{
      message.save((err) => {
        if(err){
          return next(err);
        }
        res.redirect('/');
      })
    }
  }
];

exports.delete_message = function(req, res, next){
  Message.findByIdAndRemove(req.params.id, function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
}