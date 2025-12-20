"use client";

import { useState, useId } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	rightContent?: React.ReactNode;
	disabled?: boolean;
}

export function CollapsibleSection({
	title,
	children,
	defaultOpen = false,
	rightContent,
	disabled = false,
}: CollapsibleSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const uniqueId = useId();
	const contentId = `collapsible-content-${uniqueId}`;
	const buttonId = `collapsible-button-${uniqueId}`;

	const toggleOpen = () => {
		setIsOpen(prev => !prev);
	};

	return (
		<div className="border-b border-light-300">
			<button
				id={buttonId}
				type="button"
				onClick={toggleOpen}
				aria-expanded={isOpen}
				aria-controls={contentId}
				disabled={disabled}
				className={`flex w-full items-center justify-between py-5 text-left transition-colors hover:text-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dark-900 ${disabled ? "" : "cursor-pointer"}`}
			>
				<span className="text-body font-body-medium text-dark-900">{title}</span>
				<div className={`${disabled ? "hidden" : "flex"} items-center gap-3`}>
					{rightContent}
					{isOpen ? (
						<ChevronUp className="h-5 w-5 text-dark-900" aria-hidden="true" />
					) : (
						<ChevronDown className="h-5 w-5 text-dark-900" aria-hidden="true" />
					)}
				</div>
			</button>

			<div
				id={contentId}
				role="region"
				aria-labelledby={buttonId}
				className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="overflow-hidden">
					<div className="pb-5">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default CollapsibleSection;
