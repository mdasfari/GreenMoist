const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    ProcessID: null
	, TaskID: null
	, ProcessSerial: null
	, ProcessType: null
	, Name: null
	, Pin: null
	, PinType: null
	, ThresholdLow: null
	, ThresholdHigh: null
	, SerialOutRawData: null
	, TrueProcessID: null
	, TrueLoopIfNull: null
	, FalseProcessID: null
	, FalseLoopIfNull: null
};

// ProcessID, TaskID, ProcessSerial, ProcessType, Name, Pin, PinType, ThresholdLow, ThresholdHigh, SerialOutRawData, TrueProcessID, TrueLoopIfNull, FalseProcessID, FalseLoopIfNull
module.exports.create = function create(processID, taskID, processSerial, processType, name, pin, pinType, thresholdLow, thresholdHigh, serialOutRawData, trueProcessID, trueLoopIfNull, falseProcessID, falseLoopIfNull) {
    return {
        ProcessID: processID
        , TaskID: taskID
        , Name: name
        , ProcessSerial: processSerial
        , ProcessType: processType
        , Name: name
        , Pin: pin
        , PinType: pinType
        , ThresholdLow: thresholdLow
        , ThresholdHigh: thresholdHigh
        , SerialOutRawData: serialOutRawData
        , TrueProcessID: trueProcessID
        , TrueLoopIfNull: trueLoopIfNull
        , FalseProcessID: falseProcessID
        , FalseLoopIfNull: falseLoopIfNull
    }
};

module.exports.findAll = async function findAll() {
    try {
        return await mdb.pool.query("Select * from taskprocesses");
    } catch (err) {
        throw err;
    }
};

module.exports.findByID = async function findByID(processID) {
    try {
        const result = await mdb.pool.query("Select * from taskprocesses where processid = ?", processID);
        if (result && result.length == 1) {
            return this.create(result[0].ProcessID, result[0].TaskID, result[0].ProcessSerial, result[0].ProcessType
                , result[0].Name, result[0].Pin, result[0].PinType, result[0].ThresholdLow, result[0].ThresholdHigh
                , result[0].SerialOutRawData, result[0].TrueProcessID, result[0].TrueLoopIfNull, result[0].FalseProcessID
                , result[0].FalseLoopIfNull);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.findByTaskID = async function findByTaskID(taskID) {
    try {
        const result = await mdb.pool.query("Select * from taskprocesses where taskid = ?", [taskID]);
        if (result && result.length == 1) {
            return this.create(result[0].ProcessID, result[0].TaskID, result[0].ProcessSerial, result[0].ProcessType
                , result[0].Name, result[0].Pin, result[0].PinType, result[0].ThresholdLow, result[0].ThresholdHigh
                , result[0].SerialOutRawData, result[0].TrueProcessID, result[0].TrueLoopIfNull, result[0].FalseProcessID
                , result[0].FalseLoopIfNull);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(taskProcess) {
    try {
        return await mdb.pool.query("insert into taskprocesses (TaskID, ProcessSerial, ProcessType, Name, Pin, PinType, ThresholdLow, ThresholdHigh, SerialOutRawData, TrueProcessID, TrueLoopIfNull, FalseProcessID, FalseLoopIfNull) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [taskProcess.taskID, taskProcess.Name, taskProcess.processSerial, taskProcess.pin, taskProcess.pinType, taskProcess.thresholdLow, taskProcess.thresholdHigh, taskProcess.serialOutRawData, taskProcess.trueProcessID, taskProcess.trueLoopIfNull, taskProcess.falseProcessID, taskProcess.falseLoopIfNull]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(taskProcess) {
    try {
        return await mdb.pool.query("Update taskprocesses set ProcessSerial = ?, ProcessType = ?, Name = ?, Pin = ?, PinType = ?, ThresholdLow = ?, ThresholdHigh = ?, SerialOutRawData = ?, TrueProcessID = ?, TrueLoopIfNull = ?, FalseProcessID = ?, FalseLoopIfNull = ? where processid = ?", [taskProcess.processSerial, taskProcess.processType, taskProcess.Name, taskProcess.pin, taskProcess.pinType, taskProcess.thresholdLow, taskProcess.thresholdHigh, taskProcess.serialOutRawData, taskProcess.trueProcessID, taskProcess.trueLoopIfNull, taskProcess.falseProcessID, taskProcess.falseLoopIfNull, taskProcess.processID]);
    } catch (err) {
        throw err;
    }
};

module.exports.delete = async function deleteRecord(processID) {
    try {
        return await mdb.pool.query("Delete from taskprocesses where ProcessID = ?", [processID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;