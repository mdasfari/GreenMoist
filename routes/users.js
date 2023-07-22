/*var express = require('express');
const mdb = require('bin/_mdbConfig');
var router = express.Router();
*/
/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const navMenu = require('../routes/_navigation');
const users = require('../models/user');
const pagetitle = require('../models/pageInformation');

// Validator
const {body , validationResult } = require('express-validator');

// Page Information
pagetitle.brand = process.env.APP_NAME;
pagetitle.route = "Users";

// All Tasks - Get
router.get('/', async (req, res) => {
  pagetitle.page = null;
  res.render('users/users', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, users: await users.findAllUsers() });
});

// Details - Get
router.get('/details/:id', async (req, res) => {
  pagetitle.page = "Details";
  let user = await users.findUserByUserID([req.params.id]);
  res.render('users/details', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user });
});

// New Get
router.get('/new', async (req, res) => {
  pagetitle.page = "New";
  
  let user = users.createUser();
  user.form = {
    new: 'new'
    , action: '/users'
  };

  res.render('users/new', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user});
  console.log(`${pagetitle.title()} page renderd`);
});

// New POST
router.post('/'
  , body('Username').not().isEmpty().withMessage('Username is required')
      .isLength({max: 60}).withMessage('Maximum Length is 60').trim().escape()
      .custom(async function (username) {
        let user = await users.findUserByUsername(username);
        if (user) {
          return await Promise.reject("Username already exists!");
        }
      })
  , async (req, res) => {
      pagetitle.page = "New";
      
      let user = req.body;
      user.form = {
        new: 'new'
        , action: '/users'
      };
      
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        user.errors = errors.array();
        return res.render('users/new', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user });
      }

      if ((await users.insertUser(user)).affectedRows != 1) {
        user.errors = [];
        user.errors.push({
          value: '',
          msg: 'Unable to post the record',
          param: 'form',
          location: 'body'
        });

        return res.render('users/new', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user});
      }

      res.redirect('/Users', );

      console.log('Finished User Creation!!!');
});

// Edit - Get
router.get('/edit/:id', async (req, res) => {
  pagetitle.page = "Edit";
  
  let user = await users.findUserByUserID([req.params.id]);
  user.form = {
    edit: 'edit'
    , action: '/users/edit'
  };

  res.render('users/new', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user});
  console.log(`${pagetitle.title()} page renderd`);
});

// Edit - Post
router.post('/edit'
, body('Username').not().isEmpty().withMessage('Username is required')
.isLength({max: 60}).withMessage('Maximum Length is 60').trim().escape()
.custom(async function (username, {req}) {
      let user = await users.findUserByUsername(username);

      if (user && user.UserID != req.body.UserID) {
        return await Promise.reject("Username already exists!");
      }
})
, async (req, res) => {

  pagetitle.page = "Edit";
  let user = req.body;
  user.form = {
    edit: 'edit'
    , action: '/users/edit'
  };

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    user.errors = errors.array();
    return res.render('users/new', { ttitle: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user});
  }

  if ((await users.updateUser(user)).affectedRows != 1) {
    user.errors = [];
        user.errors.push({
          value: '',
          msg: 'Unable to update the record',
          param: 'form',
          location: 'body'
        });

    return res.render('users/new', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, user: user});
  }
  res.redirect('/users');
});

// Delete
router.delete('/' , async (req, res) => {
  return res.send(await users.deleteUser(req.body.RecordID));
});

module.exports = router;