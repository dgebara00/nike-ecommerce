import { forwardRef } from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	fullWidth?: boolean;
	children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-dark-900 text-light-100 hover:bg-dark-700 focus:ring-dark-900",
	outline: "bg-light-100 text-dark-900 border border-light-300 hover:bg-light-200 focus:ring-dark-500",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = "primary", fullWidth = false, children, className = "", disabled, ...props }, ref) => {
		return (
			<button
				ref={ref}
				disabled={disabled}
				className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-body font-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
					variantStyles[variant]
				} ${fullWidth ? "w-full" : ""} ${className}`}
				{...props}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";

export default Button;
