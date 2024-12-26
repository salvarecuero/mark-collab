"use client";

import { API_ROUTES } from "@/constants/routes";
import { encodedRedirect } from "@/lib/utils";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("fullName")?.toString();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/auth/sign-up",
      "Email and password are required"
    );
  }

  const response = await fetch(API_ROUTES.AUTH.SIGN_UP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });

  const data = await response.json();

  if (!response.ok) {
    return encodedRedirect("error", "/auth/sign-up", data.error);
  }

  return encodedRedirect("success", "/auth/sign-up", data.message);
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await fetch(API_ROUTES.AUTH.SIGN_IN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.status >= 400) {
    return encodedRedirect(
      "error",
      "/auth/sign-in",
      data.code === "invalid_credentials" ? "Invalid credentials" : data.error
    );
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect(
      "error",
      "/auth/forgot-password",
      "Email is required"
    );
  }

  const response = await fetch(API_ROUTES.AUTH.FORGOT_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    return encodedRedirect("error", "/auth/forgot-password", data.error);
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/auth/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/user/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/user/reset-password",
      "Passwords do not match"
    );
  }

  const response = await fetch(API_ROUTES.AUTH.RESET_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();

  if (!response.ok) {
    return encodedRedirect("error", "/user/reset-password", data.error);
  }

  return encodedRedirect("success", "/user/reset-password", "Password updated");
};

export const signOutAction = async () => {
  await fetch(API_ROUTES.AUTH.SIGN_OUT, { method: "POST" });
  return redirect("/");
};
