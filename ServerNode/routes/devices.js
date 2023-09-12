const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const navMenu = require('../routes/_navigation');
const dataModel = require('../models/device');
const task = require('../models/task');
const taskProcess = require('../models/taskprocess');
const http = require('http');

// Validator
const {body , validationResult } = require('express-validator');
const generalFunctions = require('../bin/_generalFunctions');

// Page Information
const pageBrand = process.env.APP_NAME;
const routeTitle = "Devices";
const routeAddress = "devices";
let pageTitle;
let pageAddress;

// All Tasks - Get
router.get('/', async (req, res) => {
  pageTitle = null;
  pageAddress = "/list";

  console.log(await dataModel.findAll());

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

  pageModel.tasks = await task.findAll();

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
  data.form = {edit: 'edit', action: '/' + routeAddress + pageAddress };

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    data.errors = errors.array();
    return res.render(routeAddress + '/entry', 
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

    return res.render(routeAddress + '/entry', 
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





// Send Task to Device
router.post('/sendTask', async (req, res)=> {
  let data = req.body;
  let selectedDevice = await dataModel.findByID([data.DeviceID]);
  let selectedTask = await task.findByID([data.TaskID]);
  if (selectedTask) 
  {
    selectedTask.Processes = await taskProcess.findAllByTaskID([data.TaskID]);
    /* ProcessID, TaskID, ProcessSerial, ProcessType
    * , Name, Pin, PinType, SerialOutRawData, BroadcastValue
    * , ThresholdLow, ThresholdHigh, TrueProcessType, TrueProcessID, TrueDebugMessage
    * , FalseProcessType, FalseProcessID, FalseDebugMessage, ActionType
    */
    let fileName = "./export/task" + data.TaskID + ".cfg";
    let fileHandle;

    try
    {
      await fs.open(fileName, "w");
      fileHandle = await fs.open(fileName, 'w');
      await fileHandle.write(JSON.stringify(selectedTask) +"\n");
    }
    catch(err)
    {
      console.log("Error: ", err);
    }
    finally
    {
      await fileHandle?.close();
    }

     // Upload to Device
    let urlparams = {
      host: selectedDevice.RemoteAddress, //No need to include 'http://' or 'www.'
      port: '80', // selectedDevice.RemotePort?? '8080',
      path: '/configure',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', //Specifying to the server that we are sending JSON 
      }
    };

    console.log(urlparams);

    try
    {
      let request = http.request(urlparams, (res)=>{
        var data = '';
        console.log('res: ', res);
      }); //Create a request object.

      request.write(JSON.stringify(selectedTask)); //Send off the request.
      request.end(); //End the request.
    }
    catch(err)
    {
      console.log('catch: ',err);
    }

    }
    res.redirect('/devices/details/' + data.DeviceID);
});

// Bluetooth

// All Tasks - Get
router.get('/scan', async (req, res) => {
  pageTitle = null;
  pageAddress = "/ble-devices";

  const {createBluetooth} = require('node-ble')
  const {bluetooth, destroy} = createBluetooth()
  const adapter = await bluetooth.defaultAdapter()

  if (! await adapter.isDiscovering())
  await adapter.startDiscovery()

  let pageModel = {};
  pageModel.bles = adapter.devices();

  res.render(routeAddress + pageAddress, 
    { title: generalFunctions.getTitle(routeTitle, pageTitle), 
      brand: pageBrand, 
      navMenu: navMenu, 
      model: pageModel });
});

module.exports = router;
