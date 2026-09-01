import type { UserCourse } from "./UserCourse";

export interface User {
    id: number;
    email: string;
    password: string;
    isStudent: boolean;
    firstName: string;
    surname: string;
    phone: string;
    isAuthenticated?: boolean;
    courseList: UserCourse[];
}