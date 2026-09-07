
//#region imports

import React, { useState, type Dispatch, type SetStateAction } from "react";

import CourseService from "../../utils/CourseService";
import VideoService from "../../utils/VideoService";

import type { User } from "../../model/User";
import type { CourseVideo } from "../../model/Video";
import type { UserCourse } from "../../model/UserCourse";

export default AddCourseVideo;

//#endregion

//#region Types

interface VideoValues {
    id: number | null;
    idCourse: number | null;
    videoTitle: string;
    videoUrl: string;
}

interface AddCourseVideoProps {
    user: User | null;
    courseId: number;
    showAddVideo: boolean;
    setShowAddVideo: Dispatch<SetStateAction<boolean>>;
    videoList: CourseVideo[];
    updateVideoList: Dispatch<SetStateAction<CourseVideo[]>>;
    setWatchedVidList: Dispatch<SetStateAction<UserCourse | null>>;
}

//#endregion

//#region Handlers

async function AddVideo(videoData: VideoValues, videoList: CourseVideo[], updateVideoList: Dispatch<SetStateAction<CourseVideo[]>>): Promise<void> {
    await VideoService.addVideo(videoData);

    const newVideo: CourseVideo = {
        id: videoData.id,
        idCourse: videoData.idCourse,
        videoUrl: videoData.videoUrl,
        videoTitle: videoData.videoTitle
    };

    updateVideoList([...videoList, newVideo]);
}

function HandleChange(e: React.ChangeEvent<HTMLInputElement>, updateVideoValues: Dispatch<SetStateAction<VideoValues>>): void {
    updateVideoValues((previousValues) => ({
        ...previousValues,
        [e.target.name]: e.target.value
    }));
}

async function HandleAddClick(videoValues: VideoValues, showAddVideo: boolean, emptyVideoValues: VideoValues, videoList: CourseVideo[], updateVideoList: Dispatch<SetStateAction<CourseVideo[]>>, setShowAddVideo: Dispatch<SetStateAction<boolean>>, updateVideoValues: Dispatch<SetStateAction<VideoValues>>, setWatchedVidList: Dispatch<SetStateAction<UserCourse | null>>): Promise<void> {
    if (videoValues.id == null || videoValues.id <= 0) return;
    if (videoValues.idCourse == null || videoValues.idCourse <= 0) return;
    if (videoValues.videoTitle.length < 1) return;
    if (videoValues.videoUrl.length < 1) return;

    await AddVideo(videoValues, videoList, updateVideoList);

    setShowAddVideo(!showAddVideo);
    updateVideoValues({ ...emptyVideoValues });

    const course = await CourseService.getById(videoValues.idCourse);

    if (!course) return;

    updateVideoList(course.videoList);

    setWatchedVidList((previousUserCourse: UserCourse | null) => {
    if (!previousUserCourse) return previousUserCourse;

    return {
        ...previousUserCourse,
        videoList: course.videoList.map((video: CourseVideo) => {
            const previousVideo = previousUserCourse.videoList.find(
                (userVideo) => userVideo.idVideo === video.id
            );

            return previousVideo ?? {
                id: null,
                idUser: previousUserCourse.idUser,
                idVideo: video.id,
                isWatched: false
            };
        })
    };
});
}

//#endregion

//#region JSX

function AddCourseVideo({ user, courseId, showAddVideo, setShowAddVideo, videoList, updateVideoList, setWatchedVidList }: AddCourseVideoProps) {
    const emptyVideoValues: VideoValues = {
        id: null,
        videoTitle: "",
        videoUrl: "",
        idCourse: courseId
    };

    const [videoValues, updateVideoValues] = useState<VideoValues>({ ...emptyVideoValues });

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
                    <button type="button" onClick={() => {
                        void HandleAddClick(videoValues, showAddVideo, emptyVideoValues, videoList, updateVideoList, setShowAddVideo, updateVideoValues, setWatchedVidList);
                    }}>
                        Add
                    </button>

                    <button type="button" onClick={() => { setShowAddVideo(!showAddVideo); }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

//#endregion