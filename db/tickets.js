const knex = require("./knex")

function createTicket(ticket) {
    return knex("tickets").insert(ticket);
}

function getTicket(id) {
    return knex("tickets").where("tickets.id", id)
        .join("trips", "tickets.trip_id", "=", "trips.id")
        .select("tickets.id", "carrier_name", "departure_date", "arrival_date")
        .first();
}

function getTickets(id) {
    return knex("tickets")
        .join("trips", "tickets.trip_id", "=", "trips.id")
        .where("user_id", id)
        .select("tickets.id", "carrier_name", "departure_date", "arrival_date");
}

function ticketsLeft(tripId){
    return knex("tickets")
        .join("trips", "tickets.trip_id", "=", "trips.id")
        .where("trip_id", tripId)
        .select(knex.raw("trips.max_tickets - count(*) as tickets_left"))
        .first();
}

function deleteTicket(id) {
    return knex("tickets").where("id", id).delete();
}

function updateTicket(id, ticket) {
    return knex("tickets").where("id", id).update(ticket);
}

module.exports = {
    createTicket,
    getTicket,
    getTickets,
    ticketsLeft,
    updateTicket,
    deleteTicket
};