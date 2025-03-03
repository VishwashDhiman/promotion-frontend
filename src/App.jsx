import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import { Provider } from "react-redux";
import store from "./redux/store";
import ReportingPage from './ReportingDashboard';
import PromotionDashboard from './PromotionDashboard'
import {  QueryClient, QueryClientProvider } from 'react-query';
import { Button } from "@mui/material";
import "./i18n";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();

function App() {
  const { t } = useTranslation();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div style={{ padding: "20px" }}>
            <Button variant="contained" color="primary" component={Link} to="/">{t("dashboard")}</Button>
            <Button variant="contained" color="secondary" component={Link} to="/reporting" style={{ marginLeft: "10px" }}>{t("reporting")}</Button>
          </div>
          <Routes>
            <Route path="/" element={<PromotionDashboard />} />
            <Route path="/reporting" element={<ReportingPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
