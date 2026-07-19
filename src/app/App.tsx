import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { FloorPlanPage } from "../pages/FloorPlanPage";
import { HomePage } from "../pages/HomePage";
import { MePage } from "../pages/MePage";
import { OrderPage } from "../pages/OrderPage";
import { RewardsPage } from "../pages/RewardsPage";
import { RidePage } from "../pages/RidePage";
import { VisitPage } from "../pages/VisitPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="visit" element={<VisitPage />} />
          <Route path="visit/floor-plan" element={<FloorPlanPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="ride" element={<RidePage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="me" element={<MePage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
