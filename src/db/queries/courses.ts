"use server";
import db from "@/db";
import { eq, desc, and, or } from "drizzle-orm";
import { CourseParticipant, Courses as coursesTable } from "@/db/schema/course";

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
        const course = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.id, courseId));
        return course;
    } catch (error) {
        console.error("Error fetching courses", error);
        return [];
    }
}
