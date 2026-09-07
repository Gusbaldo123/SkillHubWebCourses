import type { UserVideo } from "./Video";

export interface UserCourse {
    id: number | null;
    fkUserId: number | null;
    fkCourseId: number | null;
    videoList: UserVideo[];
}

export function ToUserCourse(dto: any): UserCourse {
    return {
        id: dto.id,
        fkUserId: dto.fkUserId,
        fkCourseId: dto.fkCourseId,
        videoList: dto.videoList.map((video: any) => ({
            id: video.id,
            fkUserId: video.fkUserId,
            fkVideoId: video.fkVideoId,
            watched: video.watched
        }))
    };
}