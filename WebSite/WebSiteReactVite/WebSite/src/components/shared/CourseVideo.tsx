//#region Imports
import React from "react";

import UserManager from "../../utils/UserManager";
import VideoManager from "../../utils/VideoManager";

export default CourseVideo;
//#endregion

//#region Handlers
function CheckBoxChange(event, user, watchedVidList, setWatchedVidList, targetCourse, i, setUser) {
    if (!user) return;
    const newList = { ...watchedVidList };
    newList.videoList[i] = event.target.checked;
    setWatchedVidList(newList);
    SetUserWatchedVidList(newList, user, targetCourse, setUser);
}

function SetUserWatchedVidList(watchedVidList, user, targetCourse, setUser) {
    const updatedUser = { ...user };
    if (updatedUser.courseList) {
        const courseIndex = updatedUser.courseList.findIndex(course => course.fkCourseId === targetCourse.id);
        
        if (courseIndex >= 0) {
            updatedUser.courseList[courseIndex].videoList = watchedVidList.videoList;
        } else {
            updatedUser.courseList.push({
                fkCourseId: targetCourse.id,
                videoList: watchedVidList.videoList,
            });
        }
    }

    setUser(updatedUser);
    UserManager.setLocalUser(updatedUser);
}

function DeleteVideo(id, user, index, videoList, updateVideoList) {
    if (user.isStudent) return;
    if (window.confirm("Delete this video?")) {
        VideoManager.delete(id);
        const newVideoList = [...videoList];
        newVideoList.splice(index, 1);
        updateVideoList(newVideoList);
    }
}
//#endregion

//#region JSX
function CourseVideo({ index, user, watchedVidList, setWatchedVidList, targetCourse, setUser, video, videoList, updateVideoList }) {
    const isStudent = user && user.isStudent;
    const isWatched = isStudent ? watchedVidList.videoList[index] : false;
    
    return (
        <div key={index.toString()} className={`videoGroup group${index}`} id={`group${index}`}>
            <input
                disabled={!isStudent}
                className={`videoCheckbox ch${index}`}
                id={`ch${index}`}
                type="checkbox"
                checked={isWatched}
                onChange={(e) => CheckBoxChange(e, user, watchedVidList, setWatchedVidList, targetCourse, index, setUser)} />
            <div
                className={`courseVideo vid${index}`}
                id={`vid${index}`}
                onClick={() => {
                    window.open(video.videoUrl);
                    const checkboxEvent = { target: { checked: true } };
                    CheckBoxChange(checkboxEvent, user, watchedVidList, setWatchedVidList, targetCourse, index, setUser);
                }} >
                <p className={`lblVideo txtVid${index}`} id={`txtVid${index}`}>
                    <b>{`Video ${index + 1} - ${video.videoTitle}`}</b>
                </p>
            </div>
            {user && !isStudent ? <button className="btDelete" onClick={() => DeleteVideo(video.id, user, index, videoList, updateVideoList)}>Del</button> : null}
        </div>
    )
}
//#endregion