const express = require('express');
const router = express.Router();
const deviceRecord = require('../models/devicerecord');
const task = require('../models/task');
const taskprocess = require('../models/taskprocess');

router.use(express.json());

// Testing method
router.get('/status', async (request, response)=>{
  let result = '{'

  for (let i = 0; i < 1000; i++)
  {
    result = result + '"Item' + i + '":"Value' + i + '"';
  }
  result = result + '}';

  response.json(result);
});

// Get Task Data
router.get('/task/:id', async (request, response)=>{
  let data = await task.findByID([request.params.id])
  if (data){
    let processes = await taskprocess.findAllByTaskID([request.params.id])
    data.Processes = processes;
    response.status(200).json(data);
  } else {
    return response.sendStatus(204);
  }
  
});

// Post Something
router.post('/record', async (request, response)=>{
  let reqData = request.body;
  if (!reqData) {
    console.log("No data defined")
    return response.sendStatus(400);
  }

  let res = "";
  let data = deviceRecord.create(null, reqData["DeviceID"], new Date().toISOString().slice(0, 19).replace('T', ' '), reqData["ProcessID"], reqData["ProcessType"], reqData["Pin"], reqData["PinType"], reqData["DebugMessage"], reqData["Value"], reqData["ThresholdLow"], reqData["ThresholdHigh"]);
  console.log(data);

  try 
  {
    result = await deviceRecord.insert(data);

    if (result.affectedRows > 0) {
      return response.status(201).json("{'RecordID':" + result.insertId + "}");
    } else {
      return response.sendStatus(400);
    }
  }
  catch (ex)
  {
    console.log(ex)
    return response.status(415).json(ex);
  }
});

/*

1xx: Information
100 Continue	The server has received the request headers, and the client should proceed to send the request body
101 Switching Protocols	The requester has asked the server to switch protocols
103 Early Hints	Used with the Link header to allow the browser to start preloading resources while the server prepares a response
2xx: Successful
Message:	Description:
200 OK	The request is OK (this is the standard response for successful HTTP requests)
201 Created	The request has been fulfilled, and a new resource is created 
202 Accepted	The request has been accepted for processing, but the processing has not been completed
203 Non-Authoritative Information	The request has been successfully processed, but is returning information that may be from another source
204 No Content	The request has been successfully processed, but is not returning any content
205 Reset Content	The request has been successfully processed, but is not returning any content, and requires that the requester reset the document view
206 Partial Content	The server is delivering only part of the resource due to a range header sent by the client
3xx: Redirection
Message:	Description:
300 Multiple Choices	A link list. The user can select a link and go to that location. Maximum five addresses  
301 Moved Permanently	The requested page has moved to a new URL 
302 Found	The requested page has moved temporarily to a new URL 
303 See Other	The requested page can be found under a different URL
304 Not Modified	Indicates the requested page has not been modified since last requested
307 Temporary Redirect	The requested page has moved temporarily to a new URL
308 Permanent Redirect	The requested page has moved permanently to a new URL
4xx: Client Error
Message:	Description:
400 Bad Request	The request cannot be fulfilled due to bad syntax
401 Unauthorized	The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided
402 Payment Required	Reserved for future use
403 Forbidden	The request was a legal request, but the server is refusing to respond to it
404 Not Found	The requested page could not be found but may be available again in the future
405 Method Not Allowed	A request was made of a page using a request method not supported by that page
406 Not Acceptable	The server can only generate a response that is not accepted by the client
407 Proxy Authentication Required	The client must first authenticate itself with the proxy
408 Request Timeout	The server timed out waiting for the request
409 Conflict	The request could not be completed because of a conflict in the request
410 Gone	The requested page is no longer available
411 Length Required	The "Content-Length" is not defined. The server will not accept the request without it 
412 Precondition Failed	The precondition given in the request evaluated to false by the server
413 Request Too Large	The server will not accept the request, because the request entity is too large
414 Request-URI Too Long	The server will not accept the request, because the URI is too long. Occurs when you convert a POST request to a GET request with a long query information 
415 Unsupported Media Type	The server will not accept the request, because the media type is not supported 
416 Range Not Satisfiable	The client has asked for a portion of the file, but the server cannot supply that portion
417 Expectation Failed	The server cannot meet the requirements of the Expect request-header field
5xx: Server Error
Message:	Description:
500 Internal Server Error	A generic error message, given when no more specific message is suitable
501 Not Implemented	The server either does not recognize the request method, or it lacks the ability to fulfill the request
502 Bad Gateway	The server was acting as a gateway or proxy and received an invalid response from the upstream server
503 Service Unavailable	The server is currently unavailable (overloaded or down)
504 Gateway Timeout	The server was acting as a gateway or proxy and did not receive a timely response from the upstream server
505 HTTP Version Not Supported	The server does not support the HTTP protocol version used in the request
511 Network Authentication Required	The client needs to authenticate to gain network access

*/

module.exports = router;