//#region Imports
import React, { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";

import "./AccountPage.css";
import "./AccountMobilePage.css";

import NewCourse from "../../assets/NewCourse.png";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Banner from "../../components/shared/Banner";

import UserManager from "../../utils/UserManager";
import CourseManager from "../../utils/CourseManager";
import AuthManager from "../../utils/AuthManager";

import type { User } from "../../model/User";
import type { Course } from "../../model/Course";
import type { UserCourse } from "../../model/UserCourse";

export default AccountPage;
//#endregion

//#region Types
type EditableUserField = "email" | "password" | "firstName" | "surname" | "phone";

interface AccountField {
    field: string;
    display: string;
    property: EditableUserField;
    type: string;
    disabled: boolean;
}

interface CourseImageProps {
    targetCourse: Course;
    user: User;
    navigate: NavigateFunction;
}

interface NewCourseImageProps {
    user: User;
    id: number;
    navigate: NavigateFunction;
}

interface CourseListProps {
    user: User;
    navigate: NavigateFunction;
    courseList: Course[];
}

interface DivFormProps {
    chosenField: AccountField;
    userVal: User;
    updateUserVal: any;
}
//#endregion

//#region Handlers
async function UpdateAccount(e: React.FormEvent<HTMLFormElement>, userVal: User | null, navigate: NavigateFunction): Promise<void> {
    e.preventDefault();

    if (!userVal) return;

    const newUser: User = {
        id: userVal.id,
        email: userVal.email,
        password: userVal.password,
        isStudent: userVal.isStudent,
        firstName: userVal.firstName,
        surname: userVal.surname,
        phone: userVal.phone,
        courseList: userVal.courseList
    };

    const result = await UserManager.update(newUser);

    if (!result) {
        alert("Found an error while updating the account.");
        return;
    }

    await AuthManager.authenticate({
        email: userVal.email,
        password: userVal.password
    });

    if (UserManager.getLocalUser())
        navigate("/Home");
}

async function DeleteAccount(user: User, navigate: NavigateFunction): Promise<void> {
    const confirmation = window.prompt("To confirm, type DELETE");

    if (confirmation?.replaceAll(" ", "").replaceAll("\t", "").toUpperCase() !== "DELETE") {
        alert("Wrong confirmation text");
        return;
    }

    try {
        await UserManager.delete(user.id);
        alert("Deleted Account");

        UserManager.setLocalUser(null);
        navigate("/Home");
    }
    catch {
        alert("Found an error");
    }
}

async function AddCourse(navigate: NavigateFunction): Promise<void> {
    try {
        await CourseManager.add({
            title: "New Course",
            imageBase64: "placeholder_base64_data",
            description: "Insert Description Here",
            videoList: []
        });

        navigate("/Home");
    }
    catch {
        alert("Failed to create course.");
    }
}

function HandleUpdateVal(e: React.ChangeEvent<HTMLInputElement>, userVal: User, property: EditableUserField, updateUserVal: React.Dispatch<React.SetStateAction<User>>): void {
    updateUserVal({
        ...userVal,
        [property]: e.target.value
    });
}
//#endregion

//#region JSX
function CourseImage({ targetCourse, user, navigate }: CourseImageProps) {
    let counterDone = 0;

    if (user.isStudent) {
        const userTargetCourse = user.courseList.find(
            (course: UserCourse) => course.fkCourseId === targetCourse.id
        );

        if (userTargetCourse) {
            counterDone = userTargetCourse.videoList.filter(
                video => video.isWatched
            ).length;
        }
    }

    const totalVideos = targetCourse.videoList.length;
    const progressValue = user.isStudent ? counterDone : totalVideos;

    return (
        <div className="courseOption" id={`course${targetCourse.id}`}
            onClick={() => { navigate(`/course?courseID=${targetCourse.id}`); }}>
            <img src={`data:image/png;base64,${targetCourse.imageBase64}`} alt="Course Image" />
            <progress id="file" value={progressValue} max={totalVideos} />
            <h4>{targetCourse.title}</h4>
        </div>
    );
}

function NewCourseImage({ user, id, navigate }: NewCourseImageProps) {
    if (user.isStudent) return null;

    return (
        <div className="courseOption" id={`course${id}`}
            onClick={() => { void AddCourse(navigate); }}>
            <img src={NewCourse} alt="New Course" />
            <h4>Create Course</h4>
        </div>
    );
}

function CourseList({ user, navigate, courseList }: CourseListProps) {
    return (
        <div className="videoListContainer">
            <h2>{user.isStudent ? "Your Progress" : "Posted Courses"}</h2>
            <br />
            <div className="listVideos">
                {courseList.length === 0 && user.isStudent ?
                    <p>You haven't started a course yet</p> :
                    courseList.map((course) =>
                        <CourseImage targetCourse={course} key={course.id}
                            user={user} navigate={navigate} />
                    )
                }
                <NewCourseImage user={user} id={user.courseList.length} navigate={navigate} />
            </div>
        </div>
    );
}

function DivForm({ chosenField, userVal, updateUserVal }: DivFormProps) {
    return (
        <div className={`div${chosenField.field}`} key={`div${chosenField.field}`}>
            <label htmlFor={`lbl${chosenField.field}`}>{chosenField.display}</label>
            <input type={chosenField.type} name={`lbl${chosenField.field}`}
                id={`lbl${chosenField.field}`} className={`lbl${chosenField.field}`}
                value={userVal[chosenField.property]} required
                onChange={(e) => { HandleUpdateVal(e, userVal, chosenField.property, updateUserVal); }}
                disabled={chosenField.disabled} readOnly={chosenField.disabled}
                autoComplete="new-password" />
        </div>
    );
}
//#endregion

//#region Page
function AccountPage() {
    const navigate = useNavigate();
    const user = UserManager.getLocalUser();

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userVal, updateUserVal] = useState<User | null>(
        user ? { ...user, password: "" } : null
    );

    const fields: Record<string, AccountField> = {
        Email: { field: "Email", display: "Email", property: "email", type: "text", disabled: true },
        Password: { field: "Pass", display: "Password", property: "password", type: "password", disabled: false },
        FirstName: { field: "Name", display: "First Name", property: "firstName", type: "text", disabled: false },
        Surname: { field: "Surname", display: "Surname", property: "surname", type: "text", disabled: false },
        Phone: { field: "Phone", display: "Phone", property: "phone", type: "text", disabled: false }
    };

    useEffect(() => {
        document.title = "Skillhub - My Account";

        if (!user) {
            navigate("/login?form=signIn");
            return;
        }

        async function LoadCourses(): Promise<void> {
            try {
                setLoading(true);

                if (!user?.isStudent) {
                    const result = await CourseManager.getAll();

                    if (result?.data)
                        setCourseList(result.data);

                    return;
                }

                const idList = user.courseList
                    .map((userCourse) => userCourse.fkCourseId)
                    .filter((id): id is number => id !== null && id !== undefined && id > 0);

                if (idList.length === 0) {
                    setCourseList([]);
                    return;
                }

                const result = await CourseManager.getByList(idList);

                if (result?.data)
                    setCourseList(result.data);
                else
                    setCourseList([]);
            }
            catch (error) {
                console.error("Failed to load courses:", error);
                setCourseList([]);
            }
            finally {
                setLoading(false);
            }
        }

        void LoadCourses();
    }, [navigate]);

    if (!user || !userVal) return null;

    if (loading) {
        return (
            <>
                <Header />
                <Banner />
                <section className="accountContent">
                    <p>Loading...</p>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <Banner />
            <section className="accountContent">
                <form className="formAccount"
                    onSubmit={(e) => { void UpdateAccount(e, userVal, navigate); }}>
                    <h2>{user.isStudent ? `${user.firstName}'s Account` : `Mr./Ms ${user.surname}'s Account`}</h2>
                    <h3>Confirm your login</h3>

                    <DivForm chosenField={fields.Email} userVal={userVal} updateUserVal={updateUserVal} />
                    <DivForm chosenField={fields.Password} userVal={userVal} updateUserVal={updateUserVal} />

                    <hr />
                    <h3>Informations</h3>

                    <DivForm chosenField={fields.FirstName} userVal={userVal} updateUserVal={updateUserVal} />
                    <DivForm chosenField={fields.Surname} userVal={userVal} updateUserVal={updateUserVal} />
                    <DivForm chosenField={fields.Phone} userVal={userVal} updateUserVal={updateUserVal} />

                    <div className="btOptions">
                        <button type="submit" className="btUpdate">Update Account</button>
                        <button type="button" className="btDelete"
                            onClick={() => { void DeleteAccount(user, navigate); }}>
                            Delete Account
                        </button>
                    </div>
                </form>

                <br />

                <CourseList user={user} navigate={navigate} courseList={courseList} />
            </section>
            <Footer />
        </>
    );
}
//#endregion