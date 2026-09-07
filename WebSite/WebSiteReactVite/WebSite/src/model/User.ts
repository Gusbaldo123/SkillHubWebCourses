import type { UserCourse } from "./UserCourse";

export interface User {
    id: number;
    email: string;
    isStudent: boolean;
    firstName: string;
    surname: string;
    phone: string;
    isAuthenticated?: boolean;
    courseList: UserCourse[];
}

export interface NewUser {
    email: string;
    password: string;
    firstName: string;
    surname: string;
    phone: string;
}

export interface Credentials {
    email: string;
    password: string;
}

export function ToUser(data: any): User | null {
    if (!data || data.id == null) return null;

    const user: User = {
        id: Number(data.id),
        email: data.email ?? "",
        isStudent: data.isStudent ?? false,
        firstName: data.firstName ?? "",
        surname: data.surname ?? "",
        phone: data.phone ?? "",
        isAuthenticated: data.isAuthenticated ?? false,
        courseList: data.courseList ?? []
    };

    return user;
}