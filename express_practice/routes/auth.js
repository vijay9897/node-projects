const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
        body('password', 'Please enter a password with only number and text and atleast 5 characters.').isLength({ min: 5 }).isAlphanumeric().trim()
    ],
    authController.postLogin
);

router.post('/signup',
    [
        body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
            return User.findOne({email: value})
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already registered.');
                }
            });
        }).normalizeEmail(),
        body('password', 'Please enter a password with only number and text and atleast 5 characters.').isLength({min: 5}).isAlphanumeric().trim(),
        body('confirmPassword').custom((value ,{ req }) => {
            if (value !== req.body.password) {
                throw new Error('Password didn\'t match.');
            }
            return true;
        })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/update-password/:token', authController.getUpdatePassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;