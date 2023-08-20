async function deleteRecord(deleteURL, recordID, message, targetURL) {
    Swal.fire({ title: 'Delete Confirmation'
        , text: `Are you sure you want to delete ${message} record?`
        , icon: 'question'
        , confirmButtonText: 'Yes'
        , cancelButtonText: 'No'
        , showCancelButton: true
        , showCloseButton: true})
    .then(dialogResult =>{
        if (dialogResult.isConfirmed) {
            console.log("Message Box response back");
            console.log("dialof resule:", dialogResult);
            fetch(deleteURL, {
                method: 'delete'
                , headers: {'Content-Type': 'application/json'}
                , body: JSON.stringify({ RecordID: recordID })})
            .then(res => {
                console.log("delete response: ", res);
                if (res.ok) {
                    return res.json();
                }})
            .then(response => {
                console.log("response: ", response);
                if (response.affectedRows == 1) {
                    window.location = targetURL;
                }
            });
        }
    });
}

async function updateRecord() {
    fetch(deleteURL, {
        method: 'put'
        , headers: {'Content-Type': 'application/json'}
        , body: JSON.stringify({ RecordID: recordID })})
    .then(res => {
        if (res.ok) {
            return res.json();
        }})
    .then(response => {
        if (response.affectedRows == 1) {
            window.location = targetURL;
        }
    });
}

function updateGetForm(sender) {
    sender.form.submit();
}

async function checkRecord(deleteURL, recordID, message, targetURL) {
    Swal.fire({ title: 'Update Confirmation'
        , text: `Are you sure you want to update ${message} this record?`
        , icon: 'question'
        , confirmButtonText: 'Yes'
        , cancelButtonText: 'No'
        , showCancelButton: true
        , showCloseButton: true})
    .then(dialogResult =>{
        if (dialogResult.isConfirmed) {
            fetch(deleteURL, {
                method: 'put'
                , headers: {'Content-Type': 'application/json'}
                , body: JSON.stringify({ RecordID: recordID, Status: true })})
            .then(res => {
                if (res.ok) {
                    return res.json();
                }})
            .then(response => {
                if (response.affectedRows == 1) {
                    window.location = targetURL;
                }
            });
        }
    });
}