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
import DetailProduct from "./pages/user/detail-product";
import CartPage from "./pages/user/cart";
import AdminCRUD from "./pages/super-admin/admin";

import { Provider } from "react-redux";
import { ThemeProvider } from "./components/themes/theme-provider";
import { store } from "./store/store";
import { AuthProvider } from "./hooks/useAuth";
import RequireAuth from "./components/auth/RequireAuth"; // Import the RequireAuth component
import UserTransaction from "./pages/user/transaction";
import AdminTransaction from "./pages/admin/transaction";
import DetailTransaction from "./pages/user/detail-transaction";
import UnauthLayout from "./components/layouts/layout-unauth";
import UserProfile from "./pages/user/profile";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<RequireAuth publicPage={true} />}>
                <Route element={<UnauthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
              </Route>

              <Route element={<UserLayout />}>
                <Route path="/" element={<UserDashboard />} />
                <Route path="detail" element={<DetailProduct />} />
              </Route>

              {/* User Protected Routes */}
              <Route
                element={
                  <RequireAuth
                    allowedRoles={[
                      "user",
                      !"adminSales",
                      !"adminStorage",
                      !"superAdmin",
                    ]}
                  />
                }
              >
                <Route path="/" element={<UserLayout />}>
                  <Route path="cart" element={<CartPage />} />
                  <Route path="transaction" element={<UserTransaction />} />
                  <Route
                    path="transaction/detail"
                    element={<DetailTransaction />}
                  />
                  <Route path="profile" element={<UserProfile />} />
                </Route>
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<RequireAuth allowedRoles={["adminSales"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="product" element={<ProductPage />} />
                  <Route path="transaction" element={<AdminTransaction />} />
                </Route>
              </Route>

              {/* Super Admin Protected Routes */}
              <Route element={<RequireAuth allowedRoles={["superAdmin"]} />}>
                <Route path="super-admin" element={<SuperAdminLayout />}>
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="admin" element={<AdminCRUD />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
