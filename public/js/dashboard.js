// dashboard.js - adds the saved donations to the top of the "Recent donations" table

document.addEventListener("DOMContentLoaded", function () {

  const tableBody = document.getElementById("donation-rows");
  const donations = JSON.parse(sessionStorage.getItem("foodbridgeDonations")) || [];

  // Makes one table cell. textContent shows the text as plain text only,
  // so nothing typed into the form can ever run as code (XSS-safe).
  function makeCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
  }

  // forEach runs once for every saved donation
  donations.forEach(function (donation) {
    const row = document.createElement("tr");

    makeCell(row, donation.foodItem);
    row.firstChild.className = "food-name";          // bold, like the other rows
    makeCell(row, "Not claimed yet");
    makeCell(row, donation.quantity);
    // turn "2026-11-24T16:00" into something easier to read, e.g. "Nov 24, 4:00 p.m."
    makeCell(row, new Date(donation.pickupBy).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }));

    // status badge
    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge available";
    badge.textContent = donation.status;
    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    // action button
    const actionCell = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "table-btn";
    button.textContent = "Edit";
    actionCell.appendChild(button);
    row.appendChild(actionCell);

    // prepend puts the row at the TOP of the table, so the newest is first
    tableBody.prepend(row);
  });

});