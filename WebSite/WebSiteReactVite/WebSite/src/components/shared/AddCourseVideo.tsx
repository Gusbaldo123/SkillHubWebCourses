
//#region imports

import React, { useState } from "react";

import CourseManager from "../../utils/CourseManager";
import VideoManager from "../../utils/VideoManager";

import type { User } from "../../model/User";
import type { CourseVideo } from "../../model/Video";
import type { UserCourse } from "../../model/UserCourse";

export default AddCourseVideo;

//#endregion

//#region Types

interface VideoValues {
    id: number | null;
    videoTitle: string;
    videoUrl: string;
    fkCourseId: number;
}

interface AddCourseVideoProps {
    user: User | null;
    courseId: number;
    showAddVideo: boolean;
    setShowAddVideo: React.Dispatch<React.SetStateAction<boolean>>;
    videoList: CourseVideo[];
    updateVideoList: React.Dispatch<React.SetStateAction<CourseVideo[]>>;
    setWatchedVidList: React.Dispatch<React.SetStateAction<UserCourse | null>>;
}

//#endregion

//#region Handlers

async function AddVideo(
    videoData: VideoValues,
    videoList: CourseVideo[],
    updateVideoList: React.Dispatch<React.SetStateAction<CourseVideo[]>>
): Promise<void> {
    await VideoManager.add(videoData);

    const newVideo: CourseVideo = {
        id: videoData.id,
        fkCourseId: videoData.fkCourseId,
        videoUrl: videoData.videoUrl,
        videoTitle: videoData.videoTitle
    };

    updateVideoList([...videoList, newVideo]);
}

function HandleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateVideoValues: React.Dispatch<React.SetStateAction<VideoValues>>
): void {
    updateVideoValues((previousValues) => ({
        ...previousValues,
        [e.target.name]: e.target.value
    }));
}

async function HandleAddClick(
    videoValues: VideoValues,
    showAddVideo: boolean,
    emptyVideoValues: VideoValues,
    videoList: CourseVideo[],
    updateVideoList: React.Dispatch<React.SetStateAction<CourseVideo[]>>,
    setShowAddVideo: React.Dispatch<React.SetStateAction<boolean>>,
    updateVideoValues: React.Dispatch<React.SetStateAction<VideoValues>>,
    setWatchedVidList: React.Dispatch<React.SetStateAction<UserCourse | null>>
): Promise<void> {
    if (videoValues.fkCourseId <= 0) return;
    if (videoValues.videoTitle.length < 1) return;
    if (videoValues.videoUrl.length < 1) return;

    await AddVideo(videoValues, videoList, updateVideoList);

    setShowAddVideo(!showAddVideo);
    updateVideoValues({ ...emptyVideoValues });

    const res = await CourseManager.get(videoValues.fkCourseId);

    if (!res?.data) return;

    const course = res.data;

    updateVideoList(course.videoList);

    setWatchedVidList((previousUserCourse) => {
        if (!previousUserCourse) return previousUserCourse;

        return {
            ...previousUserCourse,
            videoList: course.videoList.map((video: CourseVideo) => {
                const previousVideo = previousUserCourse.videoList.find(
                    (userVideo) => userVideo.fkListId === video.id
                );

                return previousVideo ?? {
                    id: null,
                    fkListId: video.id,
                    isWatched: false
                };
            })
        };
    });
}

//#endregion

//#region JSX

function AddCourseVideo({
    user,
    courseId,
    showAddVideo,
    setShowAddVideo,
    videoList,
    updateVideoList,
    setWatchedVidList
}: AddCourseVideoProps) {
    const emptyVideoValues: VideoValues = {
        id: null,
        videoTitle: "",
        videoUrl: "",
        fkCourseId: courseId
    };

    const [videoValues, updateVideoValues] = useState<VideoValues>({
        ...emptyVideoValues
    });

    if (!user) return null;
    if (user.isStudent) return null;

    if (showAddVideo) {
        return (
            <div className="courseVideo newVideo"
                onClick={() => { setShowAddVideo(!showAddVideo); }}>
                <p><b>Add new video</b></p>
            </div>
        );
    }

    return (
        <div key="videoNew" className="videoGroup new" id="groupNew">
            <div className="courseVideo vid new" id="vidNew">
                <div className="txtVideoName">
                    <label>Video Name: </label>

                    <input
                        type="text"
                        name="videoTitle"
                        value={videoValues.videoTitle}
                        onChange={(e) => { HandleChange(e, updateVideoValues); }}
                    />
                </div>

                <div className="txtVideoUrl">
                    <label>Video URL: </label>

                    <input
                        type="text"
                        name="videoUrl"
                        value={videoValues.videoUrl}
                        onChange={(e) => { HandleChange(e, updateVideoValues); }}
                    />
                </div>

                <div className="buttonOptions">
                    <button
                        type="button"
                        onClick={() => {
                            void HandleAddClick(
                                videoValues,
                                showAddVideo,
                                emptyVideoValues,
                                videoList,
                                updateVideoList,
                                setShowAddVideo,
                                updateVideoValues,
                                setWatchedVidList
                            );
                        }}>
                        Add
                    </button>

                    <button
                        type="button"
                        onClick={() => { setShowAddVideo(!showAddVideo); }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

//#endregion