function addRecord(sender) {
    let grid = document.getElementById("recordGrid");

    // create Div container
    let newDiv = document.createElement("div");
    let newAttribute = document.createAttribute("class");
    newAttribute.value = "batchItem";
    newDiv.attributes.setNamedItem(newAttribute);

    grid.appendChild(newDiv)

    // Add date
    let newControl = document.createElement("input");
    newAttribute = document.createAttribute("type");
    newAttribute.value = "date";
    newControl.attributes.setNamedItem(newAttribute);
    newAttribute = document.createAttribute("name");
    newAttribute.value = "DueDate";
    newControl.attributes.setNamedItem(newAttribute);

    newDiv.appendChild(newControl);


    // Add Title
    newControl = document.createElement("input");
    newAttribute = document.createAttribute("type");
    newAttribute.value = "text";
    newControl.attributes.setNamedItem(newAttribute);
    newAttribute = document.createAttribute("name");
    newAttribute.value = "Title";
    newControl.attributes.setNamedItem(newAttribute);

    newDiv.appendChild(newControl);

    // Add Description
    newControl = document.createElement("input");
    newAttribute = document.createAttribute("type");
    newAttribute.value = "text";
    newControl.attributes.setNamedItem(newAttribute);
    newAttribute = document.createAttribute("name");
    newAttribute.value = "Description";
    newControl.attributes.setNamedItem(newAttribute);

    newDiv.appendChild(newControl);

    // Add Description
    newControl = document.createElement("input");
    newAttribute = document.createAttribute("type");
    newAttribute.value = "button";
    newControl.attributes.setNamedItem(newAttribute);
    newAttribute = document.createAttribute("class");
    newAttribute.value = "button";
    newControl.attributes.setNamedItem(newAttribute);

    newAttribute = document.createAttribute("value");
    newAttribute.value = "X";
    newControl.attributes.setNamedItem(newAttribute);

    newControl.addEventListener('click', () => {
         deleteRecord(newControl);
    });
    newDiv.appendChild(newControl);

}

function deleteRecord(sender) {

    console.log(sender);
    console.log(sender.parentElement);
    
    if (sender.parentElement) {
        sender.parentElement.remove();
    }
}