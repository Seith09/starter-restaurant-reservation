import React from "react";
import { useHistory } from "react-router";

function ReservationForm({ formInitialState, handleSubmit, handleFormChange }) {
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  return (
    formInitialState && (
      <div>
        <div>
          <form onSubmit={handleSubmit} className="mb-3">
            <div>
              <label className="form-label">First Name:</label>
              <input
                className="form-control mb-3"
                type="text"
                name="first_name"
                placeholder={formInitialState?.first_name || "First Name"}
                value={formInitialState?.first_name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Last Name:</label>
              <input
                className="form-control mb-3"
                type="text"
                name="last_name"
                placeholder={formInitialState?.Last_name || "Last Name"}
                value={formInitialState?.last_name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Mobile Number:</label>
              <input
                className="form-control mb-3"
                type="tel"
                name="mobile_number"
                placeholder="5555555555"
                value={formInitialState?.mobile_number}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Reservation Date:</label>
              <input
                className="form-control mb-3"
                type="date"
                name="reservation_date"
                value={formInitialState?.reservation_date}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Reservation Time:</label>
              <input
                className="form-control mb-3"
                type="time"
                name="reservation_time"
                value={formInitialState?.reservation_time}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Number of Guests</label>
              <input
                className="form-control"
                type="number"
                name="people"
                value={formInitialState?.people}
                onChange={handleFormChange}
                required
              />
            </div>
            <button className="btn btn-info mt-2 mx-2" type="submit">
              Submit
            </button>
            <button className="btn btn-warning mt-2" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default ReservationForm;
