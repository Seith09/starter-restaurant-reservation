import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

const TableForm = () => {
  const history = useHistory();
  const _initialTableForm = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState(_initialTableForm);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const { capacity } = formData;
    const controller = new AbortController();
    createTable(
      { ...formData, capacity: Number(capacity) },
      controller.signal
    ).then(() => {
      history.push("/dashboard");
    });
    return () => controller.abort();
  }

  function handleCancel(event) {
    history.go(-1);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Table</h2>
      <fieldset>
        <div className="row">
          <div className="form-group col d-flex flex-column">
            <label htmlFor="table_name">Table Name</label>
            <input
              type="text"
              placeholder="Table Name"
              name="table_name"
              pattern=".{2,}"
              onChange={handleChange}
              value={formData.table_name}
              required
            />
          </div>
          <div className="form-group col d-flex flex-column">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              name="capacity"
              placeholder="Max Capacity"
              onChange={handleChange}
              value={formData.capacity}
              min="1"
              required
            />
          </div>
        </div>

        <div className="buttons-section">
          <button className="btn btn-secondary mr-3" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default TableForm;
