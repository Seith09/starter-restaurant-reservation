import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationTemplate from "./ReservationTemplate";

const ReservationForm = () => {
  const _initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const history = useHistory();

  const [formData, setFormData] = useState(_initialFormState);
  const [isError, setIsError] = useState([]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const { people } = formData;
    const value = { ...formData, people: Number(people), status: "booked" };

    const controller = new AbortController();
    createReservation(value, controller.signal)
      .then((data) => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch((error) => {
        const splitError = error.message.split("|");
        setIsError(splitError);
      });

    return () => controller.abort();
  }

  function handleCancel() {
    history.goBack();
  }

  const errorMessage = (
    <div className="alert alert-danger">
      Please fix the following Errors:
      <ul>
        {isError.map((error, idx) => {
          return <li key={idx}>{error}</li>;
        })}
      </ul>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Reservation</h2>
      {isError.length ? errorMessage : null}
      <ReservationTemplate
        formData={formData}
        handleChange={handleChange}
        handleCancel={handleCancel}
      />
    </form>
  );
};

export default ReservationForm;
