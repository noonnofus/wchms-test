import { twMerge } from "tailwind-merge";

export default function ChevronUpIcon(props: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="7"
            viewBox="0 0 13 7"
            fill="none"
            className={twMerge("", props.className)}
        >
            <path
                d="M1 6L6.5 0.999999L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
