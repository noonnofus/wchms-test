import { twMerge } from "tailwind-merge";

export default function BookIcon(props: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className={twMerge("", props.className)}
        >
            <path
                d="M24 12.5056V38.5056M24 12.5056C21.6642 10.9537 18.493 10 15 10C11.507 10 8.33579 10.9537 6 12.5056V38.5056C8.33579 36.9537 11.507 36 15 36C18.493 36 21.6642 36.9537 24 38.5056M24 12.5056C26.3358 10.9537 29.507 10 33 10C36.493 10 39.6642 10.9537 42 12.5056V38.5056C39.6642 36.9537 36.493 36 33 36C29.507 36 26.3358 36.9537 24 38.5056"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
