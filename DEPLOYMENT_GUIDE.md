# 🚀 SEAESCAPE DEPLOYMENT GUIDE - STEP BY STEP

This guide will help you deploy SeaEscape website to the internet in 30 minutes.

---

## STEP 1: PREPARE YOUR COMPUTER

### Install Node.js (Required)

1. Go to https://nodejs.org
2. Download **LTS version** (Long Term Support)
3. Click "Install"
4. Accept all defaults
5. Restart your computer

**Verify installation**:
```bash
node --version
npm --version
```

Should show version numbers (e.g., v18.17.0)

---

## STEP 2: PREPARE YOUR FILES

### Get Website Files

1. Extract the `seaescape-boat-booking-website.zip` file
2. Copy all files to a folder (e.g., `C:\seaescape` or `~/seaescape`)

### Install Dependencies

1. Open Terminal/Command Prompt
2. Navigate to your folder:
```bash
cd C:\seaescape
# or on Mac/Linux
cd ~/seaescape
```

3. Install packages:
```bash
npm install
```

This downloads necessary code. Takes 1-2 minutes.

---

## STEP 3: TEST LOCALLY (OPTIONAL)

### Run on Your Computer

```bash
npm start
```

You should see:
```
🚤 SeaEscape Boat Rental System
Running on http://localhost:3000
```

**Test it**:
1. Open browser
2. Go to http://localhost:3000
3. Try booking something
4. Click payment button (will show demo message)

**Stop**: Press `Ctrl+C` in terminal

---

## STEP 4: DEPLOY TO RAILWAY (EASIEST)

Railway is the easiest way to deploy. No credit card needed for free tier.

### 4A. Create Railway Account

1. Go to https://railway.app
2. Click "Start for free"
3. Click "Create an account"
4. Enter email & password
5. Verify email
6. Done!

### 4B. Deploy Your Website

**Option A: Using GitHub (Recommended)**

1. Create free GitHub account at https://github.com
2. Login to GitHub
3. Click "+" icon → "New repository"
4. Name it: `seaescape-boat-booking`
5. Click "Create repository"
6. Install Git: https://git-scm.com/downloads
7. Open Terminal in your seaescape folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/seaescape-boat-booking.git
git push -u origin main
```

8. Login to Railway.app
9. Click "New Project"
10. Select "Deploy from GitHub"
11. Find your repository & select it
12. Railway will automatically deploy! 🎉

**Option B: Using Railway CLI (Faster)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login
# Opens browser to login

# Initialize project
railway init
# Choose your project name

# Deploy
railway up
# Uploads your files and starts server

# Get URL
railway domains
```

Done! Your website is live!

---

## STEP 5: SETUP PAYMENT GATEWAY

### Choose Your Payment Gateway

**For Malaysia Customers** → Use iPay88 ⭐
**For International** → Use Stripe

---

## OPTION A: IPAY88 (RECOMMENDED)

### iPay88 Setup

1. Go to https://ipay88.com
2. Click "Register" (top right)
3. Fill form:
   - Business name: Your boat rental name
   - Email: Your email
   - Phone: Your phone number
4. Choose merchant type: "Travel & Tourism"
5. Submit form
6. Wait for approval (1-2 business days)

### After Approval

1. Login to iPay88 dashboard
2. Go to Settings → Merchant Code
3. Copy your:
   - **Merchant Code** (starts with M)
   - **Secret Key**

### Add to Your Website

1. Open your Railway dashboard
2. Go to Variables
3. Add these variables:
   ```
   IPAY88_CODE = M12345 (your code)
   IPAY88_KEY = xxxxx (your key)
   DOMAIN = https://your-website.railway.app
   ```

4. Open `server.js` in text editor
5. Find line ~25-48 (iPay88 section)
6. Uncomment the iPay88 code
7. Delete the demo code
8. Save file
9. Push to GitHub / Railway will auto-redeploy

**Test**:
1. Go to your website
2. Fill booking form
3. Click payment button
4. Should redirect to iPay88 payment page

---

## OPTION B: STRIPE (GLOBAL)

### Stripe Setup

1. Go to https://stripe.com
2. Click "Sign in" → "Create account"
3. Fill form (business name, email)
4. Verify email
5. Login to dashboard

### Get API Keys

1. Click "Developers" (left menu)
2. Click "API keys"
3. You'll see two keys:
   - **Secret key** (starts with sk_live_)
   - **Publishable key** (starts with pk_live_)

### Add to Your Website

1. Open Railway dashboard → Variables
2. Add:
   ```
   STRIPE_SECRET_KEY = sk_live_xxxxx
   STRIPE_PUBLIC_KEY = pk_live_xxxxx
   DOMAIN = https://your-website.railway.app
   ```

3. Open `server.js`
4. Find line ~15-20 (Stripe section)
5. Uncomment Stripe code
6. Delete demo code
7. Save & push to GitHub

---

## STEP 6: SETUP CUSTOM DOMAIN

### Buy Domain

Go to:
- GoDaddy (godaddy.com)
- NameCheap (namecheap.com)
- Domain.my (domain.my) ← Malaysian registrar

Search for `seaescape.my` or similar
Cost: RM 10-50/year

### Connect to Railway

1. Login to Railway
2. Go to project settings
3. Click "Domains"
4. Add custom domain
5. Copy the nameservers given
6. Go to your domain registrar
7. Update nameservers to Railway's
8. Wait 24 hours for activation

Your website is now at: **seaescape.my** 🎉

---

## STEP 7: CUSTOMIZE YOUR WEBSITE

### Update Business Information

**In `index.html`** (around line 300):

Find:
```html
<span>📞 +60 123-456-789</span>
<span>💬 @seaescape_MY</span>
<span>📧 hello@seaescape.my</span>
```

Replace with your details:
```html
<span>📞 +60 YOUR_PHONE</span>
<span>💬 @your_whatsapp</span>
<span>📧 your_email@example.com</span>
```

Also update WhatsApp link (find line with `wa.me`):
```html
<a href="https://wa.me/60123456789?text=Hi%20SeaEscape">
```

Replace `60123456789` with YOUR phone number (no spaces, with country code)

### Update Pricing

**In `server.js`** (around line 30):

```javascript
const BOATS = {
  small: { name: "Your Boat Name 1", capacity: 6, basePrice: 300 },
  medium: { name: "Your Boat Name 2", capacity: 10, basePrice: 400 },
  large: { name: "Your Boat Name 3", capacity: 12, basePrice: 500 }
};
```

### Update Colors (Optional)

**In `styles.css`** (line 10):

```css
--color-primary: #0066ff;      /* Main blue */
--color-secondary: #00a8ff;    /* Light blue */
--color-accent: #ff6b35;       /* Orange */
```

Change these hex colors to your brand colors.

---

## STEP 8: SETUP EMAIL CONFIRMATIONS

When customer books, they should get email confirmation.

### Add Email Service (Optional but Recommended)

1. Sign up to Mailgun.com or SendGrid.com (free tier)
2. Get API key
3. Add to your website code
4. Customers get instant email confirmation

For now, bookings are saved but no auto-email. You can send manually via WhatsApp.

---

## STEP 9: GO LIVE CHECKLIST

Before you start accepting bookings:

- [ ] Website loads at your domain
- [ ] Payment gateway is working
- [ ] Test booking from start to finish
- [ ] Receive payment confirmation
- [ ] Get email/SMS for test booking
- [ ] Update all contact info (phone, email, WhatsApp)
- [ ] Create booking tracking system
- [ ] Train boatmen on process
- [ ] Have insurance in place
- [ ] Have cancellation policy ready
- [ ] Have FAQ updated with local info

---

## TROUBLESHOOTING

### Website Won't Load
**Problem**: Error when visiting website

**Solution**:
1. Wait 5 minutes (Railway might be deploying)
2. Check Railroad dashboard → Builds
3. Look for red error messages
4. Check if payment gateway variables are set correctly

---

### Payment Not Working
**Problem**: Payment button doesn't work

**Solution**:
1. Check if you added API keys to Railway
2. Verify keys are correct (copy-paste from gateway)
3. Check if you uncommented the payment code in `server.js`
4. Try test transaction with test keys (not live)

---

### Changes Not Showing
**Problem**: You updated `index.html` but website still shows old version

**Solution**:
1. Make sure you pushed to GitHub
2. Wait 2-3 minutes for Railway to rebuild
3. Hard refresh in browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
4. Check Railway build logs for errors

---

### Custom Domain Not Working
**Problem**: Custom domain shows error

**Solution**:
1. Wait 24-48 hours for DNS to propagate
2. Check nameservers are correctly set
3. Verify domain registration is active
4. Try accessing via Railway's default URL first

---

## NEXT STEPS AFTER LAUNCH

### Week 1
- [ ] Do 3-5 test bookings
- [ ] Fix any issues
- [ ] Setup booking management system (spreadsheet or database)
- [ ] Create WhatsApp group for boatmen

### Week 2-4
- [ ] Setup social media (Instagram, Facebook, TikTok)
- [ ] Post booking process videos
- [ ] Get first 5 real customers
- [ ] Collect testimonials & photos
- [ ] Improve website based on feedback

### Month 2-3
- [ ] Launch paid advertising (RM 500-1000)
- [ ] Partnership with 3-5 hotels
- [ ] Get 20+ customer reviews
- [ ] Refine pricing based on demand

---

## USEFUL COMMANDS

```bash
# Start website locally
npm start

# Install dependencies
npm install

# Stop website (while running)
Ctrl+C

# Push changes to GitHub
git add .
git commit -m "Update message"
git push

# Check if Node is installed
node --version

# View Railway logs
railway logs
```

---

## GETTING HELP

### Stuck Somewhere?

1. **Check BUSINESS_GUIDE.md** - Comprehensive business strategy
2. **Check README.md** - Technical documentation
3. **Check payment gateway docs** - iPay88 or Stripe support
4. **Search Google** - "how to deploy Node.js on Railway"

### Contact Payment Providers

- **iPay88**: support@ipay88.com
- **Stripe**: support.stripe.com/contact
- **Railway**: support@railway.app

### Video Tutorials

Search YouTube for:
- "Deploy Node.js with Railway"
- "Setup iPay88 payment gateway"
- "Create custom domain with Railway"

---

## COST BREAKDOWN

```
Monthly Costs:
- Domain: RM 2-5 (yearly, so ~RM 0.25/month)
- Railway hosting: RM 0-50 (free tier or ~$7)
- Payment gateway: 2% per transaction (no fixed cost)
- Email service: RM 0-20 (optional)
- Total: RM 20-70/month (very affordable!)

Break-even:
- With 2-3 bookings per month at RM 450 each
- Revenue: RM 900-1350
- Cost: RM 50
- Profit: RM 850-1300/month
```

---

## YOU'RE READY! 🎉

You now have:
✅ A professional booking website
✅ Online payment system
✅ Custom domain
✅ Live on the internet
✅ Ready for real customers

Next: Get your first customer! 🚀

---

**Questions?** Read BUSINESS_GUIDE.md or README.md

**Good luck! 🌊**
