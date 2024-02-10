import React from "react";

const ReservationTemplate = ({ handleChange, formData, handleCancel }) => {
  return (
    <fieldset>
      <div className="row me-1">
        <div className="form-group col d-flex flex-column">
          <label htmlFor="first_name" className="label">
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
        </div>
        <div className="form-group col d-flex flex-column">
          <label htmlFor="last_name" className="label">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
        </div>
        <div className="form-group col d-flex flex-column">
          <label htmlFor="mobile_number" className="label">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobile_number"
            placeholder="Mobile Number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />
        </div>
      </div>
      <div className=" row">
        <div className="form-group col d-flex flex-column">
          <label htmlFor="reservation_date" className="label">
            Date
          </label>
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
        </div>
        <div className="form-group col d-flex flex-column">
          <label htmlFor="reservation_time" className="label">
            Time
          </label>
          <input
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </div>
        <div className="form-group col d-flex flex-column">
          <label htmlFor="people" className="label">
            # of People
          </label>
          <input
            type="number"
            name="people"
            onChange={handleChange}
            value={formData.people}
            min="1"
            required
          />
        </div>
      </div>
      <button
        className="form-cancel btn btn-secondary mr-3"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button type="submit" className="form-submit btn btn-primary">
        Submit
      </button>
    </fieldset>
  );
};

export default ReservationTemplate;
