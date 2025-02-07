"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLanding() {
    return (
        <div className="flex flex-col gap-10 w-full h-full items-center justify-center">
            <h1 className="font-semibold text-4xl">Instructor Overview</h1>
            <div className="w-full flex flex-col gap-4">
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-courses-blue hover:bg-[#004F8A]"
                >
                    <Link href="/courses">
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                className="min-w-12 min-h-12"
                            >
                                <path
                                    d="M24 12.5056V38.5056M24 12.5056C21.6642 10.9537 18.493 10 15 10C11.507 10 8.33579 10.9537 6 12.5056V38.5056C8.33579 36.9537 11.507 36 15 36C18.493 36 21.6642 36.9537 24 38.5056M24 12.5056C26.3358 10.9537 29.507 10 33 10C36.493 10 39.6642 10.9537 42 12.5056V38.5056C39.6642 36.9537 36.493 36 33 36C29.507 36 26.3358 36.9537 24 38.5056"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-2xl md:text-3xl">Courses</p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-primary-green hover:bg-[#045B47]"
                >
                    <Link href="#">
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="min-w-12 min-h-12"
                            >
                                <path
                                    d="M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M24 28C16.268 28 10 34.268 10 42H38C38 34.268 31.732 28 24 28Z"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <p className="text-2xl md:text-3xl">Participants</p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-discussion-pink hover:bg-[#9B0049]"
                >
                    <Link href="#">
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 64 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="min-w-12 min-h-12"
                            >
                                <path
                                    d="M27.5323 11.5128C28.6694 6.82906 35.3306 6.82906 36.4677 11.5128C37.2022 14.5385 40.6687 15.9743 43.3275 14.3543C47.4435 11.8464 52.1536 16.5565 49.6457 20.6725C48.0257 23.3313 49.4615 26.7978 52.4872 27.5323C57.1709 28.6694 57.1709 35.3306 52.4872 36.4677C49.4615 37.2022 48.0257 40.6687 49.6457 43.3275C52.1536 47.4435 47.4435 52.1536 43.3275 49.6457C40.6687 48.0257 37.2022 49.4615 36.4677 52.4872C35.3306 57.1709 28.6694 57.1709 27.5323 52.4872C26.7978 49.4615 23.3314 48.0257 20.6725 49.6457C16.5565 52.1536 11.8464 47.4435 14.3543 43.3275C15.9743 40.6687 14.5385 37.2022 11.5128 36.4677C6.82906 35.3306 6.82906 28.6694 11.5128 27.5323C14.5385 26.7978 15.9743 23.3313 14.3543 20.6725C11.8464 16.5565 16.5565 11.8464 20.6725 14.3543C23.3313 15.9743 26.7978 14.5385 27.5323 11.5128Z"
                                    stroke="white"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M40 32C40 36.4183 36.4183 40 32 40C27.5817 40 24 36.4183 24 32C24 27.5817 27.5817 24 32 24C36.4183 24 40 27.5817 40 32Z"
                                    stroke="white"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-2xl md:text-3xl">Manage</p>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
