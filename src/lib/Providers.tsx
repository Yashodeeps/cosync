"use client";

import React, { ReactNode } from "react";
import AuthProvider from "@/context/AuthProviders";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </Provider>
    </ThemeProvider>
  );
};

export default Providers;
