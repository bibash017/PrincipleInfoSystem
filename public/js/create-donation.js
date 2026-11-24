// create-donation.js - saves a new donation, then goes back to the dashboard.
// Donations are kept in sessionStorage as an array of objects.

document.addEventListener("DOMContentLoaded", function () {

  const donationForm = document.getElementById("donation-form");

  donationForm.addEventListener("submit", function (event) {
    event.preventDefault();          // stop the page from reloading

    // who is logged in (saved by auth.js). If nobody is, we use a placeholder name.
    const currentUser = JSON.parse(sessionStorage.getItem("foodbridgeCurrentUser"));
    let donorName = "Your organization";
    if (currentUser) {
      donorName = currentUser.orgName;
    }

    // one donation = one object
    const newDonation = {
      foodItem: document.getElementById("food-item").value.trim(),
      quantity: document.getElementById("quantity").value.trim(),
      pickupBy: document.getElementById("pickup-by").value,      
      address: document.getElementById("address").value.trim(),
      donorName: donorName,
      status: "Available"
    };

    // load the list, add the new donation, save the list again
    const donations = JSON.parse(sessionStorage.getItem("foodbridgeDonations")) || [];
    donations.push(newDonation);
    sessionStorage.setItem("foodbridgeDonations", JSON.stringify(donations));

    window.location.href = "donor-dashboard.html";
  });

});