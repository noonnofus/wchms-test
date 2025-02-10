import { twMerge } from "tailwind-merge";

export default function DeleteIcon(props: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            className={twMerge("", props.className)}
        >
            <path
                d="M21 15.75V21M21 21V26.25M21 21H26.25M21 21H15.75M36.75 21C36.75 29.6985 29.6985 36.75 21 36.75C12.3015 36.75 5.25 29.6985 5.25 21C5.25 12.3015 12.3015 5.25 21 5.25C29.6985 5.25 36.75 12.3015 36.75 21Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
