# SeaEscape Booking Website

Modern responsive starter website for:

- Private boat rental
- Fishing trips
- Kelong experiences
- Boathouse stays
- Online booking
- Add-ons
- Dynamic price calculation
- Existing payment-gateway integration

## Run locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Connect your payment gateway

Open:

```text
server.js
```

Find:

```js
app.post("/api/create-payment", ...)
```

Replace the demo section with your existing gateway API call.

The frontend expects:

```json
{
  "success": true,
  "paymentUrl": "https://your-gateway.com/checkout/..."
}
```

The customer will automatically be redirected to that URL.

## Payment webhook

Use:

```text
POST /api/payment-webhook
```

Verify your provider's signature before marking an order as paid.

## Before production

Add a database for:

- customers
- bookings
- boats
- boatmen
- availability
- payments
- add-ons
- promo codes

Also replace demo photos, phone number, email, company name, departure location, prices and policies.
