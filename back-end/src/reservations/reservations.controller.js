const service = require("./reservations.service.js");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

// ================= MIDDLEWARE FUNCTIONS ==================

//checking all properties are included
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

//check for valid date middleware
function isValidDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);
  if (!Number.isInteger(date)) {
    return next({
      status: 400,
      message: `please enter valid input for reservation_date`,
    });
  } else {
    return next();
  }
}

//validate if input is number
function isANumber(req, res, next) {
  const { people } = req.body.data;

  if (typeof people === "number") {
    return next();
  } else {
    return next({
      status: 400,
      message: `please use valid integer for "people"`,
    });
  }
}

//validate time format
function isValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const regex = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
  if (regex.test(reservation_time)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `please enter valid time format for reservation_time`,
    });
  }
}

//check for existing reservation in database
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservationId} does not exist`,
    });
  }
}

// ========================================================

async function list(req, res, next) {
  try {
    const { date } = req.query;
    if (date) {
      const data = await service.list(date);
      return res.json({ data });
    } else {
      const message = "date parameter is required";
      return res.status(400).json({ error: message });
    }
  } catch (error) {
    next(error);
  }
}

async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

function read(req, res) {
  const { reservation } = res.locals;

  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    isValidDate,
    isANumber,
    isValidTime,
    asyncErrorBoundary(create),
  ],
  read: [reservationExists, asyncErrorBoundary(read)],
};
