import type { CourseVideo } from "./Video";

export interface Course {
    id: number,
    imageBase64: string,
    title: string,
    description: string,
    videoList: CourseVideo[],
}