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
    , ChangeRange: null
	, TrueProcessType: null
    , TrueProcessID: null
    , TrueDebugMessage: null
	, FalseProcessType: null
    , FalseProcessID: null
    , FalseDebugMessage: null
    , ActionType: null
};

module.exports.normalizeForm = function normalizeForm(bodyForm, taskID) {
    let data = bodyForm;

    if (!bodyForm.TaskId && taskID)
        data.TaskID = taskID

    if (bodyForm.Pin == '')
        data.Pin = null;

    if (bodyForm.PinType == '')
        data.PinType = null;

    if (bodyForm.SerialOutRawData == 'on')
        data.SerialOutRawData = true;
    else
        data.SerialOutRawData = false;

    if (bodyForm.BroadcastValue == 'on')
        data.BroadcastValue = true;
    else
        data.BroadcastValue = false;

    if (bodyForm.ThresholdLow == '')
        data.ThresholdLow = null;

    if (bodyForm.ThresholdHigh == '')
        data.ThresholdHigh = null;

    if (bodyForm.ChangeRange == '')
        data.ChangeRange = null;

    if (bodyForm.TrueProcessID == '')
        data.TrueProcessID = null;
    
    if (bodyForm.TrueDebugMessage == '')
        data.TrueDebugMessage = null;

    if (bodyForm.FalseProcessID == '')
        data.FalseProcessID = null;

    if (bodyForm.FalseDebugMessage == '')
        data.FalseDebugMessage = null;

    if (bodyForm.ActionType == 'true')
        data.ActionType = true;
    else
        data.ActionType = false;

        return data;
}

// ProcessID, TaskID, ProcessSerial, ProcessType, Name, Pin, PinType, SerialOutRawData, BroadcastValue, ThresholdLow, ThresholdHigh, ChangeRange, TrueProcessType, TrueProcessID, TrueDebugMessage, FalseProcessType, FalseProcessID, FalseDebugMessage, ActionType
module.exports.create = function create(processID, taskID, processSerial, processType, name, pin, pinType, serialOutRawData, broadcastValue, thresholdLow, thresholdHigh, changeRange, trueProcessType, trueProcessID, trueDebugMessage, falseProcessType, falseProcessID, falseDebugMessage, actionType) {
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
        , ChangeRange: changeRange
        , TrueProcessType: trueProcessType
        , TrueProcessID: trueProcessID
        , TrueDebugMessage: trueDebugMessage
        , FalseProcessType: falseProcessType
        , FalseProcessID: falseProcessID
        , FalseDebugMessage: falseDebugMessage
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
                , result[0].ThresholdLow, result[0].ThresholdHigh, result[0].ChangeRange
                , result[0].TrueProcessType, result[0].TrueProcessID, result[0].TrueDebugMessage, result[0].FalseProcessType, result[0].FalseProcessID, result[0].FalseDebugMessage
                , result[0].ActionType);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(taskProcess) {
    try {
        return await mdb.pool.query("insert into taskprocesses (TaskID, ProcessSerial, ProcessType, Name, Pin, PinType, SerialOutRawData, BroadcastValue, ThresholdLow, ThresholdHigh, ChangeRange, TrueProcessType, TrueProcessID, TrueDebugMessage, FalseProcessType, FalseProcessID, FalseDebugMessage, ActionType) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [taskProcess.TaskID, taskProcess.ProcessSerial, taskProcess.ProcessType, taskProcess.Name, taskProcess.Pin, taskProcess.PinType, taskProcess.SerialOutRawData, taskProcess.BroadcastValue, taskProcess.ThresholdLow, taskProcess.ThresholdHigh, taskProcess.ChangeRange, taskProcess.TrueProcessType, taskProcess.TrueProcessID, taskProcess.TrueDebugMessage, taskProcess.FalseProcessType, taskProcess.FalseProcessID, taskProcess.FalseDebugMessage, taskProcess.ActionType]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(taskProcess) {
    try {
        return await mdb.pool.query(`Update taskprocesses set ProcessSerial = ?, ProcessType = ?, Name = ?, Pin = ?, PinType = ?, SerialOutRawData = ?
            , BroadcastValue = ?, ThresholdLow = ?, ThresholdHigh = ?, ChangeRange = ?, TrueProcessType = ?, TrueProcessID = ?, TrueDebugMessage = ?
            , FalseProcessType = ?, FalseProcessID = ?, FalseDebugMessage = ?, ActionType = ? where processid = ?`
            , [taskProcess.ProcessSerial, taskProcess.ProcessType, taskProcess.Name, taskProcess.Pin, taskProcess.PinType
                , taskProcess.SerialOutRawData, taskProcess.BroadcastValue, taskProcess.ThresholdLow, taskProcess.ThresholdHigh, taskProcess.ChangeRange
                , taskProcess.TrueProcessType, taskProcess.TrueProcessID, taskProcess.TrueDebugMessage
                , taskProcess.FalseProcessType, taskProcess.FalseProcessID, taskProcess.FalseDebugMessage
                , taskProcess.ActionType, taskProcess.ProcessID]);
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