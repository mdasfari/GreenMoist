const express = require('express');
const router = express.Router();
const navMenu = require('./_navigation');
let pageInformation = require('../models/pageInformation');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('ENV_MODE: ', process.env.ENV_MODE);

  console.log('APP_ID: ', process.env.APP_ID);
  console.log('APP_NAME: ', process.env.APP_NAME);
  console.log('APP_DEFAULT_DATE_FORMAT: ', process.env.APP_DEFAULT_DATE_FORMAT);
  console.log('SERVER_PORT: ', process.env.SERVER_PORT);
  console.log('SERVER_URL: ', process.env.SERVER_URL);

  console.log('DATABASE: ', process.env.DATABASE);
  console.log('DATABASE_HOST: ', process.env.DATABASE_HOST);
  console.log('DATABASE_PORT: ', process.env.DATABASE_PORT);
  console.log('DATABASE_USER: ', process.env.DATABASE_USER);
  console.log('DATABASE_PASSWORD: ', process.env.DATABASE_PASSWORD);
  
  pageInformation.brand = process.env.APP_NAME;
  pageInformation.route = "Home Page";
  
  res.render('index', { title: pageInformation.title(), brand: pageInformation.brand, navMenu: navMenu});
});

module.exports = router;
