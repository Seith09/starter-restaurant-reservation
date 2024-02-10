import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";

import ReservationForm from "../reservations/ReservationForm";

import TableForm from "../tables/TableForm";
import SeatReservation from "../reservations/SeatReservation";
import ReservationSearch from "../reservations/ReservationSearch";
import ReservationEdit from "../reservations/ReservationEdit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <ReservationEdit />
      </Route>
      <Route exact={true} path="/search">
        <ReservationSearch />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
