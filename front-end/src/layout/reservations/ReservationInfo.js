import React from "react";
import { cancelReservation } from "../../utils/api";
import { Link } from "react-router-dom";

function ReservationInfo({ reservation, loadDashboard }) {
  const handleCancel = (e) => {
    return window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    )
      ? cancelReservation(reservation.reservation_id).then(loadDashboard)
      : null;
  };

  return (
    <>
      <tr key={reservation.reservation_id}>
        <th scope="col">{reservation.reservation_id} </th>
        <td>{reservation.first_name} </td>
        <td>{reservation.last_name} </td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          {reservation.status === "booked" && (
            <Link
              className="btn btn-info"
              to={`/reservations/${reservation.reservation_id}/seat`}
              role="button"
            >
              Seat
            </Link>
          )}
        </td>
        <td>
          <Link
            className="btn btn-info"
            to={`/reservations/${reservation.reservation_id}/edit`}
            role="button"
          >
            Edit
          </Link>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-warning"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </td>
      </tr>
    </>
  );
}

export default ReservationInfo;
