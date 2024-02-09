const service = require("./reservations.service.js");
const hasProperties = require("../errors/hasProperties");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const REQUIRED = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const VALID = [
  ...REQUIRED,
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

// ================= MIDDLEWARE FUNCTIONS ==================

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

//checking if date value is in the past
function validateDateNotInPastAndNotOnTuesday(req, res, next) {
  const { data = {} } = req.body;
  const { reservation_date } = data;
  const resDate = new Date(reservation_date);
  const currentDate = new Date();
  let future = true;
  if (resDate.getUTCDay() == 2) {
    return next({
      status: 400,
      message: "restaurant is closed on tuesdays",
    });
  }
  if (currentDate.getFullYear() > resDate.getFullYear()) {
    if (currentDate.getTime() > resDate.getTime()) {
      future = false;
    }
  }
  if (!future) {
    return next({
      status: 400,
      message: "reservation must be in the future",
    });
  }
  next();
}

function reservationBefore1030AMAndAfter930PM(req, res, next) {
  const { data = {} } = req.body;
  let res_time = data.reservation_time;
  res_time = res_time.split(":");
  res_time = Number(res_time.join("."));
  if (res_time <= 10.3 || res_time >= 21.3) {
    return next({
      status: 400,
      message: "Reservation_time must be after 10:30AM and before 9:30PM",
    });
  }

  next();
}

//middleware to check reservation status
function reservationStatus(req, res, next) {
  const { status } = req.body.data;

  if (status) {
    if (status === "booked") {
      return next();
    } else {
      return next({
        status: 400,
        message: `Reservation status is ${status}, cannot create new reservation.`,
      });
    }
  } else {
    return next();
  }
}

//validate reservation status
function checkReservationStatus(req, res, next) {
  const { status } = req.body.data;

  validStatuses = ["booked", "seated", "finished", "cancelled"];
  if (validStatuses.includes(status)) {
    res.locals.status = status;

    return next();
  } else {
    return next({
      status: 400,
      message: `Reservation status is ${status}. This is invaild`,
    });
  }
}

//middleware checks if status is finished
function statusIsFinished(req, res, next) {
  const { reservation } = res.locals;

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated",
    });
  } else {
    return next();
  }
}

// ========================================================

function list(req, res) {
  const { data } = res.locals;
  res.json({ data: data });
}

async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

function read(req, res) {
  const { reservation } = res.locals;

  res.json({ data: reservation });
}

async function updateStatus(req, res) {
  const { reservation, status } = res.locals;

  const updatedReservationData = {
    ...reservation,
    status: status,
  };
  const updatedReservation = await service.update(updatedReservationData);

  res.json({ data: updatedReservation });
}

async function updateReservation(req, res) {
  const { reservation } = res.locals;

  const { data } = req.body;

  const updatedReservationData = {
    ...reservation,
    ...data,
  };
  const updatedReservation = await service.update(updatedReservationData);

  res.json({ data: updatedReservation });
}

//middleware checks the request query by date and phone
async function orderByDateAndCheckForMobile(req, res, next) {
  const { date, mobile_number } = req.query;
  if (date) {
    const reservations = await service.list(date);
    if (reservations.length) {
      res.locals.data = reservations;
      return next();
    } else {
      return next({
        status: 404,
        message: `no pending reservations for ${date}`,
      });
    }
  }
  if (mobile_number) {
    const reservation = await service.find(mobile_number);
    res.locals.data = reservation;
    return next();
  }
}

module.exports = {
  list: [orderByDateAndCheckForMobile, list],
  create: [
    hasProperties(...REQUIRED),
    isValidDate,
    isANumber,
    isValidTime,
    validateDateNotInPastAndNotOnTuesday,
    reservationBefore1030AMAndAfter930PM,
    reservationStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [
    hasProperties("status"),
    hasOnlyValidProperties("status"),
    asyncErrorBoundary(reservationExists),
    checkReservationStatus,
    statusIsFinished,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasProperties(...REQUIRED),
    isValidDate,
    isANumber,
    isValidTime,
    asyncErrorBoundary(updateReservation),
  ],
};
