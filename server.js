const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// IN-MEMORY BOOKING STORAGE (Replace with database in production)
const bookings = new Map();
const payments = new Map();

// ============================================================
// BOOKING ID GENERATOR
// ============================================================
function bookingId() {
  return "SEA-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
}

// ============================================================
// BOAT & PRICING DATA
// ============================================================
const BOATS = {
  fishing: { name: "Fishing Boat", category: "Fishing Boats", surcharge: 0 },
  speedboat: { name: "Speedboat", category: "Speedboats", surcharge: 100 },
  recreational: { name: "Recreational Boat", category: "Recreational Boats", surcharge: 80 },
  luxury: { name: "Luxury Yacht", category: "Luxury Yachts", surcharge: 350 },
  commercial: { name: "Commercial Vessel", category: "Commercial Vessels", surcharge: 150 }
};

const EXPERIENCES = {
  boat: { name: "Private Boat Rental", basePrice: 100, perHour: 40 },
  fishing: { name: "Fishing Adventure", basePrice: 210, perHour: 40 },
  kelong: { name: "Kelong Experience", basePrice: 350, perHour: 35 },
  boathouse: { name: "Boathouse Stay", basePrice: 700, perHour: 20 }
};

const ADDONS = {
  fishing: { name: "Fishing equipment", price: 80 },
  bbq: { name: "BBQ package", price: 60 },
  drinks: { name: "Drinks package", price: 40 },
  ice: { name: "Ice box + bait", price: 50 },
  camera: { name: "GoPro rental", price: 100 },
  guide: { name: "English-speaking guide", price: 120 }
};

// ============================================================
// API: CREATE PAYMENT
// ============================================================
app.post("/api/create-payment", async (req, res) => {
  try {
    const booking = req.body;

    if (!booking?.customer?.name || !booking?.customer?.email || !booking?.amount) {
      return res.status(400).json({ success: false, error: "Missing required booking details." });
    }

    const id = bookingId();

    // Store booking in memory (use database in production)
    bookings.set(id, {
      id,
      ...booking,
      status: "PENDING",
      createdAt: new Date(),
      boatman: "To be assigned"
    });

    console.log("Booking created:", id);

    // ============================================================
    // PAYMENT GATEWAY INTEGRATION OPTIONS
    // ============================================================
    
    // OPTION 1: STRIPE (Global, supports Malaysia)
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{ price_data: { currency: 'myr', product_data: { name: booking.package }, unit_amount: Math.round(booking.amount * 100) }, quantity: 1 }],
    //   mode: 'payment',
    //   success_url: `${process.env.DOMAIN}/payment-success?booking=${id}`,
    //   cancel_url: `${process.env.DOMAIN}/payment-cancel`,
    //   customer_email: booking.customer.email,
    // });
    // return res.json({ success: true, bookingId: id, paymentUrl: session.url });

    // OPTION 2: IPAY88 (Malaysian Payment Gateway)
    // const merchantKey = process.env.IPAY88_KEY;
    // const merchantCode = process.env.IPAY88_CODE;
    // const refNo = id;
    // const amount = (booking.amount * 100).toString();
    // const currency = '458'; // MYR
    // const prodDesc = `${booking.package} - ${booking.customer.name}`;
    // const userName = booking.customer.name;
    // const userEmail = booking.customer.email;
    // const userContact = booking.customer.phone;
    // const remark = `Boat: ${booking.boat}, Date: ${booking.date}`;
    // const backendUrl = `${process.env.DOMAIN}/api/payment-webhook`;
    // const responseUrl = `${process.env.DOMAIN}/payment-success?booking=${id}`;
    // 
    // const signature = crypto.createHash('md5').update(merchantKey + merchantCode + refNo + amount + backendUrl).digest('hex');
    // 
    // const ipay88Url = `https://www.ipay88.com/epayment/entry.asp?` +
    //   `MerchantCode=${merchantCode}&RefNo=${refNo}&Amount=${amount}&Currency=${currency}&` +
    //   `ProdDesc=${encodeURIComponent(prodDesc)}&UserName=${encodeURIComponent(userName)}&` +
    //   `UserEmail=${userEmail}&UserContact=${userContact}&Remark=${encodeURIComponent(remark)}&` +
    //   `ResponseUrl=${encodeURIComponent(responseUrl)}&BackendUrl=${encodeURIComponent(backendUrl)}&` +
    //   `Signature=${signature}`;
    // 
    // return res.json({ success: true, bookingId: id, paymentUrl: ipay88Url });

    // OPTION 3: FPX (Malaysian Online Banking)
    // Similar to iPay88, but specific to FPX protocol

    // OPTION 4: PAYMENT GATEWAY (Generic)
    // const gatewayResponse = await fetch("YOUR_GATEWAY_API", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GATEWAY_API_KEY}` },
    //   body: JSON.stringify({
    //     amount: booking.amount,
    //     currency: "MYR",
    //     orderId: id,
    //     customerName: booking.customer.name,
    //     customerEmail: booking.customer.email,
    //     customerPhone: booking.customer.phone,
    //     returnUrl: `${process.env.DOMAIN}/payment-success?booking=${id}`,
    //     callbackUrl: `${process.env.DOMAIN}/api/payment-webhook`
    //   })
    // });
    // const paymentData = await gatewayResponse.json();
    // return res.json({ success: true, bookingId: id, paymentUrl: paymentData.payment_url });

    // FOR NOW: DEMO MODE (Connect your gateway above)
    payments.set(id, {
      id,
      bookingId: id,
      status: "DEMO",
      amount: booking.amount,
      timestamp: new Date()
    });

    return res.json({
      success: true,
      bookingId: id,
      paymentUrl: null,
      message: "Demo mode: Connect your payment gateway (Stripe, iPay88, FPX) in server.js",
      demoUrl: `/payment-success?booking=${id}` // For testing only
    });

  } catch (error) {
    console.error("create-payment error:", error);
    res.status(500).json({ success: false, error: "Server error while creating payment." });
  }
});

// ============================================================
// API: PAYMENT WEBHOOK (Called by payment gateway)
// ============================================================
app.post("/api/payment-webhook", async (req, res) => {
  try {
    console.log("Payment webhook received:", req.body);

    // VERIFY PAYMENT GATEWAY SIGNATURE HERE
    // const isValid = verifyGatewaySignature(req.body);
    // if (!isValid) return res.status(403).json({ error: "Invalid signature" });

    const { transactionId, bookingId, status, amount } = req.body;

    if (bookings.has(bookingId)) {
      const booking = bookings.get(bookingId);
      booking.status = status === "COMPLETED" ? "CONFIRMED" : "FAILED";
      booking.paymentId = transactionId;
      bookings.set(bookingId, booking);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// ============================================================
// API: GET BOOKING STATUS
// ============================================================
app.get("/api/booking/:bookingId", (req, res) => {
  const booking = bookings.get(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
});

// ============================================================
// API: GET ALL BOOKINGS (Admin Dashboard)
// ============================================================
app.get("/api/admin/bookings", (req, res) => {
  // IMPORTANT: Add authentication middleware here!
  const allBookings = Array.from(bookings.values());
  res.json(allBookings);
});

// ============================================================
// API: UPDATE BOOKING STATUS (Admin)
// ============================================================
app.patch("/api/admin/booking/:bookingId", (req, res) => {
  // IMPORTANT: Add authentication middleware here!
  const booking = bookings.get(req.params.bookingId);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const { status, boatman, notes } = req.body;
  if (status) booking.status = status;
  if (boatman) booking.boatman = boatman;
  if (notes) booking.notes = notes;
  booking.updatedAt = new Date();

  bookings.set(req.params.bookingId, booking);
  res.json(booking);
});

// ============================================================
// API: GET AVAILABLE SLOTS
// ============================================================
app.get("/api/availability/:date", (req, res) => {
  const date = req.params.date;
  const dayBookings = Array.from(bookings.values()).filter(b => b.date === date && b.status === "CONFIRMED");
  
  // Simple availability check (you can make this more sophisticated)
  const bookedTimes = dayBookings.map(b => b.time);
  const allTimes = ["08:00", "09:00", "10:00", "12:00", "14:00", "16:00"];
  const available = allTimes.filter(t => !bookedTimes.includes(t));

  res.json({ date, available, booked: bookedTimes });
});

// ============================================================
// API: GET PRICING INFO
// ============================================================
app.get("/api/pricing", (req, res) => {
  res.json({
    experiences: EXPERIENCES,
    boats: BOATS,
    addons: ADDONS,
    specialPackages: {
      familyDay: { name: "Family Day Package", price: 600, includes: "4 hours, fishing, BBQ, drinks" },
      groupAdventure: { name: "Group Adventure", price: 1200, includes: "6 hours, fishing, BBQ, ice, guide" },
      honeymoonSpecial: { name: "Honeymoon Special", price: 900, includes: "6 hours, private boat, wine, camera rental" }
    }
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/health", (req, res) => {
  res.json({ success: true, service: "SeaEscape booking website", bookings: bookings.size });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🚤 SeaEscape Boat Rental System               ║
║  Running on http://localhost:${PORT}                 ║
╚════════════════════════════════════════════════╝

📌 NEXT STEPS:
1. Add payment gateway (Stripe/iPay88/FPX)
2. Connect to database (MongoDB/PostgreSQL)
3. Add user authentication
4. Deploy to production
  `);
});
