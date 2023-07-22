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