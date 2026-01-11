// import { Resend } from 'resend'

// Mock Resend client to disable emails
const resend = {
  emails: {
    send: async () => ({ data: { id: 'mock' }, error: null })
  }
}

// Initialize Resend client
/*
if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email sending will be disabled.')
}

const resend = new Resend(process.env.RESEND_API_KEY)
*/

// Email sender configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Mike\'s Cut <bookings@mikescut.com>'

// Send booking confirmation email
export async function sendBookingConfirmation({
  customerEmail,
  customerName,
  barberName,
  serviceName,
  bookingDate,
  bookingTime,
  price,
}: {
  customerEmail: string
  customerName: string
  barberName: string
  serviceName: string
  bookingDate: string
  bookingTime: string
  price: number
}) {
  console.log('Email sending is DISABLED. Mocking success for booking confirmation.')
  return { success: true, data: { id: 'mock-id' } }

  /*
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.')
    return { success: false, error: 'API key not configured' }
  }

  console.log('Sending booking confirmation email:', {
    to: customerEmail,
    barberName,
    serviceName,
    bookingDate,
    bookingTime,
    price
  })

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Booking Confirmed - Mike\'s Cut Barbershop',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .detail-row { margin: 15px 0; padding: 10px; background: #fff; border-left: 4px solid #d4af37; }
            .detail-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .detail-value { font-size: 16px; color: #1a1a1a; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .price { font-size: 24px; color: #d4af37; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MIKE'S CUT</h1>
              <p style="margin: 5px 0;">BARBERSHOP</p>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Your Booking is Confirmed!</h2>
              <p>Hey ${customerName},</p>
              <p>We're looking forward to seeing you. Here are the details of your appointment:</p>
              
              <div class="detail-row">
                <div class="detail-label">Barber</div>
                <div class="detail-value">${barberName}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Service</div>
                <div class="detail-value">${serviceName}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Date</div>
                <div class="detail-value">${new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Time</div>
                <div class="detail-value">${bookingTime}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Total</div>
                <div class="detail-value"><span class="price">$${price}</span></div>
              </div>
              
              <p style="margin-top: 30px; color: #666;">
                <strong>Important:</strong> Please arrive 5 minutes early. If you need to reschedule or cancel, 
                please contact us at least 24 hours in advance.
              </p>
            </div>
            <div class="footer">
              <p>Mike's Cut Barbershop</p>
              <p>Questions? Reply to this email or call us.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send booking confirmation email:', error)
      return { success: false, error }
    }

    console.log('Booking confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    return { success: false, error }
  }
  */
}

// Send booking reminder email (for future use)
export async function sendBookingReminder({
  customerEmail,
  customerName,
  barberName,
  serviceName,
  bookingDate,
  bookingTime,
}: {
  customerEmail: string
  customerName: string
  barberName: string
  serviceName: string
  bookingDate: string
  bookingTime: string
}) {
  console.log('Email sending is DISABLED. Mocking success for reminder.')
  return { success: true, data: { id: 'mock-id' } }
  /*
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Reminder: Your Appointment Tomorrow - Mike\'s Cut',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .highlight { background: #d4af37; color: #fff; padding: 20px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MIKE'S CUT</h1>
            </div>
            <div class="content">
              <h2>Don't Forget Your Appointment Tomorrow!</h2>
              <p>Hey ${customerName},</p>
              <p>This is a friendly reminder about your appointment:</p>
              
              <div class="highlight">
                <h3 style="margin: 0;">${bookingTime}</h3>
                <p style="margin: 10px 0;">${serviceName} with ${barberName}</p>
              </div>
              
              <p>See you soon!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send reminder email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return { success: false, error }
  }
  */
}

export default resend
