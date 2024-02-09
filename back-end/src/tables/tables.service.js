const { response } = require("express");
const knex = require("../db/connection");

//get tables
function list(date) {
  return knex("tables").select("*").orderBy("table_name");
}

//read table by id
function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .then((response) => response[0]);
}

//post table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecorcds) => createdRecorcds[0]);
}

//update table
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedTables) => updatedTables[0]);
}

function finish(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedTables) => updatedTables[0]);
}

module.exports = {
  create,
  list,
  read,
  update,
  finish,
};
