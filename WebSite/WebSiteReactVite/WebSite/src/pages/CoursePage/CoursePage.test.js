import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CoursePage from "./CoursePage";
import CourseManager from "../../utils/CourseManager";
import UserManager from "../../utils/UserManager";

const valueCourseGetAll = {
    success: true,
    data: [{
        "id": 0,
        "title": "testCourse1",
        "imageBase64": "123123",
        "description": "testDescription1",
        "videoList": [
            {
                "id": 1,
                "videoUrl": "Url1",
                "videoTitle": "Title1"
            },
            {
                "id": 2,
                "videoUrl": "Url2",
                "videoTitle": "Title2"
            }
        ]
    },
    {
        "id": 1,
        "title": "testCourse2",
        "imageBase64": "123123",
        "description": "testDescription2",
        "videoList": [
            {
                "id": 3,
                "videoUrl": "Url3",
                "videoTitle": "Title3"
            },
            {
                "id": 4,
                "videoUrl": "Url4",
                "videoTitle": "Title4"
            }
        ]
    }]
};
const mockCourseUpdate = jest.fn();
const mockCourseDelete = jest.fn();
jest.mock('../../utils/CourseManager.js', () => ({
    getAll: jest.fn(),
    getByList: jest.fn(),
    get: jest.fn(),
    add: jest.fn(),
    update: () => mockCourseUpdate,
    delete: () => mockCourseDelete
}));
const valueGetLocalUser = {
    id: 0,
    email: 'test@email.com',
    password: '123',
    isStudent: false,
    firstName: 'test',
    surname: 'test',
    phone: '+123 456 789',
    isAuthenticated: true,
    courseList: []
};

const mockUserDelete = jest.fn();
const mockSetLocalUSer = jest.fn();
jest.mock('../../utils/UserManager.js', () => {
    const original = jest.requireActual('../../utils/UserManager.js');

    return {
        ...original,
        getLocalUser: jest.fn(),
        setLocalUser: () => mockSetLocalUSer,
        update: () => mockUserDelete,
        delete: jest.fn()
    };
});

const mockNavigate = jest.fn();
const mockSearchParamsGet = jest.fn(() => 0);
const mockSetSearchParams = jest.fn();
jest.mock("react-router-dom", () => {
    const original = jest.requireActual("react-router-dom");
    return {
        ...original,
        useNavigate: () => mockNavigate,
        useSearchParams: () => ([
            { get: mockSearchParamsGet },
            mockSetSearchParams
        ]),
    };
});

const mockVideoDelete = jest.fn();
jest.mock('../../utils/VideoManager', () => {
    const original = jest.requireActual('../../utils/VideoManager');

    return {
        ...original,
        get: () => jest.fn(),
        getAll: () => jest.fn(),
        add: () => jest.fn(),
        update: () => jest.fn(),
        delete: () => mockVideoDelete
    };
});

describe('CoursePage', () => {
    test('Render loading when no course if found', async () => {
        render(
            <MemoryRouter initialEntries={['/course?courseID=0']}>
                <CoursePage />
            </MemoryRouter>
        );

        expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
    });
    test('Render page correctly when is user', async () => {
        const get = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(get);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser, isStudent: true });
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText("testCourse1")).toBeInTheDocument();
            expect(screen.getByText("testDescription1")).toBeInTheDocument();
            expect(screen.getByText("Author:")).toBeInTheDocument();
            expect(screen.getByText("Gustavo Pereira")).toBeInTheDocument();
            expect(screen.getByAltText("courseImage")).toBeInTheDocument();
            expect(screen.queryByText("Upload Image")).toBeNull();
            get.data.videoList.forEach(element => {
                expect(screen.getByText(`Video ${element.id} - ${element.videoTitle}`)).toBeInTheDocument();
            });
            expect(screen.queryByText(/Loading.../i)).toBeNull();
        });
    });
    test('Render page correctly when is admin', async () => {
        const get = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(get);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByDisplayValue("testCourse1")).toBeInTheDocument();
            expect(screen.getByText("testDescription1")).toBeInTheDocument();
            expect(screen.getByText("Author:")).toBeInTheDocument();
            expect(screen.getByText("Gustavo Pereira")).toBeInTheDocument();
            expect(screen.getByAltText("courseImage")).toBeInTheDocument();
            expect(screen.getByText("Upload Image")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Remove Course" })).toBeInTheDocument();

            screen.getAllByRole("checkbox").forEach((checkbox) => {
                expect(checkbox).toBeDisabled();
            });
            get.data.videoList.forEach((element) => {
                expect(screen.getByText(`Video ${element.id} - ${element.videoTitle}`)).toBeInTheDocument();
            });
            expect(screen.getAllByRole("button", { name: "Del" })).toHaveLength(2);
            expect(screen.getByText("Add new video")).toBeInTheDocument();
            expect(screen.queryByText(/Loading.../i)).toBeNull();
        });
    });
    test('Update image when admin clicks on Upload button', async () => {
        const courseObj = {
            id: 0,
            title: "testCourse1",
            imageBase64: "orig64",
            description: "testDescription1",
            videoList: []
        };
        jest.spyOn(CourseManager, "get").mockResolvedValue({
            success: true,
            data: courseObj
        });
        const mockUpdate = jest.spyOn(CourseManager, "update").mockImplementation(() => { });
        jest.spyOn(UserManager, "getLocalUser").mockReturnValue({
            id: 1,
            isStudent: false,
            courseList: []
        });

        const RealFileReader = global.FileReader;
        class MockFileReader {
            constructor() {
                this._onload = null;
                this.result = null;
            }
            set onload(fn) {
                this._onload = fn;
                if (this.result !== null && typeof this._onload === "function") {
                    this._onload({ target: this });
                }
            }
            get onload() {
                return this._onload;
            }
            readAsDataURL(file) {
                this.result = "data:image/png;base64,FAKE_BASE64";
            }
        }
        global.FileReader = MockFileReader;

        render(
            <MemoryRouter initialEntries={["/course?courseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );

        const fileInput = await screen.findByLabelText("Upload Image");

        const fakeFile = new File(["dummy"], "photo.png", { type: "image/png" });
        fireEvent.change(fileInput, { target: { files: [fakeFile] } });

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 0,
                    title: "testCourse1",
                    description: "testDescription1",
                    videoList: [],
                    imageBase64: "FAKE_BASE64"
                })
            );
        });
        global.FileReader = RealFileReader;
    });
    test('Delete entire course when clicking on Delete Course', async () => {
        const get = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(get);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        const mockConfirm = jest.spyOn(window, "confirm").mockImplementation(() => true);
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        var clicked = false;
        await waitFor(() => {
            if (clicked) return;
            fireEvent.click(screen.getByRole("button", { name: "Remove Course" }));
            clicked = true;
            expect(mockCourseDelete).toHaveBeenCalledWith(get.data.id);
            mockConfirm.mockRestore();
        });
    })
    test('Open course video when clicking on video', async () => {
        const get = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(get);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        const mock = jest.spyOn(window, 'open').mockImplementation(() => true);
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        await waitFor(() => {
            get.data.videoList.forEach((vid) => {
                fireEvent.click(screen.getByText(`Video ${vid.id} - ${vid.videoTitle}`));
                expect(mock).toHaveBeenCalledWith(vid.videoUrl);
            });

            mock.mockRestore();
        });
    });
    test('Update course when admin changes informations', async () => {
        const course = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(course);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        var changed = false;
        await waitFor(async () => {
            if (changed) return;
            changed = true;
            const title = screen.getByDisplayValue("testCourse1");
            const desc = screen.getByText("testDescription1");

            fireEvent.change(title, { target: { value: "NewTitle" } });
            fireEvent.change(desc, { target: { value: "NewDesc" } });
            expect(mockCourseUpdate).toHaveBeenCalled();
        });
    });
    test('Delete course video when clicking on Del', async () => {
        const get = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(get);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        const mock = jest.spyOn(window, 'confirm').mockImplementation(() => true);
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        var pressed = false;
        await waitFor(() => {
            if (pressed) return;
            const btDelList = screen.getAllByRole("button", { name: "Del" });

            fireEvent.click(btDelList[0]);
            pressed = true;
            expect(mockVideoDelete).toHaveBeenCalledWith(1);

            mock.mockRestore();
        });
    });
    test('Toggling checkbox update user', async () => {
        const get = { success: valueCourseGetAll.success, data: valueCourseGetAll.data[0] };
        jest.spyOn(CourseManager, "get").mockReturnValue(get);
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser, isStudent: true });
        render(
            <MemoryRouter initialEntries={["/course?CourseID=0"]}>
                <CoursePage />
            </MemoryRouter>
        );
        var pressed = false;
        await waitFor(() => {
            if (pressed) return;
            const checkboxList = screen.getAllByRole("checkbox");
            checkboxList.forEach(checkbox => {
                fireEvent.click(checkbox);
                pressed = true;
                expect(checkbox.checked).toEqual(false);
                expect(mockSetLocalUSer).toHaveBeenCalled();
            });

            expect(screen.queryByText(/Loading.../i)).toBeNull();
        });
    })
});