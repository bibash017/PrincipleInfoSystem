// find-food.js - shows the saved donations as cards above the example cards

document.addEventListener("DOMContentLoaded", function () {

  const listingArea = document.getElementById("new-listings");
  const donations = JSON.parse(sessionStorage.getItem("foodbridgeDonations")) || [];

  // only show donations that are still available
  const availableDonations = donations.filter(donation => donation.status === "Available");

  availableDonations.forEach(function (donation) {
    // <article class="listing"> ... </article>, the same as the example cards
    const card = document.createElement("article");
    card.className = "listing";

    const title = document.createElement("h3");
    title.textContent = donation.foodItem;           // textContent = plain text only (XSS-safe)

    const place = document.createElement("p");
    place.textContent = donation.donorName + " · " + donation.address;

    const details = document.createElement("p");
    const pickupTime = new Date(donation.pickupBy).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    details.textContent = donation.quantity + " available · Pickup by " + pickupTime;

    card.appendChild(title);
    card.appendChild(place);
    card.appendChild(details);

    // newest first
    listingArea.prepend(card);
  });

});