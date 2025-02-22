"use server";
import db from "@/db";
import {
    CourseFull,
    CourseParticipant,
    Courses as coursesTable,
} from "@/db/schema/course";
import { desc, eq } from "drizzle-orm";
import { uploadMedia } from "../schema/mediaUpload";
import { courseMaterials } from "../schema/courseMaterials";

export interface courseList {
    id: number;
    title: string;
    description: string | null;
}
//Returns all courses that are available to users. Returns an object with an array of enrolled courses and unenrolled courses
export async function getAvailableCourses() {
    /* page = 1, limit = 10 */ //Uncomment in the future for pagination functionality
    "use server";
    try {
        const userId = 1; //TODO: update to use current session user id
        const availableCourses = await db
            .select({
                id: coursesTable.id,
                title: coursesTable.title,
                description: coursesTable.description,
            })
            .from(coursesTable)
            .where(eq(coursesTable.status, "Available"));

        const userCourses = await db
            .select({
                courseId: CourseParticipant.courseId,
            })
            .from(CourseParticipant)
            .where(eq(CourseParticipant.userId, userId));

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

//Uncomment in the future for pagination functionality
export async function getAllCourses(/* page = 1, limit = 10 */) {
    "use server";
    try {
        //TODO: Validate user is admin

        // const offset = (page - 1) * limit;

        const courses = await db
            .select()
            .from(coursesTable)
            // .limit(limit) //limit number of courses
            // .offset(offset); // Set the starting point of query
            .orderBy(desc(coursesTable.id));

        return courses;
    } catch (error) {
        console.error("Error fetching courses", error);
        return [];
    }
}

export const fetchCourseImage = async (uploadId: number) => {
    try {
        const result = await db
            .select()
            .from(uploadMedia)
            .where(eq(uploadMedia.id, uploadId))
            .limit(1);

        if (result.length > 0) {
            const { fileData, fileType } = result[0];
            const imageUrl = `data:${fileType};base64,${fileData}`;
            return imageUrl;
        }

        return null;
    } catch (error) {
        console.error("Error fetching course image", error);
        return null;
    }
};

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
            .where(eq(coursesTable.id, courseId))
            .then((res) => res[0]);

        let course: CourseFull = { ...(await courseQuery) };

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
                    file: {
                        fileName: uploadMedia.fileName,
                        fileType: uploadMedia.fileType,
                        fileSize: uploadMedia.fileSize,
                        fileData: uploadMedia.fileData,
                    },
                })
                .from(courseMaterials)
                .leftJoin(
                    uploadMedia,
                    eq(courseMaterials.uploadId, uploadMedia.id)
                )
                .where(eq(courseMaterials.courseId, courseId));

            course = {
                ...course,
                materials,
            };
        }

        return course;
    } catch (error) {
        console.error("Error fetching courses", error);
        return undefined;
    }
}

export async function createCourseWithMedia(courseData: any, mediaId?: number) {
    "use server";
    try {
        const [course] = await db.insert(coursesTable).values({
            ...courseData,
            uploadId: mediaId,
        });

        if (mediaId) {
            await db
                .update(uploadMedia)
                .set({ originId: course.insertId })
                .where(eq(uploadMedia.id, mediaId));
        }

        return course;
    } catch (error) {
        console.error("Error creating course with media:", error);
        throw error;
    }
}

export async function updateCourseMedia(courseId: number, mediaId: number) {
    "use server";
    try {
        await db
            .update(coursesTable)
            .set({ uploadId: mediaId })
            .where(eq(coursesTable.id, courseId));

        await db
            .update(uploadMedia)
            .set({ originId: courseId })
            .where(eq(uploadMedia.id, mediaId));

        return true;
    } catch (error) {
        console.error("Error updating course media:", error);
        throw error;
    }
}
