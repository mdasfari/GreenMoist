const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    UserID: null
    , Username: null
    , Color: null    
};

module.exports.create = function create(UserID, Username, color) {
    return {
        UserID: UserID
        , Username: Username
        , Color: color
    }
};

module.exports.findAll = async function findAll() {
    try {
        return await mdb.pool.query("Select * from users");
    } catch (err) {
        throw err;
    }
};

module.exports.findByID = async function findByID(UserID) {
    try {
        const result = await mdb.pool.query("Select * from users where UserID = ?", UserID);
        if (result && result.length == 1) {
            return this.create(result[0].UserID, result[0].Username, result[0].Color);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.findByName = async function findByName(Username) {
    try {
        const result = await mdb.pool.query("Select * from users where Username = ?", [Username]);
        if (result && result.length == 1) {
            return this.create(result[0].UserID, result[0].Username, result[0].Color);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insert = async function insert(user) {
    try {
        return await mdb.pool.query("insert into users (Username, Color) values (?, ?)", [user.Username, user.Color]);
    } catch (err) {
        throw err;
    }
};

module.exports.update = async function update(user) {
    try {
        return await mdb.pool.query("Update users set Username = ?, Color = ? where UserID = ?", [user.Username, user.Color, user.UserID]);
    } catch (err) {
        throw err;
    }
};

module.exports.delete = async function deleteRecord(userID) {
    try {
        return await mdb.pool.query("Delete from users where UserID = ?", [userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;