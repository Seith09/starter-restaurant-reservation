import React from "react";
import { unassignTable } from "../utils/api";

function TableList({ table, loadDashboard }) {
  async function handleClick() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishHandler();
    }
  }

  async function finishHandler() {
    const { signal } = new AbortController();
    await unassignTable(table.table_id, signal);
    loadDashboard();
  }

  return (
    <>
      <tr key={table.table_id}>
        <th scope="col">{table.table_id} </th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "occupied" : "free"}
        </td>
        <td>
          {table.reservation_id && (
            <button
              data-table-id-finish={table.table_id}
              onClick={handleClick}
              type="button"
              className="btn btn-warning"
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    </>
  );
}

export default TableList;
