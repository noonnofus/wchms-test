"use server";
import db from "@/db";
import {
    CourseFull,
    CourseParticipant,
    Courses as coursesTable,
} from "@/db/schema/course";
import { desc, eq, and, like, not, exists } from "drizzle-orm";
import { uploadMedia } from "../schema/mediaUpload";
import {
    courseMaterials,
    CourseMaterialsWithFile,
} from "../schema/courseMaterials";
import { participants } from "@/db/schema/participants";
import { type Participant } from "../schema/participants";
import { CourseJoinRequests } from "../schema/courseJoinRequests";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { getSignedUrlFromFileKey } from "@/lib/s3";

export interface courseList {
    id: number;
    title: string;
    description: string | null;
    fileKey: string | null;
}
//Returns all courses that are available to users. Returns an object with an array of enrolled courses and unenrolled courses
export async function getAvailableCourses() {
    /* page = 1, limit = 10 */ //Uncomment in the future for pagination functionality
    "use server";
    try {
        const session = await getServerSession(authConfig);
        if (!session || !session.user.id) {
            throw new Error("User ID is required to fetch available courses.");
        }
        const availableCourses = await db
            .select({
                id: coursesTable.id,
                title: coursesTable.title,
                description: coursesTable.description,
                fileKey: uploadMedia.fileKey,
            })
            .from(coursesTable)
            .leftJoin(uploadMedia, eq(coursesTable.uploadId, uploadMedia.id))
            .where(eq(coursesTable.status, "Available"))
            .orderBy(desc(coursesTable.id));

        const userCourses = await db
            .select({
                courseId: CourseParticipant.courseId,
            })
            .from(CourseParticipant)
            .where(eq(CourseParticipant.userId, parseInt(session.user.id)));

        const userCourseIds = userCourses.map((course) => course.courseId);

        const enrolledCourses: courseList[] = [];
        const unenrolledCourses: courseList[] = [];

        availableCourses.forEach((course) => {
            if (userCourseIds.includes(course.id)) {
                enrolledCourses.push(course);
            } else {
                unenrolledCourses.push(course);
            }
        });
        return {
            enrolled: enrolledCourses,
            unenrolled: unenrolledCourses,
        };
    } catch (error) {
        console.error("Error fetching courses", error);
        return { enrolled: [], unenrolled: [] };
    }
}

export async function getAllCourses(withImages = false) {
    "use server";
    try {
        //TODO: Validate user is admin

        const courses = await db
            .select({
                id: coursesTable.id,
                title: coursesTable.title,
                description: coursesTable.description,
                start: coursesTable.start,
                end: coursesTable.end,
                kind: coursesTable.kind,
                status: coursesTable.status,
                lang: coursesTable.lang,
                roomId: coursesTable.roomId,
                uploadId: coursesTable.uploadId,
                fileKey: uploadMedia.fileKey,
            })
            .from(coursesTable)
            .leftJoin(uploadMedia, eq(coursesTable.uploadId, uploadMedia.id))
            .orderBy(desc(coursesTable.id));
        if (withImages) {
            const coursesWithImages = await Promise.all(
                courses.map(async (course) => {
                    const imageUrl =
                        course.fileKey !== null
                            ? await getSignedUrlFromFileKey(course.fileKey)
                            : null;
                    return { ...course, imageUrl };
                })
            );
            return coursesWithImages;
        }

        return courses;
    } catch (error) {
        console.error("Error fetching courses", error);
        return [];
    }
}

export async function getUploadId(courseId: number) {
    try {
        const course = await getCourseById(courseId);
        if (course) {
            return course.uploadId;
        }
        return null;
    } catch (error) {
        console.error("Error fetching uploadId:", error);
        return null;
    }
}

//Uncomment in the future for pagination functionality
export async function getUserCourses(
    userId: number
    /* page = 1, limit = 10 */
) {
    "use server";
    try {
        //TODO: Validate User is the userId or admin.

        // const offset = (page - 1) * limit;

        const courses = await db
            .select()
            .from(coursesTable)
            .innerJoin(
                CourseParticipant,
                eq(CourseParticipant.courseId, coursesTable.id)
            )
            .where(eq(CourseParticipant.userId, userId));
        // .limit(limit) //limit number of courses
        // .offset(offset); //Set the starting point of query

        return courses;
    } catch (error) {
        console.error("Error fetching user courses", error);
        return [];
    }
}

export async function getCourseById(
    courseId: number,
    withImage = false,
    withParticipants = false,
    withMaterials = false
) {
    "use server";
    try {
        //TODO: withParticipants, verify administrator or member, return with participants
        //TODO: withMaterials, verify administrator or member, return with course materials
        // Changed to give image file with name and type
        const courseQuery = db
            .select({
                id: coursesTable.id,
                title: coursesTable.title,
                description: coursesTable.description,
                uploadId: coursesTable.uploadId,
                fileKey: uploadMedia.fileKey,
                start: coursesTable.start,
                end: coursesTable.end,
                roomId: coursesTable.roomId,
                lang: coursesTable.lang,
                kind: coursesTable.kind,
                status: coursesTable.status,
            })
            .from(coursesTable)
            .leftJoin(uploadMedia, eq(coursesTable.uploadId, uploadMedia.id))
            .where(eq(coursesTable.id, courseId))
            .then((res) => res[0]);

        let course: CourseFull = { ...(await courseQuery) };
        if (withImage) {
            const imageUrl =
                course.fileKey !== null
                    ? await getSignedUrlFromFileKey(course.fileKey)
                    : null;
            course = { ...course, imageUrl };
        }
        if (withMaterials) {
            const materials = await db
                .select({
                    id: courseMaterials.id,
                    title: courseMaterials.title,
                    type: courseMaterials.type,
                    difficulty: courseMaterials.difficulty,
                    description: courseMaterials.description,
                    courseId: courseMaterials.courseId,
                    createdAt: courseMaterials.createdAt,
                    uploadId: courseMaterials.uploadId,
                    url: courseMaterials.url,
                    file: {
                        fileName: uploadMedia.fileName,
                        fileType: uploadMedia.fileType,
                        fileSize: uploadMedia.fileSize,
                        fileKey: uploadMedia.fileKey,
                    },
                })
                .from(courseMaterials)
                .leftJoin(
                    uploadMedia,
                    eq(courseMaterials.uploadId, uploadMedia.id)
                )
                .where(eq(courseMaterials.courseId, courseId))
                .orderBy(desc(courseMaterials.createdAt));

            let materialsWithUrl: CourseMaterialsWithFile[] | undefined;

            if (materials) {
                materialsWithUrl = await Promise.all(
                    materials.map(async (material) =>
                        material.url
                            ? material
                            : {
                                  ...material,
                                  url: material.file?.fileKey
                                      ? await getSignedUrlFromFileKey(
                                            material.file.fileKey,
                                            true,
                                            material.file.fileName
                                        )
                                      : null,
                              }
                    )
                );
            }

            course = {
                ...course,
                materials: materialsWithUrl,
            };
        }

        let participantsData: Participant[] = [];
        if (withParticipants) {
            participantsData = await db
                .select({
                    id: participants.id,
                    firstName: participants.firstName,
                    lastName: participants.lastName,
                    email: participants.email,
                    dateOfBirth: participants.dateOfBirth,
                    gender: participants.gender,
                })
                .from(CourseParticipant)
                .innerJoin(
                    participants,
                    eq(CourseParticipant.userId, participants.id)
                )
                .where(eq(CourseParticipant.courseId, courseId));

            course = {
                ...course,
                participants: participantsData,
            };
        }

        return course;
    } catch (error) {
        console.error("Error fetching courses", error);
        return undefined;
    }
}

export async function getLatestPhysicalMaterial() {
    //TODO: Get user Id to validate the course is a course user assigned.

    // It's returns Undefined now
    const session = await getServerSession(authConfig);
    const userId = session?.user.id;

    const latestCourse = await db
        .select({
            id: coursesTable.id,
            title: coursesTable.title,
            description: coursesTable.description,
            uploadId: coursesTable.uploadId,
            imageFileName: uploadMedia.fileName,
            start: coursesTable.start,
            end: coursesTable.end,
            roomId: coursesTable.roomId,
            lang: coursesTable.lang,
            kind: coursesTable.kind,
            status: coursesTable.status,
        })
        .from(coursesTable)
        .leftJoin(uploadMedia, eq(coursesTable.uploadId, uploadMedia.id))
        .orderBy(desc(coursesTable.start))
        .then((res) => res[0]);

    const material = await db
        .select({
            id: courseMaterials.id,
            title: courseMaterials.title,
            type: courseMaterials.type,
            difficulty: courseMaterials.difficulty,
            description: courseMaterials.description,
            courseId: courseMaterials.courseId,
            createdAt: courseMaterials.createdAt,
            uploadId: courseMaterials.uploadId,
            url: courseMaterials.url,
            file: {
                fileName: uploadMedia.fileName,
                fileType: uploadMedia.fileType,
                fileSize: uploadMedia.fileSize,
                // fileKey: uploadMedia.fileKey,
            },
        })
        .from(courseMaterials)
        .leftJoin(uploadMedia, eq(courseMaterials.uploadId, uploadMedia.id))
        .where(
            and(
                eq(courseMaterials.courseId, latestCourse.id),
                like(courseMaterials.url, "http%")
            )
        )
        .orderBy(desc(courseMaterials.createdAt));

    return material;
}

// COURSE JOIN REQUESTS

export async function createCourseJoinRequest(
    courseId: number,
    participantId: number
) {
    "use server";
    try {
        await db.insert(CourseJoinRequests).values({
            participantId: participantId,
            courseId: courseId,
        });

        console.log("Course join request created successfully.");
    } catch (error) {
        console.error("Error creating course join request", error);
        throw error;
    }
}

export async function deleteCourseJoinRequest(
    courseId: number,
    participantId: number
) {
    "use server";
    try {
        await db
            .delete(CourseJoinRequests)
            .where(
                and(
                    eq(CourseJoinRequests.courseId, courseId),
                    eq(CourseJoinRequests.participantId, participantId)
                )
            );
    } catch (error) {
        console.error("Error deleting course join request", error);
        throw error;
    }
}

export async function checkCourseJoinRequestExists(
    courseId: number,
    participantId: number
) {
    "use server";
    try {
        const result = await db
            .select()
            .from(CourseJoinRequests)
            .where(
                and(
                    eq(CourseJoinRequests.courseId, courseId),
                    eq(CourseJoinRequests.participantId, participantId)
                )
            )
            .limit(1);

        return result.length > 0;
    } catch (error) {
        console.error("Error checking for course join request", error);
        throw error;
    }
}

export async function getAllCourseJoinRequests(courseId: number) {
    "use server";
    try {
        const requests = await db
            .select()
            .from(CourseJoinRequests)
            .where(eq(CourseJoinRequests.courseId, courseId));

        return requests;
    } catch (error) {
        console.error("Error fetching course join requests", error);
        throw error;
    }
}

export async function getUnenrolledParticipants(courseId: number) {
    "use server";
    try {
        const unenrolledParticipants = await db
            .select()
            .from(participants)
            .where(
                and(
                    not(
                        exists(
                            db
                                .select()
                                .from(CourseParticipant)
                                .where(
                                    and(
                                        eq(
                                            CourseParticipant.courseId,
                                            courseId
                                        ),
                                        eq(
                                            CourseParticipant.userId,
                                            participants.id
                                        )
                                    )
                                )
                        )
                    )
                )
            );
        return unenrolledParticipants;
    } catch (error) {
        console.error("Error fetching unenrolled participants", error);
        return [];
    }
}
