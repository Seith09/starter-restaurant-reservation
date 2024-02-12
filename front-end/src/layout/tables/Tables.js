import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function Tables() {
  const history = useHistory();
  const formInitialState = {
    table_name: "",
    capacity: 0,
  };
  const [tableForm, setTableForm] = useState({ ...formInitialState });
  const [tableError, setTableError] = useState(null);

  const handleFormChange = (e) => {
    setTableForm({
      ...tableForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = async (event) => {
    const { signal, abort } = new AbortController();
    event.preventDefault();
    try {
      tableForm.capacity = Number(tableForm.capacity);
      await createTable(tableForm, signal);
      history.push("/dashboard");
    } catch (error) {
      setTableError(error);
    }
    return () => abort();
  };

  return (
    <div>
      <h1 className="d-md-flex justify-content-center p-3">Tables</h1>
      <div>
        <ErrorAlert error={tableError} />
        <form onSubmit={handleSubmit} className="mb-3">
          <div>
            <label className="form-label">Table Name:</label>
            <input
              className="form-control mb-3"
              type="text"
              name="table_name"
              value={tableForm.table_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Table Capacity:</label>
            <input
              className="form-control mb-3"
              type="number"
              name="capacity"
              value={tableForm.capacity}
              onChange={handleFormChange}
              required
            />
          </div>
          <button className="btn btn-info mt-2 mx-2" type="submit">
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

export default Tables;
