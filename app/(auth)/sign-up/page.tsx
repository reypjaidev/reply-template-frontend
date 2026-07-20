"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterMutation } from "../../lib/redux/features/auth/authApi";
import { getErrorMessage } from "../../lib/redux/features/auth/getErrorMessage";
import { signUpSchema } from "../../lib/validation/authSchemas";
import { Form } from "../components/Form";
import EmailIcon from "../components/icons/EmailIcon";
import PasswordIcon from "../components/icons/PasswordIcon";
import UserIcon from "../components/icons/UserIcon";

function Page() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const { name, email, password } = result.data;
      await register({ name, email, password }).unwrap();
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
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

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <Form.Form
      isLogin={false}
      handleSubmit={handleSubmit}
      isSubmitting={isLoading}
    >
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
      <Form.Input
        placeholder="Confirm password"
        onChange={handleConfirmPasswordChange}
        icon={<PasswordIcon />}
        name="confirmPassword"
        type="password"
        value={confirmPassword}
      />
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </Form.Form>
  );
}

export default Page;
