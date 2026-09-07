export interface CourseVideo {
    id: number | null;
    idCourse: number | null;
    videoUrl: string;
    videoTitle: string;
}

export interface UserVideo {
    id: number | null;
    idUser: number | null;
    idVideo: number | null;
    isWatched: boolean;
}