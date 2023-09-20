const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    RecordID: null
    , DeviceID: null
    , RecordDate: null
    , ProcessID: null
    , ProcessType: null
    , Pin: null
    , PinType: null
    , DebugMessage: null
    , Value: null
    , ThresholdLow: null
    , ThresholdHigh: null
};

module.exports.create = function create(recordID, deviceID, recordDate, processID, processType, pin, pinType, debugMessage, value, thresholdLow, thresholdHigh) {
    return {
        RecordID: recordID
        , DeviceID: deviceID
        , RecordDate: recordDate
        , ProcessID: processID
        , ProcessType: processType
        , Pin: pin
        , PinType: pinType
        , DebugMessage: debugMessage
        , Value: value
        , ThresholdLow: thresholdLow
        , ThresholdHigh: thresholdHigh
    }
};

module.exports.findAll = async function findAll() {
    try {
        return await mdb.pool.query("Select * from devicerecords");
    } catch (err) {
        throw err;
    }
};

module.exports.findByID = async function findByID(recordID) {
    try {
        const result = await mdb.pool.query("Select * from devicerecords where RecordID = ?", recordID);
        if (result && result.length == 1) {
            return this.create(result[0].RecordID, result[0].DeviceID, result[0].RecordDate, result[0].ProcessID, result[0].ProcessType, result[0].Pin, result[0].PinType, result[0].DebugMessage, result[0].Value, result[0].ThresholdLow, result[0].ThresholdHigh);
        }
    } catch (err) {
        throw err;
    }
};


module.exports.findByDeviceID = async function findByDeviceID(deviceID) {
    try {
        return await mdb.pool.query("Select * from devicerecords where DeviceID = ?", deviceID);
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(device) {
    try {
        return await mdb.pool.query("insert into devicerecords (DeviceID, RecordDate, ProcessID, ProcessType, Pin, PinType, DebugMessage, Value, ThresholdLow, ThresholdHigh) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [device.DeviceID, device.RecordDate, device.ProcessID, device.ProcessType, device.Pin, device.PinType, device.DebugMessage, device.Value, device.ThresholdLow, device.ThresholdHigh]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(device) {
    try {
        return await mdb.pool.query("Update devicerecords set ProcessID = ?, ProcessType = ?, Pin = ?, PinType = ?, DebugMessage = ?, Value = ?, ThresholdLow = ?, ThresholdHigh = ? where DeviceID = ?", [device.ProcessID, device.ProcessType, device.Pin, device.PinType, device.DebugMessage, device.Value, device.ThresholdLow, device.ThresholdHigh, device.RecordID]);
    } catch (err) {
        throw err;
    }
};

module.exports.delete = async function deleteRecord(recordID) {
    try {
        return await mdb.pool.query("Delete from devicerecords where RecordID = ?", [recordID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteByDeviceID = async function deleteByDeviceID(deviceID) {
    try {
        return await mdb.pool.query("Delete from devicerecords where DeviceID = ?", [deviceID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;