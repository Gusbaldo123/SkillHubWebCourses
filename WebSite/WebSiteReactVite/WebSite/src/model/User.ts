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

export function ToUser(data: any): User | null {
    if (!data) return null;
    const user: User = {
        id: data.id ?? null,
        email: data.email ?? "",
        password: data.password ?? "",
        isStudent: data.isStudent ?? false,
        firstName: data.firstName ?? "",
        surname: data.surname ?? "",
        phone: data.phone ?? "",
        isAuthenticated: data.isAuthenticated ?? false,
        courseList: data.courseList ?? []
    };
    return user;
}