import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";

const HomePage = lazy(() =>
  import("../pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const VisitPage = lazy(() =>
  import("../pages/VisitPage").then((module) => ({ default: module.VisitPage })),
);
const ZoneSelectionPage = lazy(() =>
  import("../pages/ZoneSelectionPage").then((module) => ({ default: module.ZoneSelectionPage })),
);
const FloorPlanPage = lazy(() =>
  import("../pages/FloorPlanPage").then((module) => ({ default: module.FloorPlanPage })),
);
const WatchTonightPage = lazy(() =>
  import("../pages/WatchTonightPage").then((module) => ({ default: module.WatchTonightPage })),
);
const OrderPage = lazy(() =>
  import("../pages/OrderPage").then((module) => ({ default: module.OrderPage })),
);
const RidePage = lazy(() =>
  import("../pages/RidePage").then((module) => ({ default: module.RidePage })),
);
const RewardsPage = lazy(() =>
  import("../pages/RewardsPage").then((module) => ({ default: module.RewardsPage })),
);
const MePage = lazy(() => import("../pages/MePage").then((module) => ({ default: module.MePage })));

function withPageLoader(page: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="route-loader" role="status">
          Loading this part of your visit…
        </div>
      }
    >
      {page}
    </Suspense>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={withPageLoader(<HomePage />)} />
          <Route path="visit" element={withPageLoader(<VisitPage />)} />
          <Route path="visit/zones" element={withPageLoader(<ZoneSelectionPage />)} />
          <Route path="visit/floor-plan" element={withPageLoader(<FloorPlanPage />)} />
          <Route path="visit/watch" element={withPageLoader(<WatchTonightPage />)} />
          <Route path="order" element={withPageLoader(<OrderPage />)} />
          <Route path="order/food" element={withPageLoader(<OrderPage />)} />
          <Route path="order/drinks" element={withPageLoader(<OrderPage />)} />
          <Route path="order/group" element={withPageLoader(<OrderPage />)} />
          <Route path="order/status" element={withPageLoader(<OrderPage />)} />
          <Route path="order/collection" element={withPageLoader(<OrderPage />)} />
          <Route path="ride" element={withPageLoader(<RidePage />)} />
          <Route path="rewards" element={withPageLoader(<RewardsPage />)} />
          <Route path="me" element={withPageLoader(<MePage />)} />
          <Route path="me/memory" element={withPageLoader(<MePage />)} />
          <Route path="me/settings" element={withPageLoader(<MePage />)} />
          <Route path="me/receipts" element={withPageLoader(<MePage />)} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
