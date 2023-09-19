const express = require('express');
const router = express.Router();
const navMenu = require('./_navigation');
const pageInformation = require('../models/pageInformation');
/* GET home page. */
for(var i = 0; i < navMenu.length; i++) {
    pageInformation.route = navMenu[i].id;
    router.use(navMenu[i].url, require('./'  + navMenu[i].id));
    // console.log(`Url: ${navMenu[i].url}, id: ${'../routes/'  + navMenu[i].id}`);
}

/* Adding Interface for REST API interface */
router.use('/interface', require('./interface'));

module.exports = router;

