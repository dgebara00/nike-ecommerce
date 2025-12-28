"use client";

type Props = {
	className?: string;
};

function CurrentYear({ className }: Props) {
	const year = new Date().getFullYear();
	return <span className={className}>{year}</span>;
}

export default CurrentYear;
