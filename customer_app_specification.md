# Customer Mobile Application — Software Requirement Specification (SRS)

**Project:** ThaliCloud — Home-Cooked Meal Delivery Platform  
**Document Version:** 1.0  
**Date:** 2026-06-24  
**Platform:** Android & iOS (React Native)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Tech Stack](#3-tech-stack)
4. [Module Breakdown](#4-module-breakdown)
5. [Functional Requirements](#5-functional-requirements)
6. [Screen Inventory](#6-screen-inventory)
7. [API Contract Summary](#7-api-contract-summary)
8. [Data Models](#8-data-models)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Out of Scope (Phase 2)](#10-out-of-scope-phase-2)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for the **Customer Mobile Application** of the ThaliCloud platform — a food delivery service connecting customers with nearby home-style kitchens offering Thali meals.

### 1.2 Scope
The application covers:
- Customer registration and profile management
- Location-based kitchen discovery
- Meal browsing, customization, and cart management
- Checkout and order placement
- Real-time order tracking
- Order history and kitchen ratings

### 1.3 Intended Audience
- Mobile Developers (React Native)
- Backend Developers (Spring Boot)
- UI/UX Designers
- QA Engineers
- Product Managers

### 1.4 Definitions

| Term | Definition |
|---|---|
| Kitchen | A registered vendor/cloud kitchen serving home-style meals |
| Thali | A complete Indian meal set (Standard or Mini) |
| Add-on | Extra customizable item added to a Thali |
| Delivery Partner | Third-party rider who picks up and delivers orders |
| OTP | One-Time Password sent via SMS for login verification |

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Customer Mobile App                 │
│                   (React Native)                    │
└──────────────────────┬──────────────────────────────┘
                       │ REST / WebSocket
┌──────────────────────▼──────────────────────────────┐
│                  API Gateway                        │
│              (Spring Cloud Gateway)                 │
└────┬──────────┬──────────┬──────────┬──────────────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
 Auth-       Customer-  Order-     Kitchen-
 Service     Service    Service    Service
 :8080       :8082      :8083      :8085
     │
     ▼
 Notification-    Delivery-
 Service          Service
 (Redis/FCM)      :8086
```

### 2.2 Actor Summary

| Actor | Description |
|---|---|
| Customer | End user placing orders via mobile app |
| Kitchen (Vendor) | Receives and processes orders (Vendor Portal) |
| Delivery Partner | Accepts and fulfills delivery requests |
| Admin | Manages the entire platform (Admin Dashboard) |

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native (Expo or bare workflow) |
| Navigation | React Navigation v6 |
| State Management | Redux Toolkit + RTK Query |
| Maps | Google Maps SDK (react-native-maps) |
| Backend | Java 17, Spring Boot 3.x, Microservices |
| Database | H2 (dev) → MySQL/PostgreSQL (prod) |
| Authentication | OTP via SMS gateway (bypassed in Phase 1 — hardcoded OTP `1234`) |
| Real-time | WebSocket (STOMP over SockJS) |
| Notifications | Firebase Cloud Messaging (FCM) via Redis pub/sub |
| Payments | Bypassed in Phase 1 — mock "Pay Now" button |
| Image Storage | AWS S3 or local MinIO |
| API Gateway | Spring Cloud Gateway |

---

## 4. Module Breakdown

| Module # | Module Name | Priority |
|---|---|---|
| M1 | Authentication & Profile | P0 — Must Have |
| M2 | Location Setup | P0 — Must Have |
| M3 | Home & Kitchen Discovery | P0 — Must Have |
| M4 | Kitchen Menu & Meal Details | P0 — Must Have |
| M5 | Cart & Meal Customization | P0 — Must Have |
| M6 | Delivery Address | P0 — Must Have |
| M7 | Checkout & Payment (Mock) | P0 — Must Have |
| M8 | Order Confirmation | P0 — Must Have |
| M9 | Real-Time Order Tracking | P1 — High |
| M10 | Order History & Reorder | P1 — High |
| M11 | Ratings & Reviews | P1 — High |
| M12 | Favourites & Coupons | P2 — Medium |
| M13 | Notifications | P1 — High |
| M14 | Customer Support Chat | P3 — Low |

---

## 5. Functional Requirements

---

### M1 — Authentication & Profile

#### M1.1 Mobile Number Login
- **FR-1.1:** The app shall present a login/register screen on first launch.
- **FR-1.2:** Customer enters a 10-digit Indian mobile number.
- **FR-1.3:** System validates format; shows error for invalid numbers.
- **FR-1.4:** On submit, the backend sends an OTP to the entered number.
- **FR-1.5 (Phase 1):** OTP is hardcoded to `1234` — no actual SMS sent.

#### M1.2 OTP Verification
- **FR-1.6:** OTP screen displays a 4-digit input with auto-focus.
- **FR-1.7:** OTP expires in 5 minutes; resend available after 30 seconds.
- **FR-1.8:** On correct OTP — backend returns `accessToken` + `refreshToken`.
- **FR-1.9:** On incorrect OTP — show error; allow 3 attempts before lockout (10 min).

#### M1.3 Profile Completion (New Users Only)
- **FR-1.10:** After first successful OTP — redirect to Profile Setup screen.
- **FR-1.11:** Required fields: Full Name, Email Address.
- **FR-1.12:** On save — store profile; redirect to Location Setup.
- **FR-1.13:** Returning users skip to Home Page directly.

#### M1.4 Token Management
- **FR-1.14:** Store `accessToken` and `refreshToken` in secure storage (Keychain/Keystore).
- **FR-1.15:** On 401 response — silently refresh token and retry the request once.
- **FR-1.16:** Logout clears all tokens and redirects to Login screen.

---

### M2 — Location Setup

#### M2.1 Permission Request
- **FR-2.1:** On first use, request GPS permission with a rationale dialog.
- **FR-2.2:** If denied — offer manual location entry only.

#### M2.2 Current Location
- **FR-2.3:** Detect GPS coordinates using device sensors.
- **FR-2.4:** Reverse-geocode coordinates to a human-readable address.
- **FR-2.5:** Display pin on Google Maps for confirmation.
- **FR-2.6:** Customer taps "Confirm Location" → stored as active delivery zone.

#### M2.3 Manual Location Search
- **FR-2.7:** Search box queries Google Places Autocomplete API.
- **FR-2.8:** Results display Area, Street, City, and Pin Code.
- **FR-2.9:** Selecting a result pins it on map and populates address fields.
- **FR-2.10:** Customer can drag the pin to fine-tune the location.

---

### M3 — Home & Kitchen Discovery

#### M3.1 Kitchen Listing
- **FR-3.1:** Home page fetches kitchens within a configurable radius (default: 5 KM).
- **FR-3.2:** Each kitchen card displays: Name, Image, Rating (avg stars + count), Distance, Estimated Delivery Time, Open/Closed status.
- **FR-3.3:** Closed kitchens are shown below open ones and marked with a badge.
- **FR-3.4:** List refreshes on pull-to-refresh.

#### M3.2 Search & Filter
- **FR-3.5:** Search bar filters by Kitchen Name, Food Item, Thali Type, or Menu Category.
- **FR-3.6:** Results update in real-time (300 ms debounce).
- **FR-3.7:** Filter chips: Veg Only, Rating 4+, Under 30 Min, Open Now.
- **FR-3.8:** Sort options: Relevance, Rating, Distance, Delivery Time.

---

### M4 — Kitchen Menu & Meal Details

#### M4.1 Kitchen Detail Page
- **FR-4.1:** Show kitchen header: banner image, name, rating, distance, hours, cuisine tags.
- **FR-4.2:** Tab bar: Lunch | Dinner.
- **FR-4.3:** Each tab lists available Thali options.

#### M4.2 Thali Options
- **FR-4.4:** Standard Thali card: image, included items list, base price, "Add" button.
- **FR-4.5:** Mini Thali card: image, included items list, base price, "Add" button.
- **FR-4.6:** Tapping a Thali opens the Customization bottom sheet.

#### M4.3 Add-ons Display
- **FR-4.7:** Add-ons grouped by category: Bread, Rice, Vegetables, Sweets, Beverages.
- **FR-4.8:** Each add-on shows name, weight/quantity, and individual price.

---

### M5 — Cart & Meal Customization

#### M5.1 Customization Sheet
- **FR-5.1:** Bottom sheet opens with base Thali summary and add-on toggles.
- **FR-5.2:** Toggle/stepper for each add-on (off by default).
- **FR-5.3:** Price updates instantly as add-ons are selected.
- **FR-5.4:** Quantity stepper for the entire meal (min 1, max 10).
- **FR-5.5:** "Add to Cart" button shows total price for this selection.

#### M5.2 Cart Management
- **FR-5.6:** Cart icon in header shows item count badge.
- **FR-5.7:** Cart screen lists all items with name, add-ons, quantity, and line total.
- **FR-5.8:** Quantity can be increased/decreased per line item.
- **FR-5.9:** Remove item with swipe-left gesture or trash icon.
- **FR-5.10:** Cart is cleared if customer switches kitchens (prompt warning first).
- **FR-5.11:** Cart persists across app restarts (stored locally).
- **FR-5.12:** Cart shows: Subtotal, Delivery Charge, Taxes (5% GST), Grand Total.

---

### M6 — Delivery Address

#### M6.1 Address Entry
- **FR-6.1:** Before checkout, customer must confirm or enter a delivery address.
- **FR-6.2:** Address form fields: House/Flat No., Building Name, Street, Area, Landmark (optional), City, Pin Code.
- **FR-6.3:** Address can be pinned on Google Maps for precision.

#### M6.2 Saved Addresses
- **FR-6.4:** Customer can save addresses with labels: Home, Work, Other.
- **FR-6.5:** Saved addresses listed for quick selection.
- **FR-6.6:** Customer can edit or delete saved addresses.

---

### M7 — Checkout & Payment (Phase 1: Mock)

#### M7.1 Order Review Screen
- **FR-7.1:** Display full order summary: items, quantities, add-ons, pricing breakdown.
- **FR-7.2:** Show selected delivery address with "Change" option.
- **FR-7.3:** Show estimated delivery time.

#### M7.2 Payment (Phase 1 — Bypassed)
- **FR-7.4:** Show payment method selection (UPI, Card, COD) — all disabled in Phase 1.
- **FR-7.5:** A "Place Order (Test Mode)" button bypasses payment and creates the order directly.
- **FR-7.6:** Phase 2 will integrate Razorpay/PhonePe/Stripe.

---

### M8 — Order Confirmation

- **FR-8.1:** After order placement — show Order ID, summary, and "estimated time" on a confirmation screen.
- **FR-8.2:** Send push notification to customer with order ID.
- **FR-8.3:** Show lottie animation or success illustration.
- **FR-8.4:** Buttons: "Track Order" and "Continue Shopping."

---

### M9 — Real-Time Order Tracking

#### M9.1 Status Timeline
- **FR-9.1:** Show vertical timeline with 8 statuses:
  1. Order Placed
  2. Kitchen Accepted
  3. Preparing Food
  4. Ready for Pickup
  5. Delivery Partner Assigned
  6. Picked Up
  7. Out for Delivery
  8. Delivered Successfully
- **FR-9.2:** Completed statuses show a filled checkmark; current status is highlighted; future statuses are greyed out.
- **FR-9.3:** Status updates are received via WebSocket in real-time.

#### M9.2 Live Map
- **FR-9.4:** After status "Delivery Partner Assigned" — show live map with delivery partner pin.
- **FR-9.5:** Map updates delivery partner location every 5 seconds.
- **FR-9.6:** Show kitchen pin (pickup) and customer pin (drop-off).

---

### M10 — Order History & Reorder

- **FR-10.1:** Order history screen lists all past orders: date, kitchen name, items, total, status.
- **FR-10.2:** Tapping an order shows the full detail screen.
- **FR-10.3:** "Reorder" button re-populates cart with the same items and quantities.
- **FR-10.4:** Paginate history (20 orders per page).

---

### M11 — Ratings & Reviews

- **FR-11.1:** After order is delivered — prompt customer to rate (1–5 stars) with optional text review.
- **FR-11.2:** Separate ratings for Food Quality and Delivery Experience.
- **FR-11.3:** Rating prompt appears once; can be dismissed and completed later from Order History.
- **FR-11.4:** Reviews are displayed on the Kitchen Detail page.

---

### M12 — Favourites & Coupons

- **FR-12.1:** Heart icon on kitchen cards saves/un-saves a kitchen to Favourites.
- **FR-12.2:** Favourites screen accessible from profile/nav.
- **FR-12.3:** Coupon code entry on checkout screen.
- **FR-12.4:** Backend validates coupon and applies discount to Grand Total.

---

### M13 — Notifications

- **FR-13.1:** Push notifications via FCM for: order confirmation, status changes, kitchen acceptance, delivery updates, promotional offers.
- **FR-13.2:** In-app notification bell shows unread count.
- **FR-13.3:** Notification tray lists all recent notifications; tapping navigates to relevant screen.
- **FR-13.4:** Notification preferences manageable in Profile Settings.

---

## 6. Screen Inventory

| # | Screen Name | Module | Notes |
|---|---|---|---|
| S01 | Splash / Onboarding | M1 | App logo, tagline, Get Started CTA |
| S02 | Login — Enter Mobile | M1 | Mobile number input |
| S03 | Login — OTP Verification | M1 | 4-digit OTP input |
| S04 | Profile Setup | M1 | Name + Email (new users only) |
| S05 | Location Permission | M2 | GPS permission rationale |
| S06 | Location Confirmation | M2 | Map + confirm button |
| S07 | Location Search | M2 | Search box + Google Places results |
| S08 | Home Page | M3 | Search bar + kitchen cards |
| S09 | Search Results | M3 | Filtered kitchen/food list |
| S10 | Kitchen Detail | M4 | Header + Lunch/Dinner tabs + Thali cards |
| S11 | Meal Customization (Bottom Sheet) | M5 | Add-ons + quantity + price |
| S12 | Cart | M5 | Items + pricing summary |
| S13 | Delivery Address Selection | M6 | Saved addresses list |
| S14 | Add / Edit Address | M6 | Address form + map pin |
| S15 | Order Review & Checkout | M7 | Full summary + payment mock |
| S16 | Order Confirmation | M8 | Success screen + order ID |
| S17 | Order Tracking | M9 | Status timeline + live map |
| S18 | Order History | M10 | Past orders list |
| S19 | Order Detail (Past) | M10 | Full order breakdown |
| S20 | Rate & Review | M11 | Star rating + text input |
| S21 | Favourites | M12 | Saved kitchen list |
| S22 | Notifications | M13 | Notification tray |
| S23 | Profile & Settings | M1 | Name, email, logout, preferences |
| S24 | Support Chat | M14 | Chat interface (Phase 3) |

---

## 7. API Contract Summary

> All requests include `Authorization: Bearer <accessToken>` header.  
> Base URL: `http://<gateway-host>/api`

### Auth Service (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/send-otp` | Send OTP to mobile number |
| POST | `/auth/verify-otp` | Verify OTP, return tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |

### Customer Service (`/api/customer`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customer/profile` | Create profile after OTP |
| GET | `/customer/profile` | Get logged-in customer profile |
| PUT | `/customer/profile` | Update profile |
| GET | `/customer/addresses` | List saved addresses |
| POST | `/customer/addresses` | Add new address |
| PUT | `/customer/addresses/:id` | Update address |
| DELETE | `/customer/addresses/:id` | Delete address |
| GET | `/customer/favourites` | List favourite kitchens |
| POST | `/customer/favourites/:kitchenId` | Add to favourites |
| DELETE | `/customer/favourites/:kitchenId` | Remove from favourites |

### Kitchen Service (`/api/kitchen`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/kitchen/nearby?lat=&lng=&radius=5` | Get kitchens within radius |
| GET | `/kitchen/:kitchenId` | Kitchen detail |
| GET | `/kitchen/:kitchenId/menu?type=lunch` | Get menu (lunch/dinner) |
| GET | `/kitchen/:kitchenId/reviews` | Get reviews |

### Order Service (`/api/order`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/order` | Place new order |
| GET | `/order` | List customer's orders |
| GET | `/order/:orderId` | Get order detail |
| GET | `/order/:orderId/track` | Get current tracking status |
| POST | `/order/:orderId/rate` | Submit rating & review |
| POST | `/order/:orderId/reorder` | Clone order into cart |

### Coupon Service (`/api/coupon`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/coupon/validate` | Validate coupon code, return discount |

### WebSocket (`ws://<gateway>/ws/tracking`)

| Topic | Event | Payload |
|---|---|---|
| `/topic/order/{orderId}` | Status change | `{ status, timestamp, message }` |
| `/topic/order/{orderId}/location` | Delivery partner location | `{ lat, lng }` |

---

## 8. Data Models

### Customer
```
Customer {
  id            UUID
  mobileNumber  String (unique)
  fullName      String
  email         String
  profilePicUrl String?
  createdAt     DateTime
  updatedAt     DateTime
}
```

### Address
```
Address {
  id          UUID
  customerId  UUID (FK → Customer)
  label       Enum(HOME, WORK, OTHER)
  flatNo      String
  building    String?
  street      String
  area        String
  landmark    String?
  city        String
  pinCode     String
  lat         Double
  lng         Double
  isDefault   Boolean
}
```

### Order
```
Order {
  id              UUID
  customerId      UUID
  kitchenId       UUID
  deliveryAddress Address (embedded)
  items           OrderItem[]
  subtotal        Decimal
  deliveryCharge  Decimal
  tax             Decimal
  discount        Decimal
  grandTotal      Decimal
  couponCode      String?
  paymentMethod   Enum(UPI, CARD, COD, TEST)
  status          Enum(PLACED, ACCEPTED, PREPARING, READY,
                       PARTNER_ASSIGNED, PICKED_UP,
                       OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
  placedAt        DateTime
  deliveredAt     DateTime?
}

OrderItem {
  thaliType     Enum(STANDARD, MINI)
  quantity      Int
  basePrice     Decimal
  addOns        AddOnSelection[]
  lineTotal     Decimal
}

AddOnSelection {
  addOnId   UUID
  name      String
  quantity  Int
  price     Decimal
}
```

### Review
```
Review {
  id              UUID
  orderId         UUID
  customerId      UUID
  kitchenId       UUID
  foodRating      Int (1–5)
  deliveryRating  Int (1–5)
  comment         String?
  createdAt       DateTime
}
```

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Kitchen list must load within 2 seconds on 4G |
| Availability | 99.5% uptime for Order and Auth services |
| Security | Tokens stored in Keychain (iOS) / Keystore (Android); no plain localStorage |
| Offline | Cart persists offline; graceful error screens when no network |
| Accessibility | Minimum tap target 44×44pt; support Dynamic Font Size |
| Localization | English (Phase 1); Hindi support in Phase 2 |
| Platform | Android 10+ (API 29+); iOS 14+ |
| Image Loading | Lazy loading with placeholder skeleton; WebP format preferred |

---

## 10. Out of Scope (Phase 2)

| Feature | Notes |
|---|---|
| Real OTP SMS | Phase 1 uses hardcoded OTP `1234` |
| Live Payment Gateway | Razorpay / PhonePe / Stripe — mock "Place Order" in Phase 1 |
| Delivery Partner App | Separate application; out of scope for Customer App |
| Admin Dashboard | Separate web application |
| Referral Program | Deferred to Phase 2 |
| Customer Support Chat | Phase 3 |
| Multi-language Support | Hindi and regional languages in Phase 2 |
| Dark Mode | Phase 2 |
| Scheduled/Subscription Orders | Future roadmap |
