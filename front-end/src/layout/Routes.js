import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationForm from "../reservations/ReservationForm";
import TableForm from "../tables/TableForm";
import SeatReservation from "../reservations/SeatReservation";
import ReservationSearch from "../reservations/ReservationSearch";
import ReservationEdit from "../reservations/ReservationEdit";

function RoutesComponent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/reservations" element={<Navigate to="/dashboard" />} />
      <Route path="/reservations/new" element={<ReservationForm />} />
      <Route
        path="/reservations/:reservation_id/seat"
        element={<SeatReservation />}
      />
      <Route
        path="/reservations/:reservation_id/edit"
        element={<ReservationEdit />}
      />
      <Route path="/search" element={<ReservationSearch />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tables/new" element={<TableForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesComponent;
