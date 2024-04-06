import React from "react";
import { SignInForm } from "component/sign-in-form";

export default function SignInPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "50%", maxWidth: "400px" }}>
        {" "}
        <SignInForm />
      </div>
    </div>
  );
}
