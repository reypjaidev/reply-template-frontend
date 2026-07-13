"use client";
import { useState } from "react";
import { Form } from "../components/Form";
import EmailIcon from "../components/icons/EmailIcon";
import PasswordIcon from "../components/icons/PasswordIcon";
import UserIcon from "../components/icons/UserIcon";

function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    console.log("Form submitted", e);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Form.Form isLogin={false} handleSubmit={handleSubmit}>
      <Form.Input
        placeholder="Name"
        onChange={handleNameChange}
        icon={<UserIcon />}
        name="name"
        value={name}
      />
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
