const express = require('express');
const router = express.Router();
const navMenu = require('../routes/_navigation');
const dataModel = require('../models/task');
const itemsModel = require('../models/taskProcess');

// Validator
const {body , validationResult } = require('express-validator');
const generalFunctions = require('../bin/_generalFunctions');

// Page Information
const pageBrand = process.env.APP_NAME;
const routeTitle = "Tasks";
const routeAddress = "tasks";
let pageTitle;
let pageAddress;

// All Tasks - Get
router.get('/', async (req, res) => {
  pageTitle = null;
  pageAddress = "/list";

  res.render(routeAddress + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
      navMenu: navMenu, 
      model: await dataModel.findAll() });
});

// Details - Get
router.get('/details/:id', async (req, res) => {
  pageTitle = "Details";
  pageAddress = "/details";

  let pageModel = await dataModel.findByID([req.params.id]);
  if (!pageModel)
    return;
  pageModel.items = await itemsModel.findAllByTaskID(pageModel.TaskID);

  res.render(routeAddress  + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
      navMenu: navMenu, model: pageModel  });
});

// New Get
router.get('/new', async (req, res) => {
  pageTitle = "New";
  pageAddress = '/entry';

  let data = dataModel.create();
  // This to inform the new.ejs that you are in new record
  data.form = {new: 'new', action: '/' + routeAddress };

  res.render(routeAddress + pageAddress, 
  { title: generalFunctions.getTitle(routeTitle, pageTitle), 
    brand: pageBrand, 
    navMenu: navMenu, model: data});
});

// New POST
router.post('/'
  , body('Name').not().isEmpty().withMessage('Name is required')
    .isLength({max: 100}).withMessage('Maximum Length is 100').trim().escape()
  , async (req, res) => {
      pageTitle = "New";
      pageAddress = '/entry';

      let data = req.body;
      data.form = {new: 'new', action: '/' + routeAddress };
      
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
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

        return res.render(routeAddress + pageAddress, 
          { title: generalFunctions.getTitle(routeTitle, pageTitle), 
            brand: pageBrand, 
            navMenu: navMenu, model: data});
      }
      res.redirect('/' + routeAddress);
});

// Edit - Get
router.get('/edit/:id', async (req, res) => {
  pageTitle = "Edit";
  pageAddress = '/edit';
  
  let data = await dataModel.findByID([req.params.id]);
  data.form = {edit: 'edit', action: '/' + routeAddress + pageAddress};

  res.render(routeAddress + '/entry', 
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
  pageAddress = "/edit";

  let data = req.body;
  data.form = {edit: 'edit', action: '/' + routeAddress + pageAddress
  };

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    data.errors = errors.array();
    return res.render(routeAddress + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
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

    return res.render(routeAddress + pageAddress, 
      { title: generalFunctions.getTitle(routeTitle, pageTitle), 
        brand: pageBrand, 
        navMenu: navMenu, 
        model: data});
  }
  res.redirect('/' + routeAddress);
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

// Forwards for processes
router.use('/processes', require('./tasksProcesses'));

module.exports = router;

/*

// Validator
const {body , validationResult } = require('express-validator');

// Page Information
pagetitle.brand = process.env.APP_NAME;
pagetitle.route = "Tasks";

// All Tasks - Get
router.get('/', async (req, res) => {
  pagetitle.page = null;
  res.render('tasks/list', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, tasks: await tasks.findAll() });
});

// Details - Get
router.get('/details/:id', async (req, res) => {
  pagetitle.page = "Details";
  let task = await tasks.findByID([req.params.id]);
  res.render('tasks/details', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task });
});

// New: Get
router.get('/new', async (req, res) => {
  pagetitle.page = "New";
  
  let task = tasks.create();
  task.form = {
    new: 'new'
    , action: '/tasks'
  };

  res.render('tasks/entry', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task});
  console.log(`${pagetitle.title()} page renderd`);
});

// New: POST
router.post('/'
  , body('Name').not().isEmpty().withMessage('Name is required')
      .isLength({max: 100}).withMessage('Maximum Length is 100').trim().escape()
  , async (req, res) => {
      pagetitle.page = "New";
      
      let task = req.body;
      task.form = {
        new: 'new'
        , action: '/tasks'
      };
      
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        task.errors = errors.array();
        return res.render('tasks/entry', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task });
      }

      if ((await tasks.insert(task)).affectedRows != 1) {
        task.errors = [];
        task.errors.push({
          value: '',
          msg: 'Unable to post the record',
          param: 'form',
          location: 'body'
        });

        return res.render('tasks/entry', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task});
      }

      res.redirect('/tasks', );
});

// Edit - Get
router.get('/edit/:id', async (req, res) => {
  pagetitle.page = "Edit";
  
  let task = await tasks.findByID([req.params.id]);
  task.form = {
    edit: 'edit'
    , action: '/tasks/edit'
  };

  res.render('tasks/entry', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task});
  console.log(`${pagetitle.title()} page renderd`);
});

// Edit - Post
router.post('/edit'
, body('Name').not().isEmpty().withMessage('Name is required')
      .isLength({max: 100}).withMessage('Maximum Length is 100').trim().escape()
, async (req, res) => {

  pagetitle.page = "Edit";
  let task = req.body;
  task.form = {
    edit: 'edit'
    , action: '/tasks/edit'
  };

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    task.errors = errors.array();
    return res.render('task/entry', { ttitle: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task});
  }

  if ((await tasks.update(task)).affectedRows != 1) {
    task.errors = [];
        task.errors.push({
          value: '',
          msg: 'Unable to update the record',
          param: 'form',
          location: 'body'
        });

    return res.render('tasks/entry', { title: pagetitle.title(), brand: pagetitle.brand, navMenu: navMenu, task: task});
  }
  res.redirect('/tasks');
});

// Delete
router.delete('/' , async (req, res) => {
  let result = await tasks.delete(req.body.RecordID);
  let stringifyed = JSON.stringify({affectedRows: result.affectedRows,
     warningStatus: result.warningStatus});
  return res.send(stringifyed);
});

module.exports = router;

*/