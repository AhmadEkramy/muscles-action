# Muscles Action E-Commerce Platform

A modern, fully responsive e-commerce web app for supplements, supporting Arabic & English, with a complete admin dashboard, Firestore integration, offers, coupons, orders, and a mobile-friendly UI.

---

## Features

- **Fully Responsive**: Works perfectly on all devices (mobile, tablet, desktop)
- **Multi-language**: Arabic & English support, RTL/LTR aware
- **Product Catalog**: Categories, flavors, images, best seller/new flags, stock status
- **Cart & Checkout**: Add to cart, select flavors, apply coupons, place orders
- **Offers & Coupons**: Animated offers, coupon validation, usage limits, Firestore tracking
- **Admin Dashboard**: CRUD for products, offers, coupons, orders, and stats
- **Order Management**: Admin can confirm, deliver, or delete orders; status updates in real-time
- **Stats Panel**: Total orders, sales, confirmed/delivered orders
- **Authentication**: Firebase Auth for admin login, persistent sessions
- **Modern UI/UX**: Beautiful, user-friendly, and consistent design
- **Error Handling**: User feedback for all actions and edge cases
- **WhatsApp Support**: Floating WhatsApp button for instant help

---

## Getting Started

### Prerequisites
- Node.js & npm (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation
```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Setup
- Configure your Firebase project (Firestore & Auth)
- Add your Firebase config to `src/lib/utils.ts` or your environment config file
- Place your logo as `public/logo.jpg` for branding

---

## Project Structure
- `src/pages/` — All main pages (Home, Cart, Checkout, Admin, etc.)
- `src/components/` — UI components (Header, Footer, ProductCard, etc.)
- `src/contexts/` — React Contexts for Cart and Language
- `src/data/` — Sample product data
- `src/hooks/` — Custom hooks (e.g., use-toast)
- `src/lib/` — Utility functions

---

## Customization
- **Branding**: Replace `public/logo.jpg` and update colors in `tailwind.config.ts`
- **Contact Info**: Update WhatsApp, email, and location in `Footer.tsx` and `ContactPage.tsx`
- **Products**: Add/edit products via the admin dashboard
- **Offers/Coupons**: Manage via the admin dashboard

---

## Deployment
- Deploy with Vercel, Netlify, or your preferred provider

---

## Technologies Used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Firestore & Auth)

---

## License
This project is production-ready and can be customized for your business needs.

---
