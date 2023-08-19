const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    TaskID: null
    , Name: null
};
module.exports.create = function create(taskID, name) {
    return {
        TaskID: taskID
        , Name: name
    }
};

module.exports.findAll = async function findAll() {
    try {
        return await mdb.pool.query("Select * from tasks");
    } catch (err) {
        throw err;
    }
};

module.exports.findByID = async function findByID(taskID) {
    try {
        const result = await mdb.pool.query("Select * from tasks where TaskID = ?", taskID);
        if (result && result.length == 1) {
            return this.create(result[0].TaskID, result[0].Name);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.findByName = async function findByName(name) {
    try {
        const result = await mdb.pool.query("Select * from tasks where name = ?", [name]);
        if (result && result.length == 1) {
            return this.create(result[0].TaskID, result[0].Name);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(task) {
    try {
        return await mdb.pool.query("insert into tasks (name) values (?)", [task.Name]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(task) {
    try {
        return await mdb.pool.query("Update tasks set Name = ? where TaskID = ?", [task.Name, task.TaskID]);
    } catch (err) {
        throw err;
    }
};

module.exports.delete = async function deleteRecord(taskID) {
    try {
        return await mdb.pool.query("Delete from tasks where TaskID = ?", [taskID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;