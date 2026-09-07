import type { UserVideo } from "./Video";

export interface UserCourse
{
    id: number | null;
    idUser: number | null;
    idCourse: number | null;
    videoList: UserVideo[];
}

export function ToUserCourse(dto: any): UserCourse
{
    return {
        id: dto.id,
        idUser: dto.idUser,
        idCourse: dto.idCourse,
        videoList: dto.videoList.map((video: UserVideo) => ({
            id: video.id,
            idUser: video.idUser,
            idVideo: video.idVideo,
            isWatched: video.isWatched
        }))
    };
}