const packageSelect = document.getElementById("package");
const durationSelect = document.getElementById("duration");
const boatSelect = document.getElementById("boat");
const addons = [...document.querySelectorAll(".addons input[type=checkbox]")];
const tripSubtotal = document.getElementById("tripSubtotal");
const addonTotal = document.getElementById("addonTotal");
const grandTotal = document.getElementById("grandTotal");
const form = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const dateInput = document.getElementById("date");

const PRICING = {
  boat:      { base: 100, perHour: 40 },
  fishing:   { base: 210, perHour: 40 },
  kelong:    { base: 350, perHour: 35 },
  boathouse: { base: 700, perHour: 20 }
};

const BOAT_SURCHARGE = {
  small: 0,
  medium: 80,
  large: 150
};

function money(v){ return `RM ${Number(v).toFixed(0)}`; }

function calculate(){
  const pack = packageSelect.value;
  const hours = Number(durationSelect.value);
  const boat = boatSelect.value;

  const base = PRICING[pack].base + PRICING[pack].perHour * hours + BOAT_SURCHARGE[boat];
  const extras = addons.filter(a => a.checked).reduce((sum,a)=>sum+Number(a.value),0);

  tripSubtotal.textContent = money(base);
  addonTotal.textContent = money(extras);
  grandTotal.textContent = money(base + extras);

  return {base, extras, total:base+extras};
}

[packageSelect,durationSelect,boatSelect,...addons].forEach(el => {
  el.addEventListener("change", calculate);
});

document.querySelectorAll("[data-package]").forEach(btn => {
  btn.addEventListener("click", () => {
    packageSelect.value = btn.dataset.package;
    calculate();
    document.getElementById("book").scrollIntoView({behavior:"smooth"});
  });
});

const today = new Date();
const local = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().split("T")[0];
dateInput.min = local;
dateInput.value = local;
document.getElementById("year").textContent = new Date().getFullYear();
calculate();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMessage.textContent = "";

  const pricing = calculate();
  const selectedAddons = addons.filter(a=>a.checked).map(a=>a.dataset.name);

  const booking = {
    package: packageSelect.value,
    date: dateInput.value,
    time: document.getElementById("time").value,
    durationHours: Number(durationSelect.value),
    guests: Number(document.getElementById("guests").value),
    boat: boatSelect.value,
    addons: selectedAddons,
    customer: {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim()
    },
    amount: pricing.total,
    currency: "MYR"
  };

  const button = document.getElementById("payBtn");
  button.disabled = true;
  button.textContent = "Preparing payment...";

  try {
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(booking)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to start payment.");
    }

    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
      return;
    }

    formMessage.style.color = "#a35b00";
    formMessage.textContent = "Payment endpoint is working, but no paymentUrl was returned. Connect your gateway inside server.js.";
  } catch (err) {
    formMessage.style.color = "#b42318";
    formMessage.textContent = err.message;
  } finally {
    button.disabled = false;
    button.textContent = "Continue to secure payment";
  }
});