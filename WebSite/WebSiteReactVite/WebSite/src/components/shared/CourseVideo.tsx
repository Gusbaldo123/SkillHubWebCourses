//#region Imports
import React from "react";

import VideoService from "../../utils/VideoService";

import type { User } from "../../model/User";
import type { Course } from "../../model/Course";
import type { UserCourse } from "../../model/UserCourse";
import type { CourseVideo as CourseVideoModel } from "../../model/Video";

export default CourseVideo;
//#endregion

//#region Handlers

function CheckBoxChange(
    event: React.ChangeEvent<HTMLInputElement>,
    watchedVidList: UserCourse | null,
    setWatchedVidList: React.Dispatch<React.SetStateAction<UserCourse | null>>,
    index: number
): void {
    if (!watchedVidList) return;

    const newList: UserCourse = {
        ...watchedVidList,
        videoList: [...watchedVidList.videoList]
    };

    newList.videoList[index] = {
        ...newList.videoList[index],
        isWatched: event.target.checked
    };

    setWatchedVidList(newList);
}

function DeleteVideo(
    id: number | null,
    user: User | null,
    index: number,
    videoList: CourseVideoModel[],
    updateVideoList: React.Dispatch<React.SetStateAction<CourseVideoModel[]>>
): void {
    if (!user || user.isStudent || id === null) return;

    if (window.confirm("Delete this video?")) {
        void VideoService.deleteById(id);

        const newVideoList = [...videoList];
        newVideoList.splice(index, 1);

        updateVideoList(newVideoList);
    }
}

//#endregion

//#region JSX

interface CourseVideoProps {
    index: number;
    user: User | null;
    watchedVidList: UserCourse | null;
    setWatchedVidList: React.Dispatch<React.SetStateAction<UserCourse | null>>;
    targetCourse: Course;
    video: CourseVideoModel;
    videoList: CourseVideoModel[];
    updateVideoList: React.Dispatch<React.SetStateAction<CourseVideoModel[]>>;
}

function CourseVideo({
    index,
    user,
    watchedVidList,
    setWatchedVidList,
    targetCourse,
    video,
    videoList,
    updateVideoList
}: CourseVideoProps) {
    const isStudent = user?.isStudent ?? false;
    const isWatched = isStudent && watchedVidList
        ? watchedVidList.videoList[index]?.isWatched ?? false
        : false;

    return (
        <div className={`videoGroup group${index}`} id={`group${index}`}>
            <input
                disabled={!isStudent}
                className={`videoCheckbox ch${index}`}
                id={`ch${index}`}
                type="checkbox"
                checked={isWatched}
                onChange={(e) => CheckBoxChange(e, watchedVidList, setWatchedVidList, index)}
            />

            <div
                className={`courseVideo vid${index}`}
                id={`vid${index}`}
                onClick={() => {
                    window.open(video.videoUrl);

                    if (!watchedVidList || !isStudent) return;

                    const newList: UserCourse = {
                        ...watchedVidList,
                        videoList: [...watchedVidList.videoList]
                    };

                    newList.videoList[index] = {
                        ...newList.videoList[index],
                        isWatched: true
                    };

                    setWatchedVidList(newList);
                }}
            >
                <p className={`lblVideo txtVid${index}`} id={`txtVid${index}`}>
                    <b>{`Video ${index + 1} - ${video.videoTitle}`}</b>
                </p>
            </div>

            {user && !isStudent
                ? <button
                    className="btDelete"
                    onClick={() => DeleteVideo(video.id, user, index, videoList, updateVideoList)}>
                    Del
                </button>
                : null}
        </div>
    );
}

//#endregion