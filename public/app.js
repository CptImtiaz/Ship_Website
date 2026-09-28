// ============================================================
// SEAESCAPE BOAT RENTAL - JAVASCRIPT
// ============================================================

const packageSelect = document.getElementById("package");
const durationSelect = document.getElementById("duration");
const boatSelect = document.getElementById("boat");
const addonCheckboxes = [...document.querySelectorAll(".addons input[type=checkbox]")];
const baseFee = document.getElementById("baseFee");
const hourlyLabel = document.getElementById("hourlyLabel");
const hourlyFee = document.getElementById("hourlyFee");
const boatLabel = document.getElementById("boatLabel");
const boatFee = document.getElementById("boatFee");
const tripSubtotal = document.getElementById("tripSubtotal");
const addonTotal = document.getElementById("addonTotal");
const grandTotal = document.getElementById("grandTotal");
const form = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const dateInput = document.getElementById("date");
const payBtn = document.getElementById("payBtn");
const kelongRateTypeField = document.getElementById("kelongRateTypeField");
const kelongRateType = document.getElementById("kelongRateType");
const kelongDurationField = document.getElementById("kelongDurationField");
const kelongDuration = document.getElementById("kelongDuration");
const kelongSummaryLabel = document.getElementById("kelongSummaryLabel");
const kelongFee = document.getElementById("kelongFee");

// ============================================================
// PRICING DATA
// ============================================================

const PRICING = {
  boat:      { base: 100, perHour: 40 },
  fishing:   { base: 210, perHour: 40 },
  boathouse: { base: 700, perHour: 20 }
};

const KELONG_RATES = {
  weekday: { 12: 400, 24: 600 },
  weekend: { 12: 500, 24: 800 }
};

const BOAT_SURCHARGE = {
  fishing: 0,
  speedboat: 100,
  recreational: 80,
  luxury: 350,
  commercial: 150
};

const BOAT_NAMES = {
  fishing: "Fishing Boat",
  speedboat: "Speedboat",
  recreational: "Recreational Boat",
  luxury: "Luxury Yacht",
  commercial: "Commercial Vessel"
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function money(value) {
  return `RM ${Number(value).toFixed(0)}`;
}

function calculatePrice() {
  const pkg = packageSelect.value;
  const hours = Number(durationSelect.value);
  const boat = boatSelect.value;
  const kelongType = kelongRateType.value;
  const kelongHours = Number(kelongDuration.value || 12);

  let experienceBase = 0;
  let hourlyCharge = 0;
  let boatCharge = 0;
  let mainTripPrice = 0;
  let kelongCharge = 0;

  if (pkg === "kelong") {
    // Kelong Experience is itself the main product.
    const requiredType = kelongType === "na" ? "weekday" : kelongType;
    if (kelongRateType.value === "na") {
      kelongRateType.value = requiredType;
    }

    kelongCharge = KELONG_RATES[requiredType][hours] || 0;
    experienceBase = kelongCharge;
    mainTripPrice = kelongCharge;

    baseFee.textContent = money(kelongCharge);
    hourlyLabel.textContent = `${requiredType === "weekend" ? "Weekend / Public Holiday" : "Weekday"} • ${hours} hours`;
    hourlyFee.textContent = "Fixed rate";
    boatLabel.textContent = "Return boat transfer";
    boatFee.textContent = "Included";
    kelongSummaryLabel.textContent = "Kelong Aladdin";
    kelongFee.textContent = "Included as main experience";
  } else {
    experienceBase = PRICING[pkg].base;
    hourlyCharge = PRICING[pkg].perHour * hours;
    boatCharge = BOAT_SURCHARGE[boat];
    mainTripPrice = experienceBase + hourlyCharge + boatCharge;

    if (kelongType === "weekday" || kelongType === "weekend") {
      kelongCharge = KELONG_RATES[kelongType][kelongHours] || 0;
      kelongSummaryLabel.textContent =
        `Kelong • ${kelongType === "weekend" ? "Weekend / Public Holiday" : "Weekday"} • ${kelongHours}h`;
      kelongFee.textContent = money(kelongCharge);
    } else {
      kelongSummaryLabel.textContent = "Kelong";
      kelongFee.textContent = "N/A";
    }

    baseFee.textContent = money(experienceBase);
    hourlyLabel.textContent = `${hours} hours × RM ${PRICING[pkg].perHour}`;
    hourlyFee.textContent = money(hourlyCharge);
    boatLabel.textContent = BOAT_NAMES[boat];
    boatFee.textContent = boatCharge === 0 ? "Included" : money(boatCharge);
  }

  const addonsPrice = addonCheckboxes
    .filter(checkbox => checkbox.checked)
    .reduce((sum, checkbox) => sum + Number(checkbox.value), 0);

  const subtotal = mainTripPrice + (pkg === "kelong" ? 0 : kelongCharge);

  tripSubtotal.textContent = money(subtotal);
  addonTotal.textContent = money(addonsPrice);
  grandTotal.textContent = money(subtotal + addonsPrice);

  return {
    experienceBase,
    hourlyCharge,
    boatCharge,
    kelongCharge,
    base: subtotal,
    addons: addonsPrice,
    total: subtotal + addonsPrice
  };
}

function updatePackageFields() {
  const isKelongExperience = packageSelect.value === "kelong";
  const currentDuration = durationSelect.value;
  const currentKelongType = kelongRateType.value;

  if (isKelongExperience) {
    // Kelong Experience must be weekday or weekend; N/A is not allowed.
    kelongRateType.innerHTML =
      '<option value="weekday">Weekday</option>' +
      '<option value="weekend">Weekend / Public Holiday</option>';

    kelongRateType.value =
      currentKelongType === "weekend" ? "weekend" : "weekday";

    durationSelect.innerHTML =
      '<option value="12">12 hours</option>' +
      '<option value="24">24 hours</option>';

    durationSelect.value =
      ["12","24"].includes(currentDuration) ? currentDuration : "12";

    kelongDurationField.hidden = true;
  } else {
    // Every other package may be booked with no Kelong, weekday Kelong, or weekend Kelong.
    kelongRateType.innerHTML =
      '<option value="na">N/A — No kelong</option>' +
      '<option value="weekday">Weekday</option>' +
      '<option value="weekend">Weekend / Public Holiday</option>';

    kelongRateType.value =
      ["na","weekday","weekend"].includes(currentKelongType)
        ? currentKelongType
        : "na";

    durationSelect.innerHTML =
      '<option value="2">2 hours</option>' +
      '<option value="4">4 hours</option>' +
      '<option value="6">6 hours</option>' +
      '<option value="8">8 hours</option>';

    durationSelect.value =
      ["2","4","6","8"].includes(currentDuration) ? currentDuration : "6";

    kelongDurationField.hidden = kelongRateType.value === "na";
  }

  calculatePrice();
}

function updateKelongOptions() {
  if (packageSelect.value !== "kelong") {
    kelongDurationField.hidden = kelongRateType.value === "na";
  }
  calculatePrice();
}

function formatDateTime(date, time) {
  const dateObj = new Date(date);
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return `${dateObj.toLocaleDateString('en-US', options)} at ${time}`;
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || name.length < 3) {
    showMessage("Please enter a valid full name", "error");
    return false;
  }

  if (!phone || phone.length < 9) {
    showMessage("Please enter a valid phone number", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showMessage("Please enter a valid email address", "error");
    return false;
  }

  return true;
}

function showMessage(message, type = "info") {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  
  if (type === "success") {
    formMessage.style.backgroundColor = "#d4edda";
    formMessage.style.color = "#155724";
  } else if (type === "error") {
    formMessage.style.backgroundColor = "#f8d7da";
    formMessage.style.color = "#721c24";
  }
}

// ============================================================
// EVENT LISTENERS - CALCULATE PRICE ON CHANGE
// ============================================================

[durationSelect, boatSelect, kelongDuration, ...addonCheckboxes].forEach(element => {
  element.addEventListener("change", calculatePrice);
});
kelongRateType.addEventListener("change", updateKelongOptions);
packageSelect.addEventListener("change", updatePackageFields);

// ============================================================
// QUICK BOOK BUTTONS
// ============================================================

document.querySelectorAll("[data-package]").forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    packageSelect.value = button.dataset.package;
    updatePackageFields();
    
    // Smooth scroll to booking form
    setTimeout(() => {
      document.getElementById("book").scrollIntoView({ behavior: "smooth" });
    }, 100);
  });
});

// ============================================================
// DATE INPUT SETUP
// ============================================================

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Format date to YYYY-MM-DD
const dateString = tomorrow.toISOString().split('T')[0];
dateInput.min = dateString;
dateInput.value = dateString;

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================================
// FORM SUBMISSION - CREATE PAYMENT
// ============================================================

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMessage.textContent = "";

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Calculate final price
  const pricing = calculatePrice();

  // Collect selected add-ons
  const selectedAddons = addonCheckboxes
    .filter(cb => cb.checked)
    .map(cb => cb.getAttribute("data-name"));

  // Create booking object
  const booking = {
    package: packageSelect.value,
    date: dateInput.value,
    time: document.getElementById("time").value,
    durationHours: Number(durationSelect.value),
    kelongRateType: kelongRateType.value === "na" ? "N/A" : kelongRateType.value,
    kelongDurationHours: packageSelect.value === "kelong"
      ? Number(durationSelect.value)
      : (kelongRateType.value === "na" ? null : Number(kelongDuration.value)),
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

  // Disable button and show loading state
  payBtn.disabled = true;
  payBtn.textContent = "🔄 Processing...";

  try {
    // Send booking to server
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to process booking");
    }

    // If payment URL returned, redirect to payment gateway
    if (data.paymentUrl) {
      showMessage("Redirecting to payment gateway...", "success");
      setTimeout(() => {
        window.location.href = data.paymentUrl;
      }, 1500);
      return;
    }

    // Demo mode: show success message with demo link
    if (data.demoUrl) {
      showMessage(`✓ Booking created! ID: ${data.bookingId}\n\nConnect your payment gateway (Stripe/iPay88/FPX) in server.js\n\nDemo link: ${data.demoUrl}`, "success");
      return;
    }

    // Payment endpoint not configured
    showMessage("✓ Booking received! Connect payment gateway in server.js", "success");

  } catch (error) {
    console.error("Booking error:", error);
    showMessage(error.message || "Error creating booking. Please try again.", "error");
  } finally {
    payBtn.disabled = false;
    payBtn.textContent = "Continue to secure payment";
  }
});

// ============================================================
// SMOOTH SCROLLING
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  calculatePrice();
  
  // Add animation to cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.experience-card, .boat-card, .step, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Log to console
  console.log('🚤 SeaEscape Boat Rental System Ready!');
  console.log('View bookings: /api/admin/bookings');
  console.log('Check pricing: /api/pricing');
});

// ============================================================
// PAYMENT GATEWAY INTEGRATION EXAMPLES
// ============================================================

/*
// STRIPE INTEGRATION
async function stripePayment(bookingId, amount, email) {
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, amount, email })
  });
  
  const { sessionId } = await response.json();
  const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
  stripe.redirectToCheckout({ sessionId });
}

// iPAY88 INTEGRATION
async function ipay88Payment(booking) {
  const paymentParams = {
    merchantCode: process.env.IPAY88_MERCHANT_CODE,
    refNo: booking.id,
    amount: (booking.amount * 100).toString(),
    currency: '458', // MYR
    prodDesc: `${booking.package} - ${booking.date}`,
    userName: booking.customer.name,
    userEmail: booking.customer.email,
    userContact: booking.customer.phone,
    backendUrl: `https://yourdomain.com/api/payment-webhook`,
    responseUrl: `https://yourdomain.com/payment-success`
  };
  // Generate signature and redirect to iPay88
}

// FPX INTEGRATION (Malaysian Online Banking)
async function fpxPayment(booking) {
  const response = await fetch('/api/fpx-create-payment', {
    method: 'POST',
    body: JSON.stringify(booking)
  });
  const { paymentUrl } = await response.json();
  window.location.href = paymentUrl;
}
*/

// ============================================================
// API HELPER FUNCTIONS
// ============================================================

async function getAvailability(date) {
  try {
    const response = await fetch(`/api/availability/${date}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching availability:', error);
    return null;
  }
}

async function getBookingStatus(bookingId) {
  try {
    const response = await fetch(`/api/booking/${bookingId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
}

async function getPricingInfo() {
  try {
    const response = await fetch('/api/pricing');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return null;
  }
}
