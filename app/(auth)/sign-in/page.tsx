"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoginMutation } from "../../lib/redux/features/auth/authApi";
import { getErrorMessage } from "../../lib/redux/features/auth/getErrorMessage";
import { signInSchema } from "../../lib/validation/authSchemas";
import { Form } from "../components/Form";
import EmailIcon from "../components/icons/EmailIcon";
import PasswordIcon from "../components/icons/PasswordIcon";

function Page() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await login(result.data).unwrap();
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Form.Form isLogin handleSubmit={handleSubmit} isSubmitting={isLoading}>
      <Form.Input
        placeholder="Email"
        onChange={handleEmailChange}
        icon={<EmailIcon />}
        name="email"
        value={email}
        type="email"
      />
      <Form.Input
        placeholder="Password"
        onChange={handlePasswordChange}
        icon={<PasswordIcon />}
        name="password"
        type="password"
        value={password}
      />
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </Form.Form>
  );
}

export default Page;
