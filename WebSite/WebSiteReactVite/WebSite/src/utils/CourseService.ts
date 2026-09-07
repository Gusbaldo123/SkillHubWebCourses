//#region imports
import HttpMethod from "../model/HTTPMethods.js";
import RequestService from "./RequestService.js";

import type { Course } from "../model/Course.js";

//#endregion

class CourseService
{
    endpoint: string = "/user";

    async getDataFromJSON<T>(response: Response | null) {
        if (!response) return null;

        const status = response.status;
        let data: T | null = null;

        if (response.status !== 204) {
            try {
                data = await response.json() as T;
            }
            catch {
                data = null;
            }
        }

        return {
            status: status,
            success: response.ok,
            data: data
        };
    }

    //#region Handlers

    //#region Requests
    getById = async (courseId: number): Promise<Course | null> => {
        const response = await this.getDataFromJSON<Course>(await RequestService.fetchAPI(`${this.endpoint}/${courseId}`, HttpMethod.GET, null));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to get course by ID: ${response.status}`);

        return response.data;
    }

    addCourse = async (course: Course): Promise<Course | null> => {
        const response = await this.getDataFromJSON<Course>(await RequestService.fetchAPI(`${this.endpoint}`, HttpMethod.POST, course));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to add course: ${response.status}`);

        return response.data;
    }

    updateCourse = async (course: Course): Promise<Course | null> => {
        const response = await this.getDataFromJSON<Course>(await RequestService.fetchAPI(`${this.endpoint}/${course.id}`, HttpMethod.PUT, course));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to update course: ${response.status}`);

        return response.data;
    }

    deleteCourse = async (courseId: number): Promise<void> => {
        const response = await this.getDataFromJSON<void>(await RequestService.fetchAPI(`${this.endpoint}/${courseId}`, HttpMethod.DELETE, null));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to delete course: ${response.status}`);
    }
}

//#region exports

const courseService = new CourseService();

export default courseService;

//#endregion