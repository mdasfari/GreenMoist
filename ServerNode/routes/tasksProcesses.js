const express = require('express');
const router = express.Router();
const navMenu = require('../routes/_navigation');
//const dataModel = require('../models/task');
const dataModel = require('../models/taskProcess');

// Validator
const {body , validationResult } = require('express-validator');
const generalFunctions = require('../bin/_generalFunctions');

// Page Information
const pageBrand = process.env.APP_NAME;
const routeTitle = "Processes";
const routeAddress = "processes";
let pageTitle;
let pageAddress;

// Details - Get
router.get('/details/:id', async (req, res) => {
  pageTitle = "Details";
  pageAddress = "/details";

  let pageModel = await dataModel.findByID([req.params.id]);
  if (!pageModel)
    return;
  
  // Add Displays
  pageModel.ProcessTypeDisplay = generalFunctions.getProcessTypeDisplay(pageModel.ProcessType);
  pageModel.PinDisplay = generalFunctions.getPinDisplay(pageModel.Pin);
  pageModel.PinTypeDisplay = generalFunctions.getPinTypeDisplay(pageModel.PinType);
  pageModel.TrueProcessTypeDisplay = generalFunctions.getProcessWorkflowDisplay(pageModel.TrueProcessType);
  pageModel.FalseProcessTypeDisplay = generalFunctions.getProcessWorkflowDisplay(pageModel.FalseProcessType);
  pageModel.ActionTypeDisplay = generalFunctions.getExecutionDisplay(pageModel.ActionType);

  res.render(routeAddress  + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
      navMenu: navMenu, model: pageModel });
});

// New Get
router.get('/new/:taskID', async (req, res) => {
  pageTitle = "New";
  pageAddress = '/entry';

  let data = dataModel.create();
  data.TaskID = req.params.taskID;
  // This to inform the new.ejs that you are in new record
  data.form = {new: 'new', action: '/tasks/processes/new/' + req.params.taskID };

  res.render(routeAddress + pageAddress, 
  { title: generalFunctions.getTitle(routeTitle, pageTitle), 
    brand: pageBrand, 
    navMenu: navMenu, model: data});
});

// New POST
router.post('/new/:taskID'
  , body('Name').not().isEmpty().withMessage('Name is required')
    .isLength({max: 50}).withMessage('Maximum Length is 100').trim().escape()
  , async (req, res) => {
      pageTitle = "New";
      pageAddress = '/entry';

      let data = dataModel.normalizeForm(req.body, req.params.taskID);
      
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        data.form = {new: 'new', action: '/tasks/processes/new/' + req.params.taskID };
        data.errors = errors.array();
        return res.render(routeAddress + pageAddress, 
            { title: generalFunctions.getTitle(routeTitle, pageTitle), 
              brand: pageBrand, 
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

        data.form = {new: 'new', action: '/tasks/processes/new/' + req.params.taskID };
        return res.render(routeAddress + pageAddress, 
          { title: generalFunctions.getTitle(routeTitle, pageTitle), 
            brand: pageBrand, 
            navMenu: navMenu, model: data});
      }
      res.redirect('/tasks/details/' + data.TaskID);
});

// Edit - Get
router.get('/edit/:id', async (req, res) => {
  pageTitle = "Edit";
  pageAddress = '/entry';
  
  let data = await dataModel.findByID([req.params.id]);
  data.form = {edit: 'edit', action: '/tasks/processes/edit'};

  res.render(routeAddress + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
      navMenu: navMenu, 
      model: data});
});

// Edit - Post
router.post('/edit'
  , body('Name').not().isEmpty().withMessage('Name is required')
    .isLength({max: 100}).withMessage('Maximum Length is 100').trim().escape()
  , async (req, res) => {

  pageTitle = "Edit";
  pageAddress = "/entry";

  let data = dataModel.normalizeForm(req.body);
  console.log(data);

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error");
    data.errors = errors.array();
    data.form = {edit: 'edit', action: '/tasks/processes/edit/'};
    return res.render(routeAddress + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
      navMenu: navMenu, model: data});
  }

  if ((await dataModel.update(data)).affectedRows != 1) {
    console.log("Cannot update");
    data.errors = [];
        data.errors.push({
          value: '',
          msg: 'Unable to update the record',
          param: 'form',
          location: 'body'
        });
    data.form = {edit: 'edit', action: '/tasks/processes/edit/'};
    return res.render(routeAddress + pageAddress, 
      { title: generalFunctions.getTitle(routeTitle, pageTitle), 
        brand: pageBrand, 
        navMenu: navMenu, 
        model: data});
  }
  console.log("Updated");
  res.redirect('/tasks/details/' + data.TaskID);
});

// // Delete
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
