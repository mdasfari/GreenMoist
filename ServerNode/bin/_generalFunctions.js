exports.getColumns = function(modelObject) {
    var strColumns;
    for(var property in modelObject) {
        if (strColumns) {
            strColumns += ", " + property;
        } else {
            strColumns = property;
        }
    }
    return strColumns;
} 

exports.getTitle = function(routeTitle, pageTitle) {
    return `${routeTitle}${this.page ? ' - ' : ''}${this.page ? this.page : ''}`;
}

exports.getProcessTypeDisplay = function(processType) {
    let display = 'unknown';
    
    if (processType == 0)
        display = "Status";
    else if (processType == 1)
        display = "Action";
    else if (processType == 2)
        display = "Notification";

    return display;
}

exports.getPinDisplay = function(pin) {
    let display = 'unknown';
    
    if (pin >= 1 && pin <= 22)
        display = "GP" + pin;
    else if (pin >= 26 && pin <= 28)
        display = "GP" + pin + " - (Analog)";

    return display;
}

exports.getPinTypeDisplay = function(pinType) {
    let display = 'unknown';
    
    if (pinType == 0){
        display = "Analog";
    } else if (pinType == 1) {
        display = "Pulse width modulation";
    } else if (pinType == 2) {
        display = "Logical";
    }

    return display;
}

exports.getProcessWorkflowDisplay = function(processWorkflow) {
    let display = 'unknown';
    
    if (processWorkflow == 0){
        display = "Loop";
    } else if (processWorkflow == 1) {
        display = "Next Process";
    } else if (processWorkflow == 2) {
        display = "Go to Process Serial";
    } else if (processWorkflow == 3) {
        display = "Exit";
    }

    return display;
}

exports.getExecutionDisplay = function(execution) {
    let display = 'unknown';
    
    if (execution == 0){
        display = "Turn Off";
    } else if (execution == 1) {
        display = "Turn On";
    } 

    return display;
}