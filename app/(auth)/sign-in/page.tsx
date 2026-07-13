"use client";

import { useState } from "react";
import { Form } from "../components/Form";
import EmailIcon from "../components/icons/EmailIcon";
import PasswordIcon from "../components/icons/PasswordIcon";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    console.log("Form submitted", e);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Form.Form isLogin handleSubmit={handleSubmit}>
      <Form.Input
        placeholder="Email"
        onChange={handleEmailChange}
        icon={<EmailIcon />}
        name="email"
        value={email}
      />
      <Form.Input
        placeholder="Password"
        onChange={handlePasswordChange}
        icon={<PasswordIcon />}
        name="password"
        type="password"
        value={password}
      />
    </Form.Form>
  );
}

export default Page;
