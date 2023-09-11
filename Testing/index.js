

function uploadFile(){
    const form = document.querySelector('form');
    const url = 'http://10.10.15.204';
    const formData = new FormData(form);
  
    const fetchOptions = {
      method: 'post',
      body: formData
    };
  
    fetch(url, fetchOptions);

}