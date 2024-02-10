import React from "react";
import { useHistory } from "react-router";
import { updateReservationStatus } from "../utils/api";

const ReservationTable = ({ reservations, setReservationsError }) => {
  const history = useHistory();

  function handleCancel(reservation) {
    const confirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirm) {
      updateReservationStatus({
        status: "cancelled",
        reservation_id: reservation.reservation_id,
      })
        .then(() => {
          history.go(0);
        })
        .catch(setReservationsError);
    }
  }
  return (
    <div className="table-responsive mt-2">
      <table className="table no-wrap">
        <thead>
          <tr>
            <th className="border-top-0">#</th>
            <th className="border-top-0">NAME</th>
            <th className="px-4 border-top-0">PHONE</th>
            <th className="px-4 border-top-0">DATE</th>
            <th className="border-top-0">TIME</th>
            <th className="px-2 border-top-0">PEOPLE</th>
            <th className="border-top-0">STATUS</th>
            <th className="border-top-0"></th>
            <th className="border-top-0"></th>
            <th className="border-top-0"></th>
          </tr>
        </thead>
        <tbody className="">
          {reservations.map((item) => (
            <tr key={item.reservation_id}>
              <td className="text-center">{item.reservation_id}</td>
              <td className="text-center">{`${item.last_name},${item.first_name}`}</td>
              <td className="text-center">{item.mobile_number}</td>
              <td className="text-center">{item.reservation_date}</td>
              <td className="text-center">{item.reservation_time}</td>
              <td className="text-center">{item.people}</td>
              <td data-reservation-id-status={item.reservation_id}>
                {item.status}
              </td>
              {item.status === "booked" ? (
                <>
                  <td>
                    <a
                      className="btn btn-secondary"
                      href={`/reservations/${item.reservation_id}/seat`}
                    >
                      Seat
                    </a>
                  </td>
                  <td>
                    <a
                      className="btn btn-secondary"
                      href={`/reservations/${item.reservation_id}/edit`}
                    >
                      edit
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      data-reservation-id-cancel={item.reservation_id}
                      className="btn btn-secondary cancel"
                      onClick={() => handleCancel(item)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
