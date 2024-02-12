import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";

import { previous, next, today } from "../utils/date-time";
import { Link } from "react-router-dom";
import TableList from "./TableList";
import ReservationInfo from "../layout/reservations/ReservationInfo";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [resError, setResError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  // load dashboard with reservations and tables data
  function loadDashboard() {
    const abortController = new AbortController();

    setResError(null);
    setTablesError(null);
    setReservations([]);

    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setResError);

    listTables(abortController.signal)
      .then((tables) =>
        tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
      )
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="d-md-flex justify-content-center">Dashboard</h1>
      <div>
        <h4 className="d-md-flex mb-1 justify-content-center">
          Reservations for {date}
        </h4>
      </div>

      <div className="d-md-flex justify-content-center py-3">
        <Link to={`/dashboard?date=${previous(date)}`}>
          <button type="button" className="btn btn-info mx-2">
            Previous
          </button>
        </Link>
        <Link to={`/dashboard?date=${today()}`}>
          <button type="button" className="btn btn-info mx-2">
            Today
          </button>
        </Link>
        <Link to={`/dashboard?date=${next(date)}`}>
          <button type="button" className="btn btn-info mx-2">
            Next
          </button>
        </Link>
      </div>
      <div>
        <table className="table table-striped table-hover">
          <thead>
            <tr className="table-info">
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col"># of Guests</th>
              <th scope="col">Status</th>
              <th scope="col">Seat</th>
              <th scope="col">Edit</th>
              <th scope="col">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length ? (
              <>
                {reservations.map((reservation, index) => (
                  <ReservationInfo
                    key={reservation.id}
                    reservation={reservation}
                    loadDashboard={loadDashboard}
                  />
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="11">No Reservations</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="d-md-flex mb-1 justify-content-center">Table List</h4>
        <table className="table table-striped table-hover">
          <thead>
            <tr className="table-info">
              <th scope="col">ID</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => (
              <TableList
                key={table.table_id}
                table={table}
                error={tablesError}
                loadDashboard={loadDashboard}
              />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
