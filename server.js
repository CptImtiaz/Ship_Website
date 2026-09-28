const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function bookingId() {
  return "SEA-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
}

app.post("/api/create-payment", async (req, res) => {
  try {
    const booking = req.body;

    if (!booking?.customer?.name || !booking?.customer?.email || !booking?.amount) {
      return res.status(400).json({ success:false, error:"Missing required booking details." });
    }

    const id = bookingId();

    /*
      ===========================================================
      CONNECT YOUR PAYMENT GATEWAY HERE
      ===========================================================

      Replace this demo block with your existing payment API.

      Typical request sent to your gateway:
        amount: booking.amount
        currency: "MYR"
        orderId: id
        customerName: booking.customer.name
        customerEmail: booking.customer.email
        customerPhone: booking.customer.phone
        returnUrl: `${YOUR_DOMAIN}/payment-success?booking=${id}`
        callbackUrl: `${YOUR_DOMAIN}/api/payment-webhook`

      Your gateway should return a hosted checkout/payment URL.

      Example:
        const gatewayResponse = await fetch("YOUR_GATEWAY_ENDPOINT", {...});
        const paymentData = await gatewayResponse.json();
        return res.json({ success:true, bookingId:id, paymentUrl:paymentData.payment_url });
    */

    // DEMO ONLY:
    return res.json({
      success: true,
      bookingId: id,
      paymentUrl: null,
      message: "Connect your existing payment gateway in server.js."
    });

  } catch (error) {
    console.error("create-payment error:", error);
    res.status(500).json({ success:false, error:"Server error while creating payment." });
  }
});

app.post("/api/payment-webhook", async (req, res) => {
  /*
    Verify the payment gateway signature here.
    Then update booking status in your database:
      PENDING -> PAID
  */
  console.log("Payment webhook:", req.body);
  res.json({ received:true });
});

app.get("/health", (req,res) => {
  res.json({ success:true, service:"SeaEscape booking website" });
});

app.listen(PORT, () => {
  console.log(`SeaEscape running on http://localhost:${PORT}`);
});