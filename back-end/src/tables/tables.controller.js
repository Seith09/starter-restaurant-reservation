const service = require("./tables.service.js");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

// ================= MIDDLEWARE FUNCTIONS ==================

const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasRequiredPropertiesForTable = hasProperties("reservation_id");

//validate table_name has at least two characters
function validataCharacterLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length > 1) {
    return next();
  } else {
    return next({
      status: 400,
      message: `two or more characters required to book table_name`,
    });
  }
}

//validate if input is number
function isNumber(req, res, next) {
  const { capacity } = req.body.data;

  if (typeof capacity === "number") {
    return next();
  } else {
    return next({
      status: 400,
      message: `entry for capacity is not a valid number`,
    });
  }
}

//validate table exists
async function tableExist(req, res, next) {
  const { table_id } = req.params;

  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({
      status: 404,
      message: `Reservation ${table_id} cannot be found.`,
    });
  }
}

//validate reservation exists
async function reservationExist(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);

  if (reservation && reservation.status !== "seated") {
    res.locals.reservation = reservation;
    return next();
  } else if (reservation && reservation.status === "seated") {
    return next({
      status: 400,
      message: `reservation_id ${reservation_id} is already seated `,
    });
  } else {
    next({
      status: 404,
      message: `reservation_id ${reservation_id} cannot be found.`,
    });
  }
}

//validate table as enough seats to accomodate number of people
function validateCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (capacity >= people) {
    return next();
  } else {
    return next({
      status: 400,
      message: "not enough capacity available for number of attendees",
    });
  }
}

//middleware checks if table is free
function tableStatus(req, res, next) {
  const { status } = res.locals.table;

  if (status === "vacant") {
    return next();
  } else {
    return next({
      status: 400,
      message: `Table is occupied`,
    });
  }
}

// ========================================================

async function list(req, res) {
  const table = await service.list();
  res.json({ data: table });
}

async function create(req, res) {
  const table = await service.create(req.body.data);
  res.status(201).json({ data: table });
}

//seat a resevation at a table
async function seatTable(req, res) {
  const { table } = res.locals;
  const { table_id } = req.params;

  const { reservation_id } = res.locals.reservation;

  const updatedTableData = {
    ...table,
    table_id: table_id,
    reservation_id: reservation_id,
    status: "occupied",
  };

  const updatedTable = await service.update(updatedTableData);

  const reservationUpdate = {
    status: "seated",
    reservation_id: reservation_id,
  };
  await reservationService.update(reservationUpdate);

  res.json({ data: updatedTable });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    validataCharacterLength,
    isNumber,
    asyncErrorBoundary(create),
  ],
  seatTable: [
    hasRequiredPropertiesForTable,
    asyncErrorBoundary(tableExist),
    asyncErrorBoundary(reservationExist),
    validateCapacity,
    tableStatus,
    asyncErrorBoundary(seatTable),
  ],
};
