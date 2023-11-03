const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');
const session = require('express-session');





function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: '',
        };
    }
    res.render('customer/auth/signup',{ inputData: sessionData});
}





async function signup(req, res, next) {
    const helper = req.body;
    const enteredData = {
        email: helper.email,
        confirmEmail: helper['confirm-email'],
        password: helper.password,
        fullname: helper.fullname,
        street: helper.street,
        postal: helper.postal,
        city: helper.city
    };

    if (!validation.userDetailsAreValid(
        helper.email,
        helper.password,
        helper.fullname,
        helper.street,
        helper.postal,
        helper.city
    ) ||
        !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your input. Password must be at least 6 characters long, postal code must be 5 characters long.',
            ...enteredData

        }, function () {
            res.redirect('/signup');
        })
        return;
    }

    const user = new User(helper.email, helper.password, helper.fullname, helper.street, helper.postal, helper.city);

    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already! Try logging in instead! ',
                ...enteredData
            }, function () {
                res.redirect('/signup');
            });
            return;
        }
        await user.signup();
    } catch (error) {
        next(error);
        return;
    }
    res.redirect('/login');
}







function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData){
        sessionData = {
      email: '',
      password: ''
        };
    }
    res.render('customer/auth/login', { inputData: sessionData  });
}






async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    } catch (error) {
        next(error);
        return;
    }

    const sessionErrorData = {
        errorMessage: 'Invalid credentials - Please double-check your email and password!',
        email: user.email,
        password: user.password
    }

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {

            res.redirect('/login');
        })
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        })
        return;
    }
    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}






function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}






module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
};