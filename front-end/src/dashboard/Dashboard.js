import React, { useState, useEffect } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import ReservationTable from "./ReservationTable";
import TablesTable from "./TablesTable";
import { useHistory } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard() {
  const query = useQuery();
  let date = query.get("date");
  date = date ? date : today();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables({ date }, abortController.signal)
      .then(setTables)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const history = useHistory();

  function previousClick() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  function todayClick() {
    history.push(`/dashboard?date=${today()}`);
  }

  function nextClick() {
    history.push(`/dashboard?date=${next(date)}`);
  }
  return (
    <main className="">
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="button-section">
            <button className="btn btn-secondary mr-2" onClick={previousClick}>
              Previous
            </button>
            <button className="btn btn-secondary mr-2" onClick={todayClick}>
              Today
            </button>
            <button className="btn btn-secondary mr-2" onClick={nextClick}>
              Next
            </button>
          </div>
          <ReservationTable
            reservations={reservations}
            setReservationsError={setReservationsError}
          />
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <TablesTable
            tables={tables}
            setReservationsError={setReservationsError}
          />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
