const mdb = require('../bin/_mdbConfig');
const general = require('../bin/_generalFunctions');

module.exports = {
    UserID: null
    , Username: null
    , Color: null    
};

module.exports.createUser = function createUser(UserID, Username, color) {
    return {
        UserID: UserID
        , Username: Username
        , Color: color
    }
};

module.exports.findAllUsers = async function findAllUsers() {
    try {
        return await mdb.pool.query("Select * from users");
    } catch (err) {
        throw err;
    }
};

module.exports.findUserByUserID = async function findUserByUserID(UserID) {
    try {
        const result = await mdb.pool.query("Select * from users where UserID = ?", UserID);
        if (result && result.length == 1) {
            return this.createUser(result[0].UserID, result[0].Username, result[0].Color);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.findUserByUsername = async function findUserByUsername(Username) {
    try {
        const result = await mdb.pool.query("Select * from users where Username = ?", [Username]);
        if (result && result.length == 1) {
            return this.createUser(result[0].UserID, result[0].Username, result[0].Color);
        }
    } catch (err) {
        throw err;
    }
};

module.exports.insertUser = async function inserUser(user) {
    try {
        return await mdb.pool.query("insert into users (Username, Color) values (?, ?)", [user.Username, user.Color]);
    } catch (err) {
        throw err;
    }
};

module.exports.updateUser = async function updateUser(user) {
    try {
        return await mdb.pool.query("Update users set Username = ?, Color = ? where UserID = ?", [user.Username, user.Color, user.UserID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteUser = async function deleteUser(userID) {
    try {
        return await mdb.pool.query("Delete from users where UserID = ?", [userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = general.getColumns;