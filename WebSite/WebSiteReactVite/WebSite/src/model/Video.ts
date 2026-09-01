export interface CourseVideo {
    id: number | null;
    fkCourseId: number | null;
    videoUrl: string;
    videoTitle: string;
}

export interface UserVideo {
    id: number | null;
    fkListId: number | null;
    isWatched: boolean;
}