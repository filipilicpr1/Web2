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

const AppRoutes: FC = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.user);
  const finishedRegistration = useAppSelector((state) => state.user.finishedRegistration);
  const isVerifiedSeller =
    user && user.userType === "SELLER" && user.isVerified && finishedRegistration;
  

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
        {isLoggedIn && (
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            {finishedRegistration && <Route path="/profile" element={<ProfilePage />} />}
            {finishedRegistration && <Route path="/change-password" element={<ChangePasswordPage />} />}
            {!finishedRegistration && <Route path="/finish-registration" element={<FinishRegistrationPage />} />}
            {isVerifiedSeller && (
              <Route path="/new-product" element={<NewProductPage />} />
            )}
            <Route path="*" element={<Navigate replace to={"/"} />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
