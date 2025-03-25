"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from "@/components/icons/delete-icon";
import EditIcon from "@/components/icons/edit-icon";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStaffByIdWithPassword } from "@/db/queries/admins";
import CloseSwipe from "@/components/icons/close-swipe";
import { useSwipeable } from "react-swipeable";
import CloseIcon from "@/components/icons/close-icon";
import EditAdmin from "@/components/manage/edit-admin";
import { getSessionsByStaffId } from "@/db/queries/sessions";
import { getCourseById } from "@/db/queries/courses";
import { CourseFull } from "@/db/schema/course";
import { User } from "@/db/schema/users";

export default function Profile() {
    const [staff, setStaff] = useState<User | null>(null);
    const [courses, setCourses] = useState<CourseFull[] | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [staffId, setStaffId] = useState<string | null>(null);
    const router = useRouter();

    const fetchData = async (id: string) => {
        try {
            if (!id) return;

            const staffData = await getStaffByIdWithPassword(parseInt(id));
            setStaff(staffData);
            const staffSessions = await getSessionsByStaffId(parseInt(id));
            if (staffSessions && staffSessions.length !== 0) {
                const courseIds = staffSessions.map(
                    (session) => session.courseId
                );
                const courses = await Promise.all(
                    courseIds.map((courseId) => getCourseById(courseId))
                );
                const validCourses = courses.filter(
                    (course): course is CourseFull => course !== null
                );

                setCourses(validCourses);
            }
        } catch (error) {
            console.error("Error fetching participant data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = sessionStorage.getItem("staffId");

            if (id) {
                setStaffId(id);
                fetchData(id);
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowEditPopup(false);
    };

    if (!staffId) {
        return (
            <div className="flex flex-col gap-4 items-center">
                <p className="font-semibold text-xl">No profile found</p>
                <Button
                    variant="outline"
                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                >
                    <Link href={"/admin/manage/staff"}>Back to Manage</Link>
                </Button>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!staff) return;

        try {
            const res = await fetch("/api/admin/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: staff.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");
            sessionStorage.removeItem("staffId");
            router.replace("/admin/manage/staff");
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
        }
    };

    const calculateAge = (dob: Date) => {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    if (!staff) return;
    const age = calculateAge(staff.dateOfBirth);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <main className="relative flex flex-col gap-10 w-full items-center h-full">
            {showEditPopup && staff && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setShowEditPopup(false)}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden "
                                {...swipeHandlers}
                            >
                                {/* Swipe indicator */}
                                <div className="absolute top-6 md:hidden">
                                    <CloseSwipe />
                                </div>
                            </div>
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-3 right-4"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <EditAdmin
                                closePopup={handleClosePopup}
                                adminData={staff}
                                onAdminUpdated={() => fetchData(staffId!)}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Popup */}
            {showDeletePopup && staff && (
                <div className="fixed inset-0 flex items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title="Delete Staff"
                            body={`Are you sure you want to delete staff member ${staff.firstName} ${staff.lastName}? You cannot undo this action.`}
                            actionLabel="DELETE"
                            handleSubmit={handleDelete}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            {/* Profile Content */}
            <div className="flex flex-col items-center">
                <h1 className="font-semibold text-2xl md:text-4xl text-center">
                    <span className="capitalize">
                        {staff?.firstName} {staff?.lastName}
                    </span>
                    &#39;s Profile
                </h1>
                <p className="text-base md:text-xl font-semibold text-[#6C757D]">
                    {staff?.role}
                </p>
            </div>

            <div className="flex w-24 h-24 md:w-40 md:h-40 text-2l md:text-3xl rounded-full bg-gray-200 items-center justify-center uppercase">
                {`${staff?.firstName[0]}${staff?.lastName[0]}`}
            </div>

            <div className="flex gap-2 absolute -top-6 right-0">
                <button onClick={() => setShowDeletePopup(true)}>
                    <DeleteIcon />
                </button>
                <button onClick={() => setShowEditPopup(true)}>
                    <EditIcon />
                </button>
            </div>

            <div className="flex flex-col gap-4 text-lg">
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Email:</p>
                    <p>{staff?.email}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Age: </p>
                    <p>{age}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Date of Birth:</p>
                    <p>
                        {staff?.dateOfBirth.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Gender:</p>
                    <p>{staff?.gender}</p>
                </div>
                {courses?.length === 0 ? (
                    <div className="flex flex-col w-full">
                        <p className="text-lg font-semibold">Courses:</p>
                        <p>
                            Participant is not currently enrolled in any courses
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        <p className="text-lg font-semibold">Courses:</p>
                        <ul className="w-full">
                            {courses?.map((course, index) => (
                                <li key={index} className="list-disc ml-8">
                                    {course.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
