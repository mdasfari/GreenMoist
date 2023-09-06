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
	, SerialOutRawData: null
    , BroadcastValue: null
    , ThresholdLow: null
	, ThresholdHigh: null
	, TrueProcessType: null
    , TrueProcessID: null
	, FalseProcessType: null
    , FalseProcessID: null
    , ActionType: null
};

// ProcessID, TaskID, ProcessSerial, ProcessType, Name, Pin, PinType, SerialOutRawData, BroadcastValue, ThresholdLow, ThresholdHigh, TrueProcessType, TrueProcessID, FalseProcessType, FalseProcessID, ActionType
module.exports.create = function create(processID, taskID, processSerial, processType, name, pin, pinType, serialOutRawData, broadcastValue, thresholdLow, thresholdHigh, trueProcessType, trueProcessID, falseProcessType, falseProcessID, actionType) {
    return {
        ProcessID: processID
        , TaskID: taskID
        , Name: name
        , ProcessSerial: processSerial
        , ProcessType: processType
        , Name: name
        , Pin: pin
        , PinType: pinType
        , SerialOutRawData: serialOutRawData
        , BroadcastValue: broadcastValue
        , ThresholdLow: thresholdLow
        , ThresholdHigh: thresholdHigh
        , TrueProcessType: trueProcessType
        , TrueProcessID: trueProcessID
        , FalseProcessType: falseProcessType
        , FalseProcessID: falseProcessID
        , ActionType: actionType
    }
};

module.exports.findAll = async function findAll() {
    try {
        return await mdb.pool.query("Select * from taskprocesses");
    } catch (err) {
        throw err;
    }
};

module.exports.findAllByTaskID = async function findAllByTaskID(taskID) {
    try {
        return await mdb.pool.query("Select * from taskprocesses where TaskID = ?", [taskID]);
    } catch (err) {
        throw err;
    }
};

module.exports.findByID = async function findByID(processID) {
    try {
        const result = await mdb.pool.query("Select * from taskprocesses where processid = ?", processID);
        if (result && result.length == 1) {
            return this.create(result[0].ProcessID, result[0].TaskID, result[0].ProcessSerial, result[0].ProcessType
                , result[0].Name, result[0].Pin, result[0].PinType, result[0].SerialOutRawData, result[0].BroadcastValue
                , result[0].ThresholdLow, result[0].ThresholdHigh
                , result[0].TrueProcessType, result[0].TrueProcessID, result[0].FalseProcessType, result[0].FalseProcessID
                , result[0].ActionType);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(taskProcess) {
    try {
        return await mdb.pool.query("insert into taskprocesses (TaskID, ProcessSerial, ProcessType, Name, Pin, PinType, SerialOutRawData, BroadcastValue, ThresholdLow, ThresholdHigh, TrueProcessType, TrueProcessID, FalseProcessType, FalseProcessID, ActionType) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [taskProcess.TaskID, taskProcess.ProcessSerial, taskProcess.ProcessType, taskProcess.Name, taskProcess.Pin, taskProcess.PinType, taskProcess.SerialOutRawData, taskProcess.BroadcastValue, taskProcess.ThresholdLow, taskProcess.ThresholdHigh, taskProcess.TrueProcessType, taskProcess.TrueProcessID, taskProcess.FalseProcessType, taskProcess.FalseProcessID, taskProcess.ActionType]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(taskProcess) {
    try {
        return await mdb.pool.query("Update taskprocesses set ProcessSerial = ?, ProcessType = ?, Name = ?, Pin = ?, PinType = ?, SerialOutRawData = ?, BroadcastValue = ?, ThresholdLow = ?, ThresholdHigh = ?, TrueProcessType = ?, TrueProcessID = ?, FalseProcessType = ?, FalseProcessID = ?, ActionType = ? where processid = ?", [taskProcess.processSerial, taskProcess.processType, taskProcess.name, taskProcess.pin, taskProcess.pinType, taskProcess.serialOutRawData, taskProcess.broadcastValue, taskProcess.thresholdLow, taskProcess.thresholdHigh, taskProcess.trueProcessType, taskProcess.trueProcessID, taskProcess.falseProcessType, taskProcess.falseProcessID, taskProcess.actionType, taskProcess.processID]);
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