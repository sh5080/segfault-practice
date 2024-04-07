import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import SignInPage from "../app/sign-in.page";

import MainPage from "../app/main.page";
import NotFoundPage from "../app/not-found.page";

import { paths } from "./path";
import { useUser } from "state/user.state";

export function Router() {
  const { name } = useUser();

  if (!name) {
    return (
      <Routes>
        <Route path={paths.home} element={<SignInPage />} />
        <Route path={paths.auth.signIn} element={<SignInPage />} />
        <Route path={paths.errors.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={paths.home} />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path={paths.home} element={<MainPage />} />
      <Route path={paths.errors.notFound} element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={paths.home} />} />
    </Routes>
  );
}
