const express = require('express');
const router = express.Router();

router.use(express.json());

// All Tasks - Get
router.get('/status', async (request, response)=>{
  let result = '{'

  for (let i = 0; i < 1000; i++)
  {
    result = result + '"Item' + i + '":"Value' + i + '"';
  }
  result = result + '}';

  response.json(result);
});

// Post Something
router.post('/record', async (request, response)=>{

  if (!request.body)
  {
    console.log("No data defined")
    return response.sendStatus(400);
  }

  console.log("Data Received")
  console.log(request.body)
  

  return response.status(201).json(request.body);
  // response.json(request.body);
});

module.exports = router;