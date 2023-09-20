const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    DeviceID: null
    , Name: null
    , RemoteAddress: null
    , RemotePort: null
    , SerialNumber: null
    , Version: null
};

module.exports.create = function create(deviceID, name, remoteAddress, remotePort, serialNumber, version) {
    return {
        DeviceID: deviceID
        , Name: name
        , RemoteAddress: remoteAddress
        , RemotePort: remotePort
        , SerialNumber: serialNumber
        , Version: version
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
            return this.create(result[0].DeviceID, result[0].Name, result[0].RemoteAddress, result[0].RemotePort, result[0].SerialNumber, result[0].Version);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.findByName = async function findByName(name) {
    try {
        const result = await mdb.pool.query("Select * from devices where Name = ?", [name]);
        if (result && result.length == 1) {
            return this.create(result[0].DeviceID, result[0].Name, result[0].RemoteAddress, result[0].RemotePort, result[0].SerialNumber, result[0].Version);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(device) {
    try {
        return await mdb.pool.query("insert into devices (Name, RemoteAddress, RemotePort, SerialNumber, Version) values (?, ?, ?, ?, ?)", [device.Name, device.RemoteAddress, device.RemotePort, device.SerialNumber, device.Version]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(device) {
    try {
        return await mdb.pool.query("Update devices set Name = ?, RemoteAddress = ?, RemotePort = ?, SerialNumber = ?, Version = ? where DeviceID = ?", [device.Name, device.RemoteAddress, device.RemotePort, device.SerialNumber, device.Version, device.DeviceID]);
    } catch (err) {
        throw err;
    }
};

module.exports.delete = async function deleteRecord(deviceID) {
    try {
        return await mdb.pool.query("Delete from devices where DeviceID = ?", [deviceID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;