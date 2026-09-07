//#region imports

import React, { useEffect,useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate, Link } from "react-router";

import RecoverPasswordService from "../../utils/RecoverAccountService";

import "./RecoverPasswordPage.css"
import "./RecoverPasswordMobilePage.css"

import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import Banner from "../../components/shared/Banner"
import { useAuth } from "../../router/AuthContext";

export default RecoverPasswordPage;
//#endregion

//#region Handlers
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

async function Recover(e: React.FormEvent<HTMLFormElement>, setResponse: (message: string) => void, isProcessing: boolean, setProcess: Dispatch<SetStateAction<boolean>>) {
    e.preventDefault();
    if (isProcessing) return;
    const emailInput = e.currentTarget.elements.namedItem('emailRecover') as HTMLInputElement | null;
    const email = emailInput?.value.trim().toLowerCase();
    if (!email || !validateEmail(email)) {
        setResponse("Invalid Email");
        return;
    }

    setProcess(true);
    try {
        await SendMail(email);
        setResponse(`Mail sent to '${email}' (May be in spam!)`);
    } catch (error) {
        setResponse("Failed to send email");
    } finally {
        setProcess(false);
    }
}
async function SendMail(email: string) {
    const res = await RecoverPasswordService.sendMail(email);
    alert(res);
}
//#endregion

//#region JSX
function RecoverPasswordPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [response, setResponse] = useState("");
    const [isProcessing, setProcess] = useState(false);
    useEffect(() => {
        document.title = "Skillhub - Recover Password";

        if (user) navigate("/home");
    }, [navigate]);

    return (<>
        <Header />
        <Banner />
        <section className="RecoverPasswordContent">
            <h2>Recover Password</h2>
            <form action="" method="post" onSubmit={async (e) => await Recover(e, setResponse, isProcessing, setProcess)}>
                <label htmlFor="emailRecover" >Email: </label>
                <input type="email" name="emailRecover" id="emailRecover" placeholder="email@email.com" />
                <input type="submit" value="Confirm" className="submitBt" />
            </form>
            <Link className="btSignIn" to={{ pathname: "/login", search: "?form=signIn" }}>New account</Link>
            <Link className="btSignUp" to={{ pathname: "/login", search: "?form=signUp" }}>Log in</Link>
            <br />
            <p className="responseRecover">{response}</p>
        </section>
        <Footer />
    </>);
}
//#endregion