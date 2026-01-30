# Blood Bank Application Development Plan

## Project Overview
A simple full-stack blood bank application using Next.js and MongoDB with two main user types:
- **Admin**: Monitor and manage blood donations and inventory
- **Users**: Donate blood and search for available blood

## Tech Stack
- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: Simple session-based auth (demo purpose)

## Project Structure

```
blood_bank/
├── .env.local                    # Environment variables (MongoDB URI)
├── PLAN.md                       # This file
├── lib/
│   ├── mongodb.ts               # MongoDB connection utility
│   └── models/
│       ├── donor.ts              # Donor schema
│       ├── bloodInventory.ts     # Blood inventory schema
│       └── user.ts               # User schema (admin/donor)
├── app/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── admin/
│   │   └── page.tsx             # Admin dashboard
│   ├── donor/
│   │   └── page.tsx             # User donation page
│   ├── search/
│   │   └── page.tsx             # Blood search page
│   └── api/
│       ├── auth/
│       │   ├── login.ts         # Login API
│       │   └── logout.ts        # Logout API
│       ├── donors/
│       │   ├── route.ts         # GET/POST donors
│       │   └── [id]/
│       │       └── route.ts     # GET/PUT/DELETE donor
│       ├── inventory/
│       │   ├── route.ts         # GET/POST inventory
│       │   └── [id]/
│       │       └── route.ts     # GET/PUT/DELETE inventory
│       └── search/
│           └── route.ts         # Blood availability search
└── components/
    ├── ui/                      # Reusable UI components
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Card.tsx
    │   └── Table.tsx
    ├── forms/
    │   ├── DonationForm.tsx     # Blood donation form
    │   └── SearchForm.tsx       # Blood search form
    └── layout/
        ├── Header.tsx           # Navigation header
        └── Sidebar.tsx          # Admin sidebar
```

## Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string,
  bloodType: string,
  role: 'admin' | 'donor',
  createdAt: Date,
  lastDonated?: Date
}
```

### BloodInventory Collection
```typescript
{
  _id: ObjectId,
  bloodType: string, // A+, A-, B+, B-, AB+, AB-, O+, O-
  quantity: number, // in ml
  lastUpdated: Date,
  location: string,
  donors: ObjectId[] // Array of donor IDs
}
```

### Donation Collection
```typescript
{
  _id: ObjectId,
  donorId: ObjectId,
  bloodType: string,
  quantity: number, // in ml
  donationDate: Date,
  location: string,
  status: 'pending' | 'approved' | 'completed'
}
```

## Core Features

### 1. Landing Page (/)
- Hero section with app purpose
- Navigation to donor and admin portals
- Quick stats about blood availability

### 2. User Donation Portal (/donor)
- **Registration Form**: Name, email, phone, blood type
- **Donation Form**: Blood type, quantity (ml), location
- **Donation History**: Past donations and eligibility dates
- **Blood Search**: Search for available blood by type and location

### 3. Admin Dashboard (/admin)
- **Dashboard Overview**: Total donations, inventory levels, recent activities
- **Inventory Management**: Add/update blood stock, view availability
- **Donor Management**: View all donors, manage donation requests
- **Reports**: Generate donation and inventory reports

### 4. Blood Search (/search)
- **Search Interface**: Blood type, required quantity, location
- **Results Display**: Available blood with locations and contact info
- **Request System**: Simple request form for blood availability

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (demo: admin@bloodbank.com/admin123)
- `POST /api/auth/logout` - Logout session

### Donors
- `GET /api/donors` - Get all donors (admin only)
- `POST /api/donors` - Register new donor
- `GET /api/donors/[id]` - Get donor details
- `PUT /api/donors/[id]` - Update donor info

### Inventory
- `GET /api/inventory` - Get all blood inventory
- `POST /api/inventory` - Add new blood stock (admin only)
- `GET /api/inventory/[id]` - Get specific blood type details
- `PUT /api/inventory/[id]` - Update inventory levels

### Search
- `GET /api/search?bloodType=A+&location=Mumbai&quantity=500` - Search blood availability
- `POST /api/search/request` - Submit blood request

## Key Components

### UI Components
- **Button**: Consistent button styling for all actions
- **Card**: Reusable card layout for information display
- **Table**: Data tables for admin views
- **Form**: Styled form inputs with validation

### Forms
- **DonationForm**: Complete donation submission with validation
- **SearchForm**: Blood availability search with filters

### Layout
- **Header**: Navigation with auth state
- **Sidebar**: Admin navigation menu

## Development Steps

### Phase 1: Setup & Foundation
1. Install required dependencies (mongoose for MongoDB)
2. Set up MongoDB connection in `lib/mongodb.ts`
3. Create `.env.local` with MongoDB URI
4. Define database models/schemas
5. Set up basic API structure

### Phase 2: Core API Development
1. Implement user registration and authentication
2. Create donor management APIs
3. Build inventory management APIs
4. Implement blood search functionality

### Phase 3: Frontend Development
1. Create landing page with navigation
2. Build user donation portal
3. Develop admin dashboard
4. Implement blood search interface

### Phase 4: Integration & Polish
1. Connect frontend with APIs
2. Add form validation and error handling
3. Implement responsive design
4. Add loading states and user feedback

### Phase 5: Testing & Deployment
1. Test all user flows
2. Fix bugs and optimize performance
3. Prepare for deployment
4. Documentation

## Environment Variables (.env.local)
```
MONGODB_URI=mongodb://localhost:27017/bloodbank
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Blood Types to Support
A+, A-, B+, B-, AB+, AB-, O+, O-

## Validation Rules
- Phone: 10-digit mobile number
- Email: Valid email format
- Blood Type: Must be from supported types
- Donation Amount: Min 250ml, Max 500ml per donation
- Donation Frequency: Minimum 90 days between donations

## Security Considerations (Demo Level)
- Basic session management
- Input validation and sanitization
- Admin route protection
- CORS configuration for APIs

## Success Metrics
- Users can register and donate blood
- Admin can view and manage inventory
- Blood search works with location filtering
- Responsive design works on mobile/desktop
- All forms have proper validation

This plan provides a solid foundation for a functional blood bank demo application while keeping complexity manageable for a demo project.