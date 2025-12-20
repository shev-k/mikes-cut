# Resend API Setup Instructions

## 1. Install Resend Package

```bash
pnpm install resend
```

## 2. Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key

## 3. Add Environment Variables

Add these to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=bookings@yourdomain.com
```

**Important:** 
- Replace `re_your_api_key_here` with your actual Resend API key
- For the `RESEND_FROM_EMAIL`, you need to verify your domain in Resend first
- During development, you can use Resend's test mode which allows sending to your own email

## 4. Verify Your Domain (Production)

1. In Resend Dashboard, go to **Domains**
2. Add your domain (e.g., `mikescut.com`)
3. Add the DNS records they provide to your domain registrar
4. Wait for verification (usually a few minutes)

## 5. Usage

The email functions are already integrated in `lib/resend.ts`. To use them:

```typescript
import { sendBookingConfirmation } from '@/lib/resend'

// After successful booking
await sendBookingConfirmation({
  customerEmail: 'customer@email.com',
  customerName: 'John Doe',
  barberName: 'Mike Johnson',
  serviceName: 'Knife Cut',
  bookingDate: '2025-12-21',
  bookingTime: '10:00 AM',
  price: 45
})
```

## 6. Enable Email Sending in Booking Flow

I've created the email utility. To activate it, we need to:
1. Install the package (`pnpm install resend`)
2. Add the API key to `.env.local`
3. Integrate the email sending into the booking creation action

Let me know when you have the API key and I'll integrate it into the booking flow!

## Features Included

✅ **Booking Confirmation Email** - Sent immediately after booking
✅ **Booking Reminder Email** - Can be used for reminder notifications
✅ **Professional HTML Templates** - Branded with Mike's Cut styling
✅ **Error Handling** - Graceful fallback if email fails
