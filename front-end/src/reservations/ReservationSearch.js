import React, { useState } from "react";
import ReservationTable from "../dashboard/ReservationTable";
import { searchByMobile } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

const ReservationSearch = () => {
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();
    searchByMobile({ mobile_number: formData }, controller.signal)
      .then(setReservations)
      .catch(setError);

    return () => AbortController.abort;
  }

  function handleChange(event) {
    setFormData(event.target.value);
  }

  return (
    <div className="">
      <h2>Search reservations</h2>
      <ErrorAlert error={error} />
      <form className="d-flex flex-column mt-4" onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Mobile Number</label>
        <div className="section d-flex">
          <input
            type="tel"
            name="mobile_number"
            placeholder="Enter the customer's mobile"
            className="border-3 p-1"
            value={formData}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary ml-3">
            Find
          </button>
        </div>
      </form>
      {reservations ? (
        reservations.length ? (
          <ReservationTable reservations={reservations} />
        ) : (
          <p>No reservations found</p>
        )
      ) : null}
    </div>
  );
};

export default ReservationSearch;
