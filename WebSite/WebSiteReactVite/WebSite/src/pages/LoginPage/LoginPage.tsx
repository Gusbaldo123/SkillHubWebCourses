//#region imports
import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSearchParams, Link, useNavigate, type NavigateFunction } from "react-router";

import "./LoginPage.css";
import "./LoginMobilePage.css";

import Header from "../../components/layout/Header.js";
import Footer from "../../components/layout/Footer.js";
import Banner from "../../components/shared/Banner.js";

import UserService from "../../utils/UserService.js";
import AuthProvider from "../../utils/AuthProvider.js";
import { useAuth } from "../../router/AuthContext.js";
import type { User } from "../../model/User.js";

export default LoginPage;
//#endregion

//#region Handlers
async function SubmitLoginForm(event: React.SubmitEvent<HTMLFormElement>, navigate: NavigateFunction) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  await AuthProvider.authenticate({
    email: String(formData.get("lblEmail")).toLowerCase(),
    password: String(formData.get("lblPass"))
  });

  if (AuthProvider.getUser()) {
    navigate("/Home");
  }
}
async function SubmitSignUpForm(event: React.SubmitEvent<HTMLFormElement>, setLoginPage: Dispatch<SetStateAction<boolean>>, isProcessing: boolean, setProcess: Dispatch<SetStateAction<boolean>>) {
  event.preventDefault();

  if (isProcessing) return;

  setProcess(true);

  const formData = new FormData(event.currentTarget);

  const userToAdd: User = {
    id: 0,
    email: String(formData.get("lblEmail")).toLowerCase(),
    password: String(formData.get("lblPass")),
    isStudent: true,
    firstName: String(formData.get("lblName")),
    surname: String(formData.get("lblSurname")),
    phone: String(formData.get("lblPhone")),
    courseList: []
  };

  const res: User | null = await UserService.addUser(userToAdd);

  if (!res) {
    alert("Error on signing in");
    setProcess(false);
    return;
  }

  if (window.confirm("User created with success!")) {
    setLoginPage(true);
  }

  setProcess(false);
}
//#endregion

//#region JSX
function LogInForm({ navigate, setLoginPage }: { navigate: NavigateFunction, setLoginPage: Dispatch<SetStateAction<boolean>> }) {
  return (
    <>
      <form className="formLogin" onSubmit={(e) => SubmitLoginForm(e, navigate)}>
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
        <Link className="btForgot" to={{ pathname: "/Recover" }}>Forgot your password?</Link>
        <Link className="btSignUp" to={{ pathname: "" }} onClick={(e) => { e.preventDefault(); setLoginPage(false); }}>Don't have an account?</Link>
      </form>
    </>
  );
}
function SignUpForm({ setLoginPage }: { setLoginPage: Dispatch<SetStateAction<boolean>> }) {

  const [isProcessing, setProcess] = useState(false);
  return (
    <>
      <form action="post" className="formSignUp" onSubmit={(e) => { SubmitSignUpForm(e, setLoginPage, isProcessing, setProcess) }}>
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
        <button type="submit">Register</button>
        <Link className="btForgot" to={{ pathname: "/Recover" }}>Forgot your password?</Link>
        <Link className="btSignIn" to={{ pathname: "" }} onClick={(e) => { e.preventDefault(); setLoginPage(true); }}>Already have an account?</Link>
      </form>
    </>
  );
}
function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoginPage, setLoginPage] = useState(searchParams.get("form") === "signIn");

  useEffect(() => {
    document.title = `Skillhub - ${isLoginPage ? "Login" : "Sign In"}`;

    if (user) navigate("/Account");
  }, [navigate, user, isLoginPage]);

  return (
    <>
      <Header />
      <main>
        <Banner />
        <section className="loginContent">
          {isLoginPage ? <LogInForm navigate={navigate} setLoginPage={setLoginPage} /> : <SignUpForm setLoginPage={setLoginPage} />}
        </section>
      </main>
      <Footer />
    </>
  );
}

//#endregion