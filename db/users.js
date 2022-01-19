const knex = require("./knex");

function createUser(user) {
    return knex("users").insert(user);
}

function getUsers() {
    return knex("users").select("*");
}

function getUser(id) {
    return knex("users").where("id", id).select("id", "name", "email");
}

function deleteUser(id) {
    return knex("users").where("id", id).delete();
}

function updateUser(id, User) {
    return knex("users").where("id", id).update(User);
}

function getUserByEmail(email) {
    return knex("users").where("email", email).select("*").first();
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    getUserByEmail,
    updateUser,
    deleteUser
}