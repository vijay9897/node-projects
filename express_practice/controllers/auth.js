const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInputs: {},
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {},
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: results.array()[0].msg,
      oldInputs: {email: email, password: password},
      validationErrors: results.array() 
    });
  }
  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInputs: {email: email, password: password},
          validationErrors: [] 
        });
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            res.redirect('/');
          });
        }
        res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInputs: {email: email, password: password},
          validationErrors: [] 
        });
      })
      .catch(err => console.log(err))
    })
    .catch(err => {
      res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: results.array()[0].msg,
      oldInput: {email: email, password: password, confirmPassword: req.body.confirmPassword},
      validationErrors: results.array()
    });
  }
  bcrypt.hash(password, 12)
    .then(hash => {
      const user = new User({
        email: email,
        password: hash,
        cart: { items: [] }
      });
      return user.save();
    }).then(result => {
      res.redirect('/login');
      // send mail to user for sucessfull signup
    }).catch(err => {
      res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset-password');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        req.flash('error', 'No account with that email found.');
        return res.redirect('/reset-password');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      //send email to user
    })
    .catch(err => {
      res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
  });
}

exports.getUpdatePassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/update-password',
      pageTitle: 'Change Password',
      errorMessage: message,
      userId: user._id.toString(),
      token: token
    })
  })
  .catch(err => {
    res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
  });
}

exports.postUpdatePassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token
  let resetUser;

  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hash => {
    resetUser.password = hash;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/');
  })
  .catch(err => {
    res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
  });
}