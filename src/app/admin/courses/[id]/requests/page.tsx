"use client";
import RequestCard from "@/components/courses/request-card";
import { getAllCourseJoinRequests } from "@/db/queries/courses";
import { CourseJoinRequest } from "@/db/schema/courseJoinRequests";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Requests() {
    const { id } = useParams();
    const [courseJoinRequests, setCourseJoinRequests] = useState<
        CourseJoinRequest[] | null
    >(null);

    useEffect(() => {
        const fetchJoinRequests = async () => {
            try {
                if (!id) return;
                const requests = await getAllCourseJoinRequests(
                    parseInt(id as string)
                );
                console.log(requests);
                if (requests) setCourseJoinRequests(requests);
            } catch (error) {
                console.error("Error fetching ");
            }
        };
        fetchJoinRequests();
    }, [id]);
    return (
        <div className="flex flex-col gap-10 w-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                Course Enrollment Requests
            </h1>
            <div className="w-full flex flex-col items-center gap-4">
                {courseJoinRequests && courseJoinRequests.length > 0
                    ? courseJoinRequests.map((request) => (
                          <RequestCard request={request} />
                      ))
                    : null}
            </div>
        </div>
    );
}
