const express = require('express');
const router = express.Router();
const navMenu = require('../routes/_navigation');
const dataModel = require('../models/user');

// Validator
const {body , validationResult } = require('express-validator');
let pageInformation = require('../models/pageInformation');

// Page Information
pageInformation.brand = process.env.APP_NAME;
const pageRoute = "users";

// All Tasks - Get
router.get('/', async (req, res) => {
  pageInformation.page = null;
  res.render(pageRoute  + '/list', 
    { title: pageInformation.title(), 
      brand: pageInformation.brand, 
      navMenu: navMenu, 
      model: await dataModel.findAll() });
});

// Details - Get
router.get('/details/:id', async (req, res) => {
  pageInformation.page = "Details";
  res.render(pageRoute  + '/details', 
    { title: pageInformation.title(), 
      brand: pageInformation.brand, 
      navMenu: navMenu, model: await dataModel.findByID([req.params.id]) });
});

// New Get
router.get('/new', async (req, res) => {
  pageInformation.page = "New";
  
  let data = dataModel.create();
  // This to inform the new.ejs that you are in new record
  data.form = {new: 'new', action: '/' + pageRoute };

  res.render(pageRoute + '/entry', 
  { title: pageInformation.title(), 
    brand: pageInformation.brand, 
    navMenu: navMenu, model: data});
});

// New POST
router.post('/'
  , body('Username').not().isEmpty().withMessage('Username is required')
      .isLength({max: 60}).withMessage('Maximum Length is 60').trim().escape()
      .custom(async function (username) {
        let data = await dataModel.findByName(username);
        if (data) {
          return await Promise.reject("Username already exists!");
        }
      })
  , async (req, res) => {
      pageInformation.page = "New";
      
      let data = req.body;
      data.form = {new: 'new', action: '/' + pageRoute };
      
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        data.errors = errors.array();
        return res.render(pageRoute + '/entry', 
            { title: pageInformation.title(), 
              brand: pageInformation.brand, 
              navMenu: navMenu, model: data });
      }

      if ((await dataModel.insert(data)).affectedRows != 1) {
        data.errors = [];
        data.errors.push({
          value: '',
          msg: 'Unable to post the record',
          param: 'form',
          location: 'body'
        });

        return res.render(pageRoute + '/entry', 
          { title: pageInformation.title(), 
            brand: pageInformation.brand, 
            navMenu: navMenu, model: data});
      }
      res.redirect('/' + pageRoute);
});

// Edit - Get
router.get('/edit/:id', async (req, res) => {
  pageInformation.page = "Edit";
  
  let data = await dataModel.findByID([req.params.id]);
  data.form = {edit: 'edit', action: '/' + pageRoute + '/edit'};

  res.render(pageRoute + '/entry', 
    { title: pageInformation.title(), 
      brand: pageInformation.brand, 
      navMenu: navMenu, model: data});
});

// Edit - Post
router.post('/edit'
, body('Username').not().isEmpty().withMessage('Username is required')
.isLength({max: 60}).withMessage('Maximum Length is 60').trim().escape()
.custom(async function (username, {req}) {
      let data = await dataModel.findByName(username);

      if (data && data.UserID != req.body.UserID) {
        return await Promise.reject("Username already exists!");
      }
})
, async (req, res) => {

  pageInformation.page = "Edit";
  let data = req.body;
  data.form = {edit: 'edit', action: '/' + pageRoute + '/edit'
  };

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    data.errors = errors.array();
    return res.render(pageRoute + '/entry', 
    { title: pageInformation.title(), 
      brand: pageInformation.brand, 
      navMenu: navMenu, model: data});
  }

  if ((await dataModel.update(data)).affectedRows != 1) {
    data.errors = [];
        data.errors.push({
          value: '',
          msg: 'Unable to update the record',
          param: 'form',
          location: 'body'
        });

    return res.render(pageRoute + '/entry', 
      { title: pageInformation.title(), 
        brand: pageInformation.brand, 
        navMenu: navMenu, 
        model: data});
  }
  res.redirect('/' + pageRoute);
});

// Delete
router.delete('/' , async (req, res) => {
  /* the following is a bug in the code. since the insertedID is a natrural number,
  * stringify cannot handle BigInt and alos for security resones I should not return 
  * the database to the front end app. the following changed from now on
  * return res.send(await users.delete(req.body.RecordID));
  */
  let result = await dataModel.delete(req.body.RecordID);
  let stringifyed = JSON.stringify({
    affectedRows: result.affectedRows, warningStatus: result.warningStatus});
  return res.send(stringifyed);
});

module.exports = router;