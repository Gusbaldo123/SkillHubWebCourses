import type { UserVideo } from "./Video";

export interface UserCourse {
    id: number | null;
    fkUserId: number | null;
    fkCourseId: number | null;
    videoList: UserVideo[];
}