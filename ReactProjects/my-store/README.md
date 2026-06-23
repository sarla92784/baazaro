# Baazaro — E-commerce Frontend Application

A fully functional e-commerce application built as a capstone project using React, Supabase, and modern web technologies.

🔗 **Live Demo:** https://dreamy-bienenstitch-0aff74.netlify.app

---

## Project Overview

Baazaro is an Indian e-commerce platform that allows users to browse products, add them to cart, authenticate, and complete purchases. The admin panel allows the store owner to manage products and view orders in real time.

---

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/sarla92784/baazaro.git

# Go into the project folder
cd ReactProjects/my-store

# Install dependencies
npm install

# Create .env file and add your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

---

## Code Structure

src/

components/

Navbar/          # Navigation bar with cart badge and auth state

ProductList/     # Product grid with filters and sorting

ProductCard/     # Individual product card component

Cart/            # Cart component

Checkout/        # Checkout component

pages/

Home.jsx         # Main product listing page

ProductDetail.jsx # Single product detail page

CartPage.jsx     # Shopping cart page

CheckoutPage.jsx # Multi-step checkout with form validation

LoginPage.jsx    # Login and register page

AdminPage.jsx    # Admin panel for product management

contexts/

CartContext.jsx  # Global cart state management

AuthContext.jsx  # Global authentication state

hooks/

useProducts.js   # Custom hook for fetching products

services/

api.js           # Supabase API calls

supabase.js      # Supabase client configuration

utils/

Currency.js      # USD to INR price formatter

---

## Architecture Decisions

### State Management
Used **React Context API** for global state management with two contexts:
- **CartContext** — manages cart items, quantities, totals. Persists to localStorage so cart survives page refresh.
- **AuthContext** — manages user authentication state using Supabase Auth. Automatically restores session on page load.

### API Integration
Used **Supabase** as the backend database instead of FakeStoreAPI, which gives:
- Real database with persistent product data
- Real user authentication with email verification
- Row Level Security for data protection
- Real-time capabilities

### Routing
Used **React Router v6** with:
- Nested routes for all pages
- Protected routes for checkout (requires login)
- Admin route with email-based access control
- Lazy loading for all page components

### Performance Optimizations
- `React.lazy()` + `Suspense` for code splitting — each page loads only when visited
- `loading="lazy"` on all product images
- Vite for fast bundling and HMR during development

---

## Component Architecture

App

├── AuthProvider (global auth state)

│   └── CartProvider (global cart state)

│       └── BrowserRouter

│           ├── Navbar (cart count, user name, admin link)

│           └── Routes

│               ├── Home → ProductList → ProductCard

│               ├── ProductDetail

│               ├── CartPage

│               ├── LoginPage

│               ├── CheckoutPage (protected)

│               └── AdminPage (admin only)

---

## Technical Details

### Cart Logic
Products are stored in cart as objects with `{id, title, price, image, quantity}`. When the same product is added twice, quantity increases instead of duplicating. Total is calculated using `reduce()`.

### Authentication Flow
1. User registers with email + password
2. Supabase sends confirmation email
3. User confirms email and can login
4. JWT token stored in Supabase session
5. `onAuthStateChange` listener keeps UI in sync

### Admin Panel
Only accessible to the admin email (`sarla.92784@gmail.com`). Uses Supabase to:
- Fetch all products and orders
- Insert new products
- Update existing products
- Delete products

### Form Validation
Checkout form validates:
- Required fields (name, email, address, city, PIN)
- Email format using regex
- Card number (16 digits)
- Expiry date (MM/YY format)
- CVV (3 digits)

---

## Deployment

Deployed on **Netlify** with continuous deployment from GitHub:
- Build command: `npm run build`
- Publish directory: `ReactProjects/my-store/dist`
- Environment variables set in Netlify dashboard

---

## Challenges Faced

1. **Supabase RLS policies** — Row Level Security was blocking product reads. Fixed by disabling RLS on products table for public access.
2. **Vite cache issues** — Old code kept loading after changes. Fixed by clearing `node_modules/.vite` cache.
3. **React hooks outside component** — Accidentally placed `useCart()` outside function body. Fixed by moving inside component.
4. **Currency conversion** — FakeStoreAPI uses USD. Created `formatPrice()` utility to convert to INR (×83).
5. **Netlify build failure** — Wrong import paths in CartPage.jsx. Fixed by correcting relative paths.

---

## Screenshots

> Add screenshots of:
> - Home page with product grid
> - Product detail page
> - Cart page
> - Checkout flow
> - Order confirmation
> - Login page
> - Admin panel

---

## Features

- 🛍️ Product catalog with category filters and price sorting
- 🔍 Product detail pages with full description
- 🛒 Shopping cart with quantity controls and persistent storage
- 🔐 Real user authentication (Supabase Auth)
- 💳 Multi-step checkout with form validation
- ✅ Order confirmation with unique order ID
- 👑 Admin panel for product management
- 🇮🇳 Indian Rupee (₹) pricing
- ⚡ Lazy loading for performance
- 📱 Responsive design