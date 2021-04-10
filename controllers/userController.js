require('dotenv').config()
const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('./passport');


exports.sign_up_get = function(req, res, next){
    res.render(
        'sign_form', 
        {
            title: 'Members Only | Sign up',
            sign_up: true,
            form_title: 'Sign up'
        }
    )
}

exports.sign_up_post = [
    body('firstname')
    .trim()
    .isLength({min:1, max:100}).withMessage('First name must be less than 100 characters')
    .isAlpha().withMessage('First name must contain only alpha characters')
    .escape(),
    body('lastname')
    .trim()
    .isLength({min:1, max:100}).withMessage('Last name must be less than 100 characters')
    .isAlpha().withMessage('Last name must contain only alpha characters')
    .escape(),
    body('username')
    .trim()
    .isEmail().withMessage('E-mail must be a valid e-mail')
    .custom(async(val) => {
        const user_found = await User.findOne({username: val});
        if(user_found !== null){
            return Promise.reject();
        }
        return Promise.resolve(); 
    }).withMessage('User already registered'),
    body('password')
    .trim()
    .isLength({min:4, max:12}).withMessage('Password must be between 4 and 12 characters')
    .isAlphanumeric().withMessage('Passowrd must contain only alphanumeric characters')
    .escape(),
    body('password-repeat')
    .trim()
    .custom((val, {req}) => {
        if(val === req.body.password) return true;
        return false
    }).withMessage('Password confirmation must match the given password'),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render(
                'sign_form',
                {
                    title: 'Members Only | Sign up',
                    errors: errors.array(),
                    sign_up: true,
                    form_title: 'Sign up'
                }
            )
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, newPassword) => {
                if(err){
                    return next(err);
                }

                const user = new User({
                    first_name: req.body.firstname,
                    last_name: req.body.lastname,
                    username: req.body.username,
                    password: newPassword
                })
                
                user.save((err) => {
                    if(err){
                        return next(err);
                    }
                });
                res.redirect('/');
            });
        }
    }
];


exports.log_in_get = function(req, res, next){
    res.render(
        'sign_form',
        {
            title: 'Members Only | Log in',
            form_title: 'Log in'
        }
    )
}

exports.log_in_post = passport.authenticate(
    "local", 
    {
        successRedirect: '/',
        failureRedirect:'/login'
    }    
)

exports.log_out_get =  function(req, res, next) {
  req.logout();
  res.redirect("/");
}

exports.become_member = function(req, res, next) {
    res.render(
        'member_form', 
        {
            title: 'Members Only | Become a member',
            user: res.locals.currentUser
        }
    );
}

exports.become_member_post = [
    body('password')
    .trim()
    .custom((val) => {
        if(val === process.env.CLUB_SECRET) return true;
        return false;
    }).withMessage('Incorrect password'),

    (req, res, next) => {
        const errors = validationResult(req);
        const newUser = new User({
            first_name: res.locals.currentUser.first_name,
            last_name: res.locals.currentUser.last_name,
            username: res.locals.currentUser.username,
            password: res.locals.currentUser.password,
            membership_status: 'Member',
            _id: res.locals.currentUser._id
        });

        if(!errors.isEmpty()){
            res.render(
                'member_form', 
                {
                    title: 'Members Only | Become a member',
                    user: res.locals.currentUser,
                    errors: errors.array()
                }
            );
        return;
        }
        else{
            User.findByIdAndUpdate(res.locals.currentUser._id, newUser, {}, function(err, nUser){
                if(err){
                    return next(err);
                }
                res.redirect('/');
            });
        }
    }
];