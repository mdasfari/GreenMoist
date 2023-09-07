/* Toggle on Select Item */
function OnChangeDisplay(control, className)
{
    if (control && control.dataset && control.dataset.itemId && control.dataset.itemValues)
    {
        control.dataset.itemId.split(',').forEach(element => {
            let dstControl = document.getElementById(element);
            if (dstControl && control.dataset.itemValues.split(',').indexOf(control.value) >= 0)
                dstControl.classList.remove(className);
            else
                dstControl.classList.add(className);
        });
    }
}

function selectOption(selectID, value) {
    const selectElement = document.getElementById(selectID);
    if (selectElement)
    {
        selectElement.value = value;
    }
}