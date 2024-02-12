import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../ErrorAlert";
import { listTables, seatReservation, readReservation } from "../../utils/api";

function Seat() {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [reservation, setReservation] = useState([]);
  const [tables, setTables] = useState([]);
  const [seatTable, setSeatTable] = useState(null);
  const [error, setError] = useState([null]);

  //load tables and reservation info
  useEffect(() => {
    const abortController = new AbortController();

    async function loadData() {
      try {
        setError(null);
        const reservationResponse = await readReservation(
          reservation_id,
          abortController.signal
        );
        const tablesResponse = await listTables(abortController.signal);
        const freeTables = tablesResponse.filter((table) => {
          return table.status === "free";
        });
        setReservation(reservationResponse);
        setTables(freeTables);
      } catch (error) {
        setError(error);
      }
    }
    loadData();
    return () => abortController.abort();
  }, [reservation_id]);

  const handleCancel = () => {
    history.goBack();
  };

  const handleSelect = (e) => {
    setSeatTable(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const { signal, abort } = new AbortController();
    try {
      const seatResponse = await seatReservation(
        seatTable,
        reservation_id,
        signal
      );
      if (seatResponse) {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      }
    } catch (error) {
      setError(error);
    }
    return () => abort();
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <div>
        <h1 className="d-md-flex justify-content-center m-3">
          Select Table for Reaservation Seating
        </h1>
        <form onSubmit={handleSubmit} className="mb-3">
          <div>
            <label className="form-label mb-2">
              Seat at Table Name:
              <select
                className="form-control"
                id="table_id"
                name="table_id"
                onChange={handleSelect}
                required
              >
                <option defaultValue> Select a Table</option>
                {tables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-info mt-2 mx-2">
            Submit
          </button>
          <button onClick={handleCancel} className="btn btn-warning mt-2 mx-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Seat;
