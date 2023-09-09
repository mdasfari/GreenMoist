const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    DeviceID: null
    , Name: null
};

module.exports.create = function create(deviceID, name) {
    return {
        DeviceID: deviceID
        , Name: name
    }
};

module.exports.findAll = async function findAll() {
    try {
        return await mdb.pool.query("Select * from devices");
    } catch (err) {
        throw err;
    }
};

module.exports.findByID = async function findByID(deviceID) {
    try {
        const result = await mdb.pool.query("Select * from devices where DeviceID = ?", deviceID);
        if (result && result.length == 1) {
            return this.create(result[0].DeviceID, result[0].Name);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.findByName = async function findByName(name) {
    try {
        const result = await mdb.pool.query("Select * from devices where Name = ?", [name]);
        if (result && result.length == 1) {
            return this.create(result[0].DeviceID, result[0].Name);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(device) {
    try {
        return await mdb.pool.query("insert into devices (Name) values (?)", [device.Name]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(device) {
    try {
        return await mdb.pool.query("Update devices set Name = ? where DeviceID = ?", [device.Name, device.DeviceID]);
    } catch (err) {
        throw err;
    }
};

module.exports.delete = async function deleteRecord(deviceID) {
    try {
        return await mdb.pool.query("Delete from devices where UserID = ?", [userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;