import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTable } from "../utils/api";

const SeatReservation = () => {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);

  const [formData, setFormData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    readReservation({ reservation_id }, controller.signal)
      .then(setReservation)
      .catch(setError);

    listTables({}, controller.signal).then(setTables).catch(setError);
    return () => {
      controller.abort();
    };
  }, [reservation_id]);

  function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();

    const data = { reservation_id, table_id: formData };
    updateTable(data, controller.signal)
      .then(() => {
        history.push("/dashboard");
      })
      .catch(setError);

    return () => controller.abort();
  }

  function handleChange(event) {
    setFormData(event.target.value);
  }

  function handleCancel() {
    history.go(-1);
  }

  return (
    <div>
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <p>{`# ${reservation.reservation_id} - ${reservation.first_name} ${reservation.last_name} on ${reservation.reservation_date} at ${reservation.reservation_time} for ${reservation.people}`}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Seat at:</label>
        <select
          name="table_id"
          id="table_id"
          className="form-control"
          required
          value={formData}
          onChange={handleChange}
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>

        <button className="btn btn-secondary my-3 mr-3" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-primary my-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SeatReservation;
