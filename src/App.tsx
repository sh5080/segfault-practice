import { RecoilRoot } from "recoil";

import "./global.css";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";

import { ErrorFallback } from "./lib/error-boundary";
import { Router } from "./route/router";

export default function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Router />
          </ErrorBoundary>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}
