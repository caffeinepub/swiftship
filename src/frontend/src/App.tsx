import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import PaymentPage from "./pages/PaymentPage";
import TrackSearchPage from "./pages/TrackSearchPage";
import TrackingPage from "./pages/TrackingPage";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment/$orderId",
  component: PaymentPage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracking/$orderId",
  component: TrackingPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: TrackSearchPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  orderConfirmationRoute,
  paymentRoute,
  trackingRoute,
  adminRoute,
  trackRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}
