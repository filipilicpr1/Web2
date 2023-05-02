import React, { FC } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import LoginLayout from "../layouts/LoginLayout";
import AppLayout from "../layouts/AppLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import NewProductPage from "../pages/NewProductPage";
import FinishRegistrationPage from "../pages/FinishRegistrationPage";
import SellerProductsPage from "../pages/SellerProductsPage";
import CheckoutPage from "../pages/CheckoutPage";
import EditProductPage from "../pages/EditProductPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import AllOrdersPage from "../pages/AllOrdersPage";
import HistoryPage from "../pages/HistoryPage";
import ActiveOrdersPage from "../pages/ActiveOrdersPage";
import NewOrdersPage from "../pages/NewOrdersPage";
import DetailedOrderPage from "../pages/DetailedOrderPage";
import AllSellersPage from "../pages/AllSellersPage";
import VerifiedSellersPage from "../pages/VerifiedSellersPage";

const AppRoutes: FC = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.user);
  const finishedRegistration = useAppSelector(
    (state) => state.user.finishedRegistration
  );
  const isVerifiedSeller =
    user &&
    user.userType === "SELLER" &&
    user.isVerified &&
    finishedRegistration;
  const isBuyer = user && user.userType === "BUYER" && finishedRegistration;
  const isAdmin = user && user.userType === "ADMIN" && finishedRegistration;

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn && (
          <Route element={<LoginLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate replace to={"/login"} />} />
          </Route>
        )}
        {isLoggedIn && finishedRegistration && (
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/orders/:orderId" element={<DetailedOrderPage />} />
            {isBuyer && <Route path="/checkout" element={<CheckoutPage />} />}
            {isBuyer && <Route path="/history" element={<HistoryPage />} />}
            {isBuyer && <Route path="/active-orders" element={<ActiveOrdersPage />} />}
            {isVerifiedSeller && (
              <Route path="/new-product" element={<NewProductPage />} />
            )}
            {isVerifiedSeller && (
              <Route path="/my-products" element={<SellerProductsPage />} />
            )}
            {isVerifiedSeller && (
              <Route
                path="/my-products/:productId/edit"
                element={<EditProductPage />}
              />
            )}
            {isVerifiedSeller && (
              <Route path="/my-orders" element={<MyOrdersPage />} />
            )}
            {isVerifiedSeller && (
              <Route path="/new-orders" element={<NewOrdersPage />} />
            )}
            {isAdmin && (
              <Route path="/all-orders" element={<AllOrdersPage />} />
            )}
            {isAdmin && (
              <Route path="/all-sellers" element={<AllSellersPage />} />
            )}
            {isAdmin && (
              <Route path="/verified-sellers" element={<VerifiedSellersPage />} />
            )}
            <Route path="*" element={<Navigate replace to={"/"} />} />
          </Route>
        )}
        {isLoggedIn && !finishedRegistration && (
          <Route element={<AppLayout />}>
            <Route
              path="/finish-registration"
              element={<FinishRegistrationPage />}
            />
            <Route
              path="*"
              element={<Navigate replace to={"/finish-registration"} />}
            />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
