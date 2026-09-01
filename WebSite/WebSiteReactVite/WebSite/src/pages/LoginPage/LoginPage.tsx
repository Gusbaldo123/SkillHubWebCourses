//#region imports
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";

import "./LoginPage.css";
import "./LoginMobilePage.css";

import Header from "../../components/layout/Header.js";
import Footer from "../../components/layout/Footer.js";
import Banner from "../../components/shared/Banner.js";

import UserManager from "../../utils/UserManager.js";
import AuthManager from "../../utils/AuthManager.js";

export default LoginPage;
//#endregion

//#region Handlers
async function SubmitLoginForm(event:any, navigate:any) {
  event.preventDefault();

  const credentials = {
    email: event.target.elements.lblEmail.value.toLowerCase(),
    password: event.target.elements.lblPass.value
  }

  await AuthManager.authenticate(credentials);
  if (UserManager.getLocalUser()) {
    navigate("/Home");
  }
}
async function SubmitSignUpForm(event:any, setLoginPage:any, isProcessing:any, setProcess:any) {
  event.preventDefault();

  if (isProcessing) return;

  setProcess(true);
  const el = event.target.elements;
  const res = await UserManager.add({
    email: el.lblEmail.value.toLowerCase(),
    password: el.lblPass.value,
    isStudent: true,
    firstName: el.lblName.value,
    surname: el.lblSurname.value,
    phone: el.lblPhone.value,
    courseList: []
  });

  if (window.confirm(res.data)) {
    setLoginPage(true);
  }
  setProcess(false);
}
//#endregion

//#region JSX
function LogInForm({ navigate, setLoginPage }:{ navigate:any, setLoginPage:any }) {
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
        <Link className="btSignUp" to={{ pathname: "" }} onClick={(e) => { e.preventDefault();setLoginPage(false); }}>Don't have an account?</Link>
      </form>
    </>
  );
}
function SignUpForm({ setLoginPage }: { setLoginPage:any }) {

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
        <Link className="btSignIn" to={{ pathname: "" }} onClick={(e) => { e.preventDefault();setLoginPage(true); }}>Already have an account?</Link>
      </form>
    </>
  );
}
function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoginPage, setLoginPage] = useState(searchParams.get("form") === "signIn");

  const user = UserManager.getLocalUser();
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