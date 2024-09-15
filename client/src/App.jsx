import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import UserLayout from "./components/layouts/layout-user";
import AdminLayout from "./components/layouts/layout-admin";
import SuperAdminLayout from "./components/layouts/layout-super-admin";

import UserDashboard from "./pages/user/dashboard-user";
import AdminDashboard from "./pages/admin/dashboard-admin";
import SuperAdminDashboard from "./pages/super-admin/dashboard-super-admin";

import ProductPage from "./pages/admin/product";

import { Provider } from "react-redux";
import { ThemeProvider } from "./components/themes/theme-provider";

import { store } from "./store/store";
import DetailProduct from "./pages/user/detail-product";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/" element={<UserLayout />}>
              <Route path="" element={<UserDashboard />} />
              <Route path="detail" element={<DetailProduct />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="product" element={<ProductPage />} />
            </Route>

            <Route path="super-admin" element={<SuperAdminLayout />}>
              <Route path="dashboard" element={<SuperAdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
