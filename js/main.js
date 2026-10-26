/* ============================================================
   Registan Travel — js/main.js
   Booking page only: live price + submit validation (no reload).
   ============================================================ */

var form      = document.getElementById("booking-form");
var tourSel   = document.getElementById("tour");
var travInput = document.getElementById("travellers");
var priceBox  = document.getElementById("price-box");
var msgBox    = document.getElementById("form-msg");

/* ---------- helpers ---------- */

function getTour() {
  var opt = tourSel.options[tourSel.selectedIndex];
  return { name: opt.getAttribute("data-name"), price: parseFloat(opt.value) };
}

function getTravellers() {
  var n = parseInt(travInput.value, 10);
  if (isNaN(n) || n < 1) { n = 1; }   // keep the value inside 1–12 while typing
  if (n > 12)            { n = 12; }
  return n;
}

/* ---------- live price (fires when the tour or travellers change) ---------- */

function updatePrice() {
  var tour     = getTour();
  var people   = getTravellers();
  var subtotal = tour.price * people;
  var total    = subtotal;

  var text = "Total: " + people + " × " + tour.price + " USD = " + subtotal + " USD";

  if (people >= 5) {                                  // groups of 5+ get 10% off
    total = Math.round(subtotal * 0.9 * 100) / 100;   // max 2 decimals
    text += " → 10% group discount = " + total + " USD";
  }

  priceBox.textContent = text;
  return { tour: tour, people: people, total: total };
}

tourSel.addEventListener("change", updatePrice);
travInput.addEventListener("input", updatePrice);

/* ---------- validation on submit ---------- */

form.addEventListener("submit", function (event) {
  event.preventDefault();                             // no page reload

  var nameField  = document.getElementById("name");
  var emailField = document.getElementById("email");
  var problems   = [];

  nameField.classList.remove("field-error");          // reset previous state
  emailField.classList.remove("field-error");
  msgBox.className = "form-msg";                      // hide the old message

  if (nameField.value.trim() === "") {                // empty name
    problems.push("Please write your name.");
    nameField.classList.add("field-error");
  }

  if (emailField.value.indexOf("@") === -1) {         // email without @
    problems.push("Email must contain @.");
    emailField.classList.add("field-error");
  }

  if (problems.length > 0) {                          // red error message
    msgBox.textContent = problems.join(" ");
    msgBox.classList.add("error");
    return;
  }

  var data = updatePrice();                           // green confirmation
  msgBox.textContent =
    "Thank you, " + nameField.value.trim() + "! Your request for “" + data.tour.name +
    "” (" + data.people + " traveller" + (data.people > 1 ? "s" : "") + ") is received. " +
    "Total: " + data.total + " USD. We will write to " + emailField.value.trim() + " soon.";
  msgBox.classList.add("success");
});

updatePrice();   // show the total for the default choice on page load