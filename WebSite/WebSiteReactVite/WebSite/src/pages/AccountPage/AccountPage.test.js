import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AccountPage from "./AccountPage";
import UserManager from "../../utils/UserManager";
import CourseManager from "../../utils/CourseManager";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useNavigate: () => mockNavigate,
        Link: ({ to, children, ...rest }) => (
            <a href={typeof to === 'string' ? to : to.pathname} {...rest}>
                {children}
            </a>
        ),
    };
});

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
        setLocalUser: ()=>mockSetLocalUSer,
        update: ()=>mockUserDelete,
        delete: jest.fn()
    };
});

const valueGetAll = {
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
jest.mock('../../utils/CourseManager.js', () => ({
    getAll: jest.fn(),
    getByList: jest.fn(),
    get: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

const mockAuth = jest.fn();
jest.mock("../../utils/AuthManager", () => {
    const original = jest.requireActual("../../utils/AuthManager");
    return {
        original,
        authenticate: (credentials)=>mockAuth(credentials)
    }
});


describe('AccountPage', () => {
    test('Render correcltly when user is admin', async () => {
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        jest.spyOn(CourseManager, 'getAll').mockResolvedValue({ ...valueGetAll });
        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(`Mr./Ms ${valueGetLocalUser.firstName}'s Account`)).toBeInTheDocument();
            expect(screen.getByLabelText("Email")).toBeInTheDocument();
            expect(screen.getByLabelText("Password")).toBeInTheDocument();
            expect(screen.getByLabelText("First Name")).toBeInTheDocument();
            expect(screen.getByLabelText("Surname")).toBeInTheDocument();
            expect(screen.getByLabelText("Phone")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Update Account" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Delete Account" })).toBeInTheDocument();
            const courses = screen.getAllByAltText("Course Image");
            expect(courses).toHaveLength(2);
            expect(screen.getByText("testCourse1")).toBeInTheDocument();
            expect(screen.getByText("testCourse2")).toBeInTheDocument();
            expect(screen.getByText("Create Course")).toBeInTheDocument();
        });
    });
    test('Render correcltly when user is NOT admin', async () => {
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser, isStudent: true });
        jest.spyOn(CourseManager, 'getAll').mockResolvedValue({ ...valueGetAll });
        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(`${valueGetLocalUser.firstName}'s Account`)).toBeInTheDocument();
            expect(screen.getByLabelText("Email")).toBeInTheDocument();
            expect(screen.getByLabelText("Password")).toBeInTheDocument();
            expect(screen.getByLabelText("First Name")).toBeInTheDocument();
            expect(screen.getByLabelText("Surname")).toBeInTheDocument();
            expect(screen.getByLabelText("Phone")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Update Account" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Delete Account" })).toBeInTheDocument();
            expect(screen.getByText("You haven't started a course yet")).toBeInTheDocument();
        });
    });
    test('Render courses when user has ongoing courses', async () => {
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({
            ...valueGetLocalUser,
            isStudent: true,
            courseList: [{ fkCourseId: 1, videoList: [true, false] }]
        });

        jest.spyOn(CourseManager, 'getByList').mockResolvedValue({ success: true, data: valueGetAll.data });

        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        const imgs = await screen.findAllByAltText("Course Image");
        expect(imgs).toHaveLength(2);

        expect(screen.queryByText("You haven't started a course yet")).toBeNull();
    });
    test('Redirects to /login if no user is found', () => {
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue(null);

        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/login?form=signIn");
    });
    test('Update user when clicking the update button ', async () => {
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        jest.spyOn(CourseManager, 'getAll').mockResolvedValue({ ...valueGetAll });

        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        var clicked = false;
        await waitFor(() => {
            const userNewValues = {
                email: valueGetLocalUser.email,
                password: valueGetLocalUser.password,
                firstname: "newtest",
                surname: "newtest",
                phone: "+987 654 321"
            }
            expect(screen.getByText(`Mr./Ms ${valueGetLocalUser.firstName}'s Account`)).toBeInTheDocument();
            const emailField = screen.getByLabelText("Email");
            expect(emailField.readOnly).toBe(true);
            expect(emailField.disabled).toBe(true);
            fireEvent.change(emailField, { target: { value: userNewValues.email } });
            fireEvent.change(screen.getByLabelText("Password"), { target: { value: userNewValues.password } });
            fireEvent.change(screen.getByLabelText("First Name"), { target: { value: userNewValues.firstname } });
            fireEvent.change(screen.getByLabelText("Surname"), { target: { value: userNewValues.surname } });
            fireEvent.change(screen.getByLabelText("Phone"), { target: { value: userNewValues.phone } });

            if(clicked) return;
            fireEvent.click(screen.getByRole("button", { name: "Update Account" }));
            clicked = true;

            expect(mockAuth).toHaveBeenCalledWith(userNewValues);
        });
    });
    test('Delete user when clicking the delete button ', async () => {
        const promptSpy = jest.spyOn(window, "prompt").mockImplementation(() => "DELETE");
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(()=>true);

        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({ ...valueGetLocalUser });
        jest.spyOn(CourseManager, 'getAll').mockResolvedValue({ ...valueGetAll });

        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        var clicked = false;
        await waitFor(() => {
            if(clicked) return;
            fireEvent.click(screen.getByRole("button", { name: "Delete Account" }));
            clicked = true;

            expect(mockUserDelete).toHaveBeenCalledWith(0);
            expect(mockSetLocalUSer).toHaveBeenCalledWith(null);
            expect(mockNavigate).toHaveBeenCalledWith("/Home");

            promptSpy.mockRestore();
            alertSpy.mockRestore();
        });
    });
    test('Redirects to /course when clicking on course', async () => {
        jest.spyOn(UserManager, 'getLocalUser').mockReturnValue({
            ...valueGetLocalUser,
            isStudent: true,
            courseList: [{ fkCourseId: 1, videoList: [true, false] }]
        });

        jest.spyOn(CourseManager, 'getByList').mockResolvedValue({ success: true, data: valueGetAll.data });

        render(
            <MemoryRouter initialEntries={['/account']}>
                <AccountPage />
            </MemoryRouter>
        );

        const courseImgs = await screen.findAllByAltText("Course Image");
        const targetCourse = courseImgs[0];
        fireEvent.click(targetCourse);
        expect(mockNavigate).toHaveBeenCalledWith(`/course?courseID=${valueGetAll.data[0].id}`);
    });
});