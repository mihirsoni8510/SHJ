# Shree Jewellers - E-Commerce Platform

A premium jewelry e-commerce application built with React, Next.js, PostgreSQL, Prisma, and TanStack Query.

## ✨ Features

- **Authentication System** - Login/Registration with JWT tokens
- **Product Management** - Browse, search, and filter jewelry products
- **Shopping Cart** - Add, update, and remove items
- **Wishlist** - Save favorite items
- **Search Functionality** - Search products by name, category, metal type
- **Premium UI** - Modern, responsive design with animations
- **Real-time Updates** - TanStack Query for efficient data fetching and caching

## 🚀 Tech Stack

- **Frontend**: React 19, Next.js 16
- **Styling**: TailwindCSS 4, Custom CSS
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with httpOnly cookies
- **Forms**: React Hook Form + Zod validation
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SHJ/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `frontend` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/shree_jewellers"
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set Up Database

**Option A: Using PostgreSQL locally**

1. Install PostgreSQL
2. Create a new database:
```sql
CREATE DATABASE shree_jewellers;
```
3. Update `DATABASE_URL` in `.env` with your credentials

**Option B: Using a cloud PostgreSQL service**

Use services like:
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)

### 5. Run Prisma Migrations

```bash
npx prisma generate
npx prisma db push
```

### 6. (Optional) Seed the Database

Create a seed file to add sample data for categories and products:

```bash
npx prisma db seed
```

### 7. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application!

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── cart/         # Cart management
│   │   ├── wishlist/     # Wishlist management
│   │   ├── products/     # Product endpoints
│   │   └── categories/   # Category endpoints
│   ├── auth/             # Auth pages (login, register)
│   ├── cart/             # Cart page
│   ├── wishlist/         # Wishlist page
│   ├── products/         # Products listing page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Footer
│   ├── ProductCard.tsx   # Product display card
│   └── providers.tsx     # Query provider
├── hooks/                 # Custom hooks
│   └── useApi.ts         # TanStack Query hooks
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth helpers
│   └── types.ts          # TypeScript types
├── prisma/                # Prisma schema
│   └── schema.prisma     # Database schema
└── package.json
```

## 🎨 Key Features Implementation

### Authentication
- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Protected routes and API endpoints

### Product Management
- Filter by category, metal type, price range
- Search functionality
- Pagination support

### Cart & Wishlist
- Add/remove items
- Update quantities
- Real-time price calculations

### Search
- Full-text search across product names and descriptions
- Filter combinations

## 🔐 Admin Features (Future Enhancement)

To add products, you'll need to:
1. Create an admin interface
2. Add file upload functionality for product images
3. Implement product CRUD operations

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application includes the following main models:

- **User** - User accounts with authentication
- **Category** - Product categories (Gold, Diamond, Silver, etc.)
- **Product** - Jewelry products with details
- **CartItem** - Shopping cart items
- **WishlistItem** - Wishlist items
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Address** - Customer addresses

## 🎯 Next Steps

1. Set up PostgreSQL database
2. Configure environment variables
3. Run Prisma migrations
4. Add sample products (via admin panel or seed script)
5. Customize branding and content
6. Deploy to production (Vercel, Railway, etc.)

## 📸 Adding Product Images

For now, you can:
1. Use placeholder images
2. Add image URLs in the database
3. Implement image upload with services like:
   - Cloudinary
   - AWS S3
   - Uploadthing

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy!

### Database Hosting

- **Neon** - Serverless PostgreSQL
- **Supabase** - PostgreSQL with additional features
- **Railway** - All-in-one platform

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT

---

**Happy Coding! 💎**
