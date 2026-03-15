# SwiftShip

## Current State
SwiftShip is a logistics app with a full booking flow (order form → confirmation → payment → tracking) and an admin panel with 7 sections. All order data, notifications, and service requests are stored in **localStorage only**, meaning orders placed by users on one device/browser are invisible to the admin on another device. The backend canister is empty (`actor {}`). This is the core problem to fix.

## Requested Changes (Diff)

### Add
- Motoko backend with persistent storage for: Orders, Notifications, ServiceRequests, and a simple user registry (by session/browser fingerprint)
- Backend functions: createOrder, getOrder, getAllOrders, updateOrderStatus, confirmPayment, updateOrderFull, createServiceRequest, getAllServiceRequests, addNotification, getNotifications, registerUser, getAllUsers
- Frontend data layer that calls backend APIs for all read/write operations (replacing localStorage for orders, notifications, service requests, users)
- Users registered automatically when they place an order (capture name, email, phone)

### Modify
- `orders.ts` utility: keep the same interface but route all calls through backend canister instead of localStorage (or use a hybrid: write to both, read from backend as source of truth)
- AdminPage: all 7 tabs (Dashboard, Orders, Payments, Users, Tracking Control, Notifications, Service Requests) pull live data from backend
- HomePage booking form: on submit, call backend `createOrder`
- PaymentPage: on payment confirmation, call backend `confirmPayment`
- TrackingPage: read order status from backend in real-time
- TrackSearchPage: look up orders from backend

### Remove
- localStorage as the sole data store for orders/notifications/service requests

## Implementation Plan
1. Generate Motoko backend with Order, Notification, ServiceRequest, User types and all CRUD functions
2. Update frontend data utilities to call backend actor methods
3. Update all pages (HomePage, PaymentPage, TrackingPage, TrackSearchPage, AdminPage) to use live backend data
4. Ensure admin status updates propagate to customer tracking in real time via backend
