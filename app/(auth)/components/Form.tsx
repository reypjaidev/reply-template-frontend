import cslx from "clsx";
import Link from "next/link";

interface FormContainerProps {
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  isLogin: boolean;
  isSubmitting?: boolean;
}

interface FormInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "email";
  name: string;
  icon: React.ReactNode;
}

const FormContainer = ({
  handleSubmit,
  children,
  isLogin,
  isSubmitting = false,
}: FormContainerProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full sm:w-87.5 text-center bg-white/6 border border-white/10 rounded-2xl px-8"
    >
      <h1 className="text-white text-3xl mt-10 font-medium">
        {isLogin ? "Login" : "Sign up"}
      </h1>
      <p className="text-gray-400 text-sm mt-2">
        {isLogin
          ? "Please sign in to continue"
          : "Please sign up to continue"}{" "}
      </p>
      {children}
      {isLogin && (
        <div className="mt-4 text-left">
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-400 hover:underline"
          >
            Forget password?
          </Link>
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cslx(
          "w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:cursor-not-allowed disabled:opacity-60",
          isLogin ? "mt-2" : "mt-4",
        )}
      >
        {isSubmitting ? "Please wait…" : isLogin ? "Login" : "Sign up"}
      </button>

      <Link
        href={isLogin ? "/sign-up" : "/sign-in"}
        className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer inline-block"
      >
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span className="text-indigo-400 hover:underline ml-1">click here</span>
      </Link>
    </form>
  );
};

const FormInput = ({
  value,
  onChange,
  type = "text",
  name,
  placeholder,
  icon,
}: FormInputProps) => {
  return (
    <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
      {icon}
      <label htmlFor={name} aria-label={name} className="sr-only" />
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export const Form = {
  Form: FormContainer,
  Input: FormInput,
};
