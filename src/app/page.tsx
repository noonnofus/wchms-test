"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="my-6 flex flex-col px-6 gap-4 w-full flex-grow min-h-0">
      <div className="min-h-14 border-2 border-primary-green rounded-[8px] flex items-center justify-center">
        <p className="text-primary-green text-base">
          Next Session in <strong>3 Days</strong>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Button className="min-h-32 rounded-[8px] bg-courses-blue hover:bg-[#004F8A]">
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
            <p className="text-2xl">Courses</p>
          </div>
        </Button>
        <Button className="min-h-32 rounded-[8px] bg-activities-purple hover:bg-[#5F2480]">
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
                d="M22 10H12C9.79086 10 8 11.7909 8 14V36C8 38.2091 9.79086 40 12 40H34C36.2091 40 38 38.2091 38 36V26M35.1716 7.17157C36.7337 5.60948 39.2663 5.60948 40.8284 7.17157C42.3905 8.73367 42.3905 11.2663 40.8284 12.8284L23.6568 30H18L18 24.3431L35.1716 7.17157Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-2xl">Activities</p>
          </div>
        </Button>
        <Button className="min-h-32 rounded-[8px] bg-primary-green hover:bg-[#045B47]">
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
                d="M22 6.10986C13.0001 7.10475 6 14.7349 6 24C6 33.9411 14.0589 42 24 42C33.2651 42 40.8953 34.9999 41.8901 26H22V6.10986Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40.9756 18H30V7.0246C35.1144 8.83227 39.1679 12.8857 40.9756 18Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-2xl">Progress</p>
          </div>
        </Button>
        <Button className="min-h-32 rounded-[8px] bg-discussion-pink hover:bg-[#9B0049]">
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
                d="M34 40H44V36C44 32.6863 41.3137 30 38 30C36.0888 30 34.3863 30.8936 33.2875 32.2858M34 40H14M34 40V36C34 34.6875 33.7472 33.4341 33.2875 32.2858M14 40H4V36C4 32.6863 6.68629 30 10 30C11.9112 30 13.6137 30.8936 14.7125 32.2858M14 40V36C14 34.6875 14.2528 33.4341 14.7125 32.2858M14.7125 32.2858C16.187 28.6021 19.7896 26 24 26C28.2104 26 31.813 28.6021 33.2875 32.2858M30 14C30 17.3137 27.3137 20 24 20C20.6863 20 18 17.3137 18 14C18 10.6863 20.6863 8 24 8C27.3137 8 30 10.6863 30 14ZM42 20C42 22.2091 40.2091 24 38 24C35.7909 24 34 22.2091 34 20C34 17.7909 35.7909 16 38 16C40.2091 16 42 17.7909 42 20ZM14 20C14 22.2091 12.2091 24 10 24C7.79086 24 6 22.2091 6 20C6 17.7909 7.79086 16 10 16C12.2091 16 14 17.7909 14 20Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-2xl">Discussion</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
