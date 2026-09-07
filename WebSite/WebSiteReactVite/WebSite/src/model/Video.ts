export interface CourseVideo {
    id: number | null;
    idCourse: number | null;
    videoUrl: string;
    videoTitle: string;
}

export interface UserVideo {
    id: number | null;
    idList: number | null;
    isWatched: boolean;
}