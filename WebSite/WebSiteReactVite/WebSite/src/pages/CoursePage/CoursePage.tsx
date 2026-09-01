
//#region imports
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import "./CoursePage.css";
import "./CourseMobilePage.css";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Banner from "../../components/shared/Banner";

import UserManager from "../../utils/UserManager";
import CourseManager from "../../utils/CourseManager";

import CourseVideo from "../../components/shared/CourseVideo";
import AddCourseVideo from "../../components/shared/AddCourseVideo";

import type { User } from "../../model/User";
import type { Course } from "../../model/Course";
import type { CourseVideo as CourseVideoModel } from "../../model/Video";
import type { UserCourse } from "../../model/UserCourse";

export default CoursePage;
//#endregion

//#region Handlers

function ImageToBase64(
    e: React.ChangeEvent<HTMLInputElement>,
    course: Course,
    updateImg64: React.Dispatch<React.SetStateAction<string>>
): void
{
    const file = e.target.files?.[0];

    if (!file)
    {
        alert("No file selected");
        return;
    }

    const reader = new FileReader();

    reader.onload = () =>
    {
        try
        {
            if (typeof reader.result !== "string")
            {
                alert("Error when uploading image");
                return;
            }

            const base64img = reader.result.replace(/^data:image\/\w+;base64,/, "");

            course.imageBase64 = base64img;

            UpdateCourse(course);
            updateImg64(base64img);
        }
        catch
        {
            alert("Error when uploading image");
        }
    };

    reader.readAsDataURL(file);
}

function UpdateCourse(course: Course): void
{
    if (course.title.length <= 0) return;

    void CourseManager.update({
        id: course.id,
        title: course.title,
        imageBase64: course.imageBase64,
        description: course.description,
        videoList: course.videoList
    });
}

function DeleteCourse(courseId: number, navigate: ReturnType<typeof useNavigate>): void
{
    if (!window.confirm("Delete this course?")) return;

    void CourseManager.delete(courseId);
    navigate("/home");
}

//#endregion

//#region JSX

function HeaderStudent({ img64, targetCourse }: { img64: string; targetCourse: Course })
{
    return (
        <article>
            <div className="img-content">
                <img src={`data:image/jpeg;base64,${img64}`} alt="courseImage" />
            </div>

            <div className="videoInfo">
                <h2>{targetCourse.title}</h2>

                <p>
                    Author: <a href="https://www.linkedin.com/in/gustavorbpereira/">
                        Gustavo Pereira
                    </a>
                </p>

                <p>{targetCourse.description}</p>
            </div>
        </article>
    );
}

interface HeaderAdminProps
{
    img64: string;
    updateImg64: React.Dispatch<React.SetStateAction<string>>;
    targetCourse: Course;
    courseId: number;
    navigate: ReturnType<typeof useNavigate>;
}

function HeaderAdmin({ img64, updateImg64, targetCourse, courseId, navigate }: HeaderAdminProps)
{
    return (
        <article>
            <div className="img-content">
                <img src={`data:image/jpeg;base64,${img64}`} alt="courseImage" />

                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload Image
                </label>

                <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={(e) => { ImageToBase64(e, targetCourse, updateImg64); }}
                />
            </div>

            <div className="videoInfo">
                <input
                    type="text"
                    value={targetCourse.title}
                    onChange={(e) =>
                    {
                        targetCourse.title = e.target.value;
                        UpdateCourse(targetCourse);
                    }}
                />

                <div className="deleteCourse">
                    <button
                        type="button"
                        onClick={() => { DeleteCourse(courseId, navigate); }}>
                        Remove Course
                    </button>
                </div>

                <p>
                    Author: <a href="https://www.linkedin.com/in/gustavorbpereira/">
                        Gustavo Pereira
                    </a>
                </p>

                <textarea
                    value={targetCourse.description}
                    onChange={(e) =>
                    {
                        targetCourse.description = e.target.value;
                        UpdateCourse(targetCourse);
                    }}
                />
            </div>
        </article>
    );
}

//#endregion

//#region Page

function CoursePage()
{
    const [searchParams] = useSearchParams();
    const courseId = Number(searchParams.get("courseID"));

    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(() => UserManager.getLocalUser());
    const [targetCourse, setTargetCourse] = useState<Course | null>(null);
    const [watchedVidList, setWatchedVidList] = useState<UserCourse | null>(null);
    const [showAddVideo, setShowAddVideo] = useState(true);
    const [img64, updateImg64] = useState("");
    const [videoList, updateVideoList] = useState<CourseVideoModel[]>([]);

    const isStudent = !user || user.isStudent;

    useEffect(() =>
    {
        async function LoadCourse(): Promise<void>
        {
            if (!courseId || courseId <= 0) return;

            const res = await CourseManager.get(courseId);

            if (!res?.data) return;

            const course: Course = res.data;

            setTargetCourse(course);

            const defaultUserCourse: UserCourse = {
                id: null,
                fkUserId: user?.id ?? null,
                fkCourseId: courseId,
                videoList: course.videoList.map((video) => ({
                    id: null,
                    fkListId: null,
                    isWatched: false
                }))
            };

            if (!user)
            {
                setWatchedVidList(defaultUserCourse);
                return;
            }

            if (!user.isStudent)
            {
                setWatchedVidList(defaultUserCourse);
                return;
            }

            const userCourse = user.courseList.find(
                (courseArg) => courseArg.fkCourseId === courseId
            );

            if (userCourse)
            {
                setWatchedVidList(userCourse);
                return;
            }

            setWatchedVidList(defaultUserCourse);

            setUser((previousUser) =>
            {
                if (!previousUser) return previousUser;

                return {
                    ...previousUser,
                    courseList: [
                        ...previousUser.courseList,
                        defaultUserCourse
                    ]
                };
            });
        }

        void LoadCourse();
    }, [courseId]);

    useEffect(() =>
    {
        if (!targetCourse) return;

        document.title = `Skillhub - ${targetCourse.title}`;

        updateImg64(targetCourse.imageBase64);
        updateVideoList(targetCourse.videoList);
    }, [targetCourse]);

    if (!targetCourse)
        return <div>Loading...</div>;

    return (
        <>
            <Header />

            <main>
                <Banner />

                <section className="courseContent">
                    {isStudent
                        ? <HeaderStudent img64={img64} targetCourse={targetCourse} />
                        : <HeaderAdmin
                            img64={img64}
                            updateImg64={updateImg64}
                            targetCourse={targetCourse}
                            courseId={courseId}
                            navigate={navigate}
                        />
                    }

                    <br />

                    <div className="courseList">
                        {videoList.map((video, index) =>
                            <CourseVideo
                                key={index}
                                index={index}
                                user={user}
                                watchedVidList={watchedVidList}
                                setWatchedVidList={setWatchedVidList}
                                targetCourse={targetCourse}
                                setUser={setUser}
                                video={video}
                                videoList={videoList}
                                updateVideoList={updateVideoList}
                            />
                        )}

                        <AddCourseVideo
                            user={user}
                            courseId={courseId}
                            showAddVideo={showAddVideo}
                            setShowAddVideo={setShowAddVideo}
                            videoList={videoList}
                            updateVideoList={updateVideoList}
                            setWatchedVidList={setWatchedVidList}
                        />
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

//#endregion