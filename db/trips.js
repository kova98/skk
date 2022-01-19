const knex = require("./knex");

function createTrip(trip) {
    return knex("trips").insert(trip);
}

function getTrips() {
    return knex("trips").select("*");
}

function deleteTrip(id) {
    return knex("trips").where("id", id).delete();
}

function updateTrip(id, trip) {
    return knex("trips").where("id", id).update(trip);
}

module.exports = {
    createTrip,
    getTrips,
    updateTrip,
    deleteTrip
}