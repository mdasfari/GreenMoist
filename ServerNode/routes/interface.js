const express = require('express');
const router = express.Router();

router.use(express.json());

// All Tasks - Get
router.get('/status', async (request, response)=>{
  response.json({"Status" : "Running", "id": 12, "Toooot": 200});
});

// Post Something
router.post('/record', async (request, response)=>{

  if (!request.body)
  {
    print("No data defined")
    return response.sendStatus(400);
  }

  print("Data Received")
  

  return response.status(201).json(request.body);
  // response.json(request.body);
});

module.exports = router;