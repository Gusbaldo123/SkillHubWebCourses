//#region imports
import HttpMethod from "../model/HTTPMethods.js";
import RequestService from "./RequestService.js";

import type { Course } from "../model/Course.js";

//#endregion

class CourseService {
    endpoint: string = "/course";

    //#region Handlers

    //#region Requests

    getLatest = async (amount: number = 10, page: number = 0): Promise<Course[]> => {
        const response = await RequestService.parseResponse<Course[]>(await RequestService.fetchAPI(`${this.endpoint}/latest?amount=${amount}&page=${page}`, HttpMethod.GET, null));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to get latest courses: ${response.status}`);

        return response.data ?? [];
    }

    getByList = async (idList: number[]): Promise<Course[]> => {
        const response = await RequestService.parseResponse<Course[]>(
            await RequestService.fetchAPI(`${this.endpoint}/idlist`, HttpMethod.POST, { idList })
        );

        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to get courses by ID list: ${response.status}`);

        return response.data ?? [];
    }

    getById = async (courseId: number): Promise<Course | null> => {
        const response = await RequestService.parseResponse<Course>(await RequestService.fetchAPI(`${this.endpoint}/${courseId}`, HttpMethod.GET, null));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to get course by ID: ${response.status}`);

        return response.data;
    }

    addCourse = async (course: Course): Promise<Course | null> => {
        const response = await RequestService.parseResponse<Course>(await RequestService.fetchAPI(`${this.endpoint}`, HttpMethod.POST, course));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to add course: ${response.status}`);

        return response.data;
    }

    updateCourse = async (course: Course): Promise<Course | null> => {
        const response = await RequestService.parseResponse<Course>(await RequestService.fetchAPI(`${this.endpoint}/${course.id}`, HttpMethod.PUT, course));
        if (!response)
            throw new Error("Failed to fetch course data: No response received");

        if (!response.success)
            throw new Error(`Failed to update course: ${response.status}`);

        return response.data;
    }

    deleteCourse = async (courseId: number): Promise<void> => {
        const response = await RequestService.parseResponse<void>(await RequestService.fetchAPI(`${this.endpoint}/${courseId}`, HttpMethod.DELETE, null));
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