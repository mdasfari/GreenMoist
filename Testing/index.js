const { nextTick } = require("process");

const uploaderForm = document.getElementById("uploader");

uploaderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(e);

  // handle submit
  alert('Start Uploading file');
  console.log('Start Uploading file');

  const form = document.getElementById('uploader');
  const url = 'http://10.10.15.204';
  console.log('form ', form.enctype);
  console.log('url: ', url);

  console.log('Target: ', e.target);
  console.log('Files: ', e.target.fileupload);
  console.log('Pos 0: ', e.target.fileupload[0]);



    const fetchOptions = {
      method: 'post',
      body: e.target.fileupload[0]
    };
  
    fetch(url, fetchOptions).then((res)=>{
      console.log(res);
    });
});