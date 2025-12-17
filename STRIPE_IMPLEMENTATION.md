# Stripe Event Ticket Checkout Implementation

## Overview

This implementation provides a complete Stripe checkout flow for event ticket sales with the following features:

- **Event-based checkout**: Accept event metadata and ticket information
- **Order management**: Create and track orders with full event details
- **Automatic ticket generation**: Generate unique tickets with QR codes upon payment
- **Email confirmations**: Send order confirmation emails with ticket details
- **Webhook handling**: Process Stripe events securely
- **Database persistence**: Store orders, tickets, and payment information

## Architecture

### Database Schema

#### `orders` table (extended)
```sql
- id (primary key)
- user_id (nullable, foreign key to users)
- customer_email
- customer_name
- event_id (event identifier)
- event_title
- event_date
- event_venue
- quantity
- total_price
- subtotal (calculated: total - platform_fee - tax)
- platform_fee
- tax
- currency (default: 'usd')
- stripe_session_id (unique)
- stripe_payment_intent_id (unique)
- xendit_transaction_id (for legacy payments)
- status: 'pending' | 'completed' | 'failed' | 'refunded'
- created_at, updated_at
```

#### `event_tickets` table (new)
```sql
- id (primary key)
- order_id (foreign key)
- event_id
- ticket_number (unique: TKT-YYYY-XXXXXXXX)
- qr_code (unique identifier)
- status: 'valid' | 'used' | 'cancelled'
- used_at (nullable timestamp)
- created_at, updated_at
```

### Models

#### `Order` Model
Located in [app/models/order.ts](app/models/order.ts)

```typescript
export default class Order extends BaseModel {
  // Relations
  hasMany(() => EventTicket)  // One order can have multiple tickets
  belongsTo(() => User)       // Order belongs to a user (optional)

  // Computed property
  get subtotal() {
    return this.totalPrice - this.platformFee - this.tax
  }
}
```

#### `EventTicket` Model
Located in [app/models/event_ticket.ts](app/models/event_ticket.ts)

```typescript
export default class EventTicket extends BaseModel {
  belongsTo(() => Order)

  // Helper methods
  static generateTicketNumber(): string  // Generates TKT-2025-XXXXXXXX
  static generateQRCode(): string        // Generates unique QR code
}
```

## API Endpoints

### Public Endpoints

#### POST `/api/stripe/checkout`
Create a Stripe checkout session for an event ticket purchase.

**Request Body:**
```json
{
  "amount": 5000,                                    // Amount in cents
  "currency": "usd",                                 // Optional, default: "usd"
  "successUrl": "http://example.com/success",      // Redirect on success
  "cancelUrl": "http://example.com/cancel",         // Redirect on cancel
  "eventId": "event-123",                           // Event identifier
  "eventTitle": "Workshop Title",                   // Event name
  "eventDate": "2025-12-20T10:00:00",              // ISO datetime
  "eventVenue": "Community Center",                 // Venue name
  "quantity": 1,                                    // Number of tickets
  "customerEmail": "user@example.com"               // Optional if authenticated
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/...",
  "orderId": 123
}
```

**Frontend Flow:**
```typescript
// 1. Create checkout session
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  body: JSON.stringify(eventData)
})

const { url } = await response.json()

// 2. Redirect to Stripe
window.location.href = url

// 3. After payment, redirect to success URL
// Stripe handles webhook automatically
```

#### POST `/api/stripe/webhook`
Handle Stripe webhook events. This endpoint processes payment completions, failures, and refunds.

**Webhook Events Handled:**
- `checkout.session.completed` - Payment succeeded
  - Creates order record with status "completed"
  - Generates event tickets with unique QR codes
  - Sends order confirmation email
  
- `payment_intent.payment_failed` - Payment failed
  - Updates order status to "failed"
  
- `charge.refunded` - Payment refunded
  - Updates order status to "refunded"
  - Cancels all associated tickets

**Security:**
- Requires valid Stripe webhook signature
- Signature verified against `STRIPE_WEBHOOK_SECRET`
- Returns 400 if signature invalid

### Protected Endpoints (requires authentication)

#### GET `/api/stripe/order/:id`
Retrieve a specific order with its tickets.

**Response:**
```json
{
  "id": 123,
  "eventTitle": "Workshop Title",
  "eventDate": "2025-12-20T10:00:00Z",
  "eventVenue": "Community Center",
  "quantity": 1,
  "totalPrice": 5000,
  "status": "completed",
  "tickets": [
    {
      "id": 1,
      "ticketNumber": "TKT-2025-12345678",
      "qrCode": "QR-1702828800000-a1b2c3d4e",
      "status": "valid"
    }
  ]
}
```

#### GET `/api/stripe/orders`
Retrieve all orders for the authenticated user.

**Response:**
```json
[
  {
    "id": 123,
    "eventTitle": "Workshop Title",
    "eventDate": "2025-12-20T10:00:00Z",
    "totalPrice": 5000,
    "status": "completed",
    "createdAt": "2025-12-16T10:00:00Z"
  }
]
```

## Controller Implementation

Located in [app/controllers/stripe_controller.ts](app/controllers/stripe_controller.ts)

### Key Methods

#### `checkout()`
1. Validates input data
2. Creates pending order in database
3. Sends order data to Stripe as metadata
4. Returns session ID and URL for redirect

#### `handleCheckoutSessionCompleted()`
1. Retrieves order from database
2. Updates order status to "completed"
3. Generates event tickets
4. Sends confirmation email
5. Logs transaction

#### `handlePaymentFailed()`
Updates order status to "failed"

#### `handleRefund()`
1. Updates order status to "refunded"
2. Cancels all associated tickets

## Email Notification

Located in [app/emails/order_confirmation_email.tsx](app/emails/order_confirmation_email.tsx)

The email includes:
- Order confirmation header
- Event details (title, date, time, venue)
- Individual ticket numbers and QR codes
- Order summary with pricing breakdown
- Instructions for entry
- Order ID and date
- Support contact information

**Email Template Features:**
- Responsive HTML design
- QR codes embedded for mobile scanning
- Clear pricing breakdown (subtotal, fees, tax, total)
- Professional styling with brand colors

## Setup Instructions

### 1. Install Dependencies

```bash
npm install stripe
```

### 2. Environment Variables

Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...      # Get from Stripe Dashboard
STRIPE_PUBLISHABLE_KEY=pk_test_... # Get from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...    # Get from Stripe Dashboard (webhooks)
```

### 3. Run Migrations

```bash
node ace migration:run
```

This will:
- Create `event_tickets` table
- Add Stripe columns to `orders` table

### 4. Configure Stripe Webhook

In Stripe Dashboard → Developers → Webhooks:

1. Add endpoint: `https://api.yourdomain.com/api/stripe/webhook`
2. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
3. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env`

### 5. Test Webhook Locally (Optional)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl https://files.stripe.com/stripe-cli/install.sh -o install.sh && bash install.sh

# Windows
choco install stripe
```

Forward webhooks:
```bash
stripe listen --forward-to localhost:3333/api/stripe/webhook
```

Use webhook signing secret from CLI output in `.env`.

## Security Considerations

### 1. Webhook Signature Verification
- All webhook handlers verify Stripe signature
- Prevents spoofed webhook events
- Secret stored in environment variables

### 2. Order Idempotency
- Webhook handlers check for existing orders
- Prevents duplicate orders if webhook retried
- Updates existing record on retry

### 3. Input Validation
- Amount validated (must be positive)
- URLs validated (must be valid URLs)
- Event details required and sanitized
- Quantity limited to 1-100

### 4. Authentication
- Protected endpoints require user authentication
- Users can only view their own orders
- Webhook endpoint doesn't require auth (signature verified instead)

### 5. Sensitive Data
- Stripe API keys stored in environment variables
- Webhook secret stored securely
- Customer emails stored in database
- Payment intent IDs stored for audit trail

## Error Handling

All endpoints return appropriate error responses:

```json
// 400 Bad Request - Invalid input
{
  "error": "Invalid amount",
  "field": "amount"
}

// 401 Unauthorized - Not authenticated
{
  "error": "User must be authenticated"
}

// 404 Not Found - Resource not found
{
  "error": "Order not found"
}

// 500 Internal Server Error
{
  "error": "Failed to create checkout session",
  "message": "Stripe API error details"
}
```

## Testing

### Unit Tests
```typescript
// Test checkout creation
it('creates checkout session with event metadata', async () => {
  const response = await client.post('/api/stripe/checkout').json({
    amount: 5000,
    currency: 'usd',
    successUrl: 'http://example.com/success',
    cancelUrl: 'http://example.com/cancel',
    eventId: 'event-123',
    eventTitle: 'Test Event',
    quantity: 2
  })

  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('sessionId')
})
```

### Manual Testing with Stripe Test Cards
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Authentication Required**: 4000 0025 0000 3155

## Production Checklist

- [ ] Add `STRIPE_SECRET_KEY` and webhook secret to production `.env`
- [ ] Test webhook endpoint is publicly accessible
- [ ] Enable Stripe's advanced fraud detection
- [ ] Set up email delivery service (SMTP)
- [ ] Add order history page in frontend
- [ ] Implement ticket entry scanner
- [ ] Set up logging and monitoring
- [ ] Test refund process
- [ ] Train support team on order management
- [ ] Create admin dashboard for order viewing

## Future Enhancements

1. **QR Code PDF Generation**: Generate printable tickets
2. **Bulk Ticket Upload**: Admin upload tickets in batch
3. **Event Capacity Limits**: Prevent overbooking
4. **Dynamic Pricing**: Event prices can vary by date
5. **Multiple Payment Methods**: Apple Pay, Google Pay
6. **Subscription Support**: Recurring event payments
7. **Revenue Reports**: Admin analytics and reporting
8. **Resale/Transfer**: Allow ticket transfer between users

## Support

For issues or questions:
- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Webhook Testing: https://stripe.com/docs/webhooks/test
