//#region imports
import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSearchParams, Link, useNavigate, type NavigateFunction } from "react-router";

import "./LoginPage.css";
import "./LoginMobilePage.css";

import Header from "../../components/layout/Header.js";
import Footer from "../../components/layout/Footer.js";
import Banner from "../../components/shared/Banner.js";

import UserService from "../../utils/UserService.js";
import { useAuth } from "../../router/AuthContext.js";
import type { User, NewUser, Credentials } from "../../model/User.js";

export default LoginPage;
//#endregion

//#region Handlers
async function SubmitLoginForm(event: React.SubmitEvent<HTMLFormElement>, navigate: NavigateFunction, login: (credentials: Credentials) => Promise<boolean>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const credentials: Credentials = {
        email: String(formData.get("lblEmail")).toLowerCase(),
        password: String(formData.get("lblPass"))
    };

    try {
        const success = await login(credentials);

        if (success)
            navigate("/home");
    } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to login");
    }
}

async function SubmitSignUpForm(event: React.SubmitEvent<HTMLFormElement>, setLoginPage: Dispatch<SetStateAction<boolean>>, isProcessing: boolean, setProcess: Dispatch<SetStateAction<boolean>>) {
    event.preventDefault();

    if (isProcessing) return;

    setProcess(true);

    const formData = new FormData(event.currentTarget);

    const userToAdd: NewUser = {
        email: String(formData.get("lblEmail")).toLowerCase(),
        password: String(formData.get("lblPass")),
        firstName: String(formData.get("lblName")),
        surname: String(formData.get("lblSurname")),
        phone: String(formData.get("lblPhone"))
    };

    try {
        const res: User | null = await UserService.addUser(userToAdd);

        if (!res) {
            alert("Failed to create user");
            return;
        }

        if (window.confirm("User created successfully!"))
            setLoginPage(true);
    } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to create user");
    } finally {
        setProcess(false);
    }
}
//#endregion

//#region JSX
function LogInForm({ navigate, login, setLoginPage }: { navigate: NavigateFunction, login: (credentials: Credentials) => Promise<boolean>, setLoginPage: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <form className="formLogin" onSubmit={(e) => { void SubmitLoginForm(e, navigate, login); }}>
                <h2>Log In</h2>
                <div>
                    <label htmlFor="lblEmail">Email</label>
                    <input type="text" name="lblEmail" id="lblEmail" className="lblEmail" placeholder="email@email.com" required />
                </div>
                <div>
                    <label htmlFor="lblPass">Password</label>
                    <input type="password" name="lblPass" id="lblPass" className="lblPass" required />
                </div>
                <button type="submit">LogIn</button>
                <Link className="btForgot" to="/recover-password">Forgot your password?</Link>
                <Link className="btSignUp" to="" onClick={(e) => { e.preventDefault(); setLoginPage(false); }}>Don't have an account?</Link>
            </form>
        </>
    );
}

function SignUpForm({ setLoginPage }: { setLoginPage: Dispatch<SetStateAction<boolean>> }) {
    const [isProcessing, setProcess] = useState(false);

    return (
        <>
            <form className="formSignUp" onSubmit={(e) => { void SubmitSignUpForm(e, setLoginPage, isProcessing, setProcess); }}>
                <h2>SignUp</h2>
                <div>
                    <label htmlFor="lblEmail">Email</label>
                    <input type="text" name="lblEmail" id="lblEmail" className="lblEmail" placeholder="email@email.com" required />
                </div>
                <div>
                    <label htmlFor="lblPass">Password</label>
                    <input type="password" name="lblPass" id="lblPass" className="lblPass" required />
                </div>
                <hr />
                <h3>Informations</h3>
                <div>
                    <label htmlFor="lblName">First Name</label>
                    <input type="text" name="lblName" id="lblName" className="lblName" placeholder="ex.: John" required />
                </div>
                <div>
                    <label htmlFor="lblSurname">Surname</label>
                    <input type="text" name="lblSurname" id="lblSurname" className="lblSurname" placeholder="ex.: Smith" required />
                </div>
                <div>
                    <label htmlFor="lblPhone">Phone</label>
                    <input type="text" name="lblPhone" id="lblPhone" className="lblPhone" placeholder="+000 000 000" required />
                </div>
                <button type="submit" disabled={isProcessing}>Register</button>
                <Link className="btForgot" to="/recover-password">Forgot your password?</Link>
                <Link className="btSignIn" to="" onClick={(e) => { e.preventDefault(); setLoginPage(true); }}>Already have an account?</Link>
            </form>
        </>
    );
}

function LoginPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [isLoginPage, setLoginPage] = useState(searchParams.get("form") === "signIn");

    useEffect(() => {
        document.title = `Skillhub - ${isLoginPage ? "Login" : "Sign In"}`;

        if (user)
            navigate("/account");
    }, [navigate, user, isLoginPage]);

    return (
        <>
            <Header />
            <main>
                <Banner />
                <section className="loginContent">
                    {isLoginPage ? <LogInForm navigate={navigate} login={login} setLoginPage={setLoginPage} /> : <SignUpForm setLoginPage={setLoginPage} />}
                </section>
            </main>
            <Footer />
        </>
    );
}

//#endregion