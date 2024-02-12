import React, { useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationInfo from "../reservations/ReservationInfo";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  //captures mobile number when entered in form
  const handleChange = ({ target }) => {
    setMobile(target.value);
    console.log(mobile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { signal, abort } = new AbortController();

    setError(null);

    listReservations({ mobile_number: mobile }, signal)
      .then(setReservations)
      .catch(setError);

    return () => abort();
  };

  return (
    <div>
      <h1 className="d-md-flex justify-content-center p-3">Search</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="mb-3">
        <label htmlFor="search" className="form-label">
          Seach by phone number:
        </label>
        <input
          className="form-control"
          name="mobile_number"
          id="mobile_number"
          placeholder="Enter a customer's phone number"
          onChange={handleChange}
          value={mobile}
        />
        <button className="btn btn-info mt-2" type="submit">
          Find
        </button>
      </form>

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
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <ReservationInfo
                key={reservation.reservation_id}
                reservation={reservation}
              />
            ))
          ) : (
            <tr>
              <td colSpan="11">No reservations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Search;
