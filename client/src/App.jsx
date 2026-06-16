import { Routes, Route } from "react-router-dom";
import { DashboardContent } from "./components/sections/dashboard-content";
import { DashboardLayout } from "./components/sections/dashboard-layout";
import { HomePage } from "./components/sections/home-page";
import { HistoryPage } from "./components/sections/history-page";
import { AnalysisPage } from "./components/sections/analysis-page";
import { InsightsPage } from "./components/sections/insights-page";
import { AboutPage } from "./components/sections/about-page";
import { FarmProvider } from "./context/FarmContext";

function App() {
  return (
    <FarmProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </DashboardLayout>
    </FarmProvider>
  );
}

export default App;
