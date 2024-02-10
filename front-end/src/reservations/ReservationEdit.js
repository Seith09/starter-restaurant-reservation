import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateEditReservation } from "../utils/api";
import ReservationTemplate from "./ReservationTemplate";

const ReservationEdit = () => {
  const _initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const { reservation_id } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState(_initialFormState);
  const [isError, setIsError] = useState([]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  useEffect(() => {
    const controller = new AbortController();

    readReservation({ reservation_id }, controller.signal)
      .then((data) => {
        const value = {
          ...data,
          reservation_date: data.reservation_date.split("T")[0],
        };
        setFormData(value);
      })
      .catch(setIsError);
    return () => controller.abort();
  }, [reservation_id, history]);

  function handleSubmit(event) {
    event.preventDefault();
    const { people } = formData;
    const value = { ...formData, people: Number(people), status: "booked" };

    const controller = new AbortController();
    updateEditReservation(value, controller.signal)
      .then((data) => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch((error) => {
        console.log(error);
        const splitError = error.message.split("|");
        setIsError(splitError);
      });

    return () => controller.abort();
  }

  function handleCancel() {
    history.push("/dashboard");
  }

  const errorMessage = (
    <div className="alert alert-danger">
      Please fix the following Errors:
      <ul>
        {isError.map((error) => {
          return <li key={error}>{error}</li>;
        })}
      </ul>
    </div>
  );
  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Reservation</h2>
      {isError.length ? errorMessage : null}
      <ReservationTemplate
        formData={formData}
        handleChange={handleChange}
        handleCancel={handleCancel}
      />
    </form>
  );
};

export default ReservationEdit;
