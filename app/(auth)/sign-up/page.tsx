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
import { toast } from "sonner";

function Page() {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);

        const result = signUpSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
        });
        if (!result.success) {
            setErrors(result.error.issues.map((issue) => issue.message));
            return;
        }

        try {
            const { name, email, password } = result.data;
            await register({ name, email, password }).unwrap();
            toast.success("Account created successfully!");
            router.push("/");
        } catch (err) {
            setErrors([getErrorMessage(err)]);
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
            <p className="mt-2 px-6 text-left text-xs text-gray-400">
                Use at least 8 characters, including an uppercase letter, a
                number, and a special character.
            </p>
            <Form.Input
                placeholder="Confirm password"
                onChange={handleConfirmPasswordChange}
                icon={<PasswordIcon />}
                name="confirmPassword"
                type="password"
                value={confirmPassword}
            />
            {errors.length > 0 && (
                <ul
                    aria-live="polite"
                    className="mt-3 list-disc space-y-1 pl-6 text-left text-sm text-red-400"
                >
                    {errors.map((error, index) => (
                        <li key={`${error}-${index}`}>{error}</li>
                    ))}
                </ul>
            )}
        </Form.Form>
    );
}

export default Page;
