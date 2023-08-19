const express = require('express');
const router = express.Router();
const navMenu = require('../routes/_navigation');
const tasks = require('../models/task');
const pagetitle = require('../models/pageInformation');

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
  return res.send(await tasks.delete(req.body.TaskID));
});

module.exports = router;