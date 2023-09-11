

function uploadFile(){
    const form = document.querySelector('form');
    const url = 'http://192.168.19.97';
    const formData = new FormData(form);
  
    const fetchOptions = {
      method: 'post',
      body: formData
    };
  
    fetch(url, fetchOptions);

}