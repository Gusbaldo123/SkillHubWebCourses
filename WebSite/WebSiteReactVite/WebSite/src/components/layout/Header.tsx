//#region imports
import { Link,useNavigate } from "react-router";
import "./Header.css";
import "./HeaderMobile.css";

import IconSH from "../../assets/IconSH.png";

import { useAuth } from "../../router/AuthContext";
const { user, logout } = useAuth();
const navigate = useNavigate();

export default Header;
//#endregion

function Header() {

  //#region Handlers
  function LogoffClickHandler() {
    logout();
    alert("Logged off successfully")
    navigate("/Home");
  }
  //#endregion
  
  //#region Components
  function RenderLoginButtons() {
    return user == null ? //if unlogged, return login/signup buttons
      <div className="navHeaderButtons">
        <Link className="btSignIn" to={{ pathname: "/login", search: "?form=signIn" }}>Sign In</Link>
        <Link className="btSignUp" to={{ pathname: "/login", search: "?form=signUp" }}>Sign Up</Link>
      </div>
      : // if logged, return account/logoff buttons
      <div className="navHeaderButtons">
        <Link className="btUser" to={{ pathname: "/Account" }}>{user.firstName}</Link>
        <button className="btLogOff" onClick={() => LogoffClickHandler()}>LogOff</button>
      </div>
  }
  //#endregion

  

  //#region JSX
  return (
    <header className="siteHeader">
      <nav className="navHeader">
        <div className="navHeaderIcon">
          <Link className="iconHeader" to={{ pathname: '/Home' }}>
            <img src={IconSH} alt="iconWebsite" />
          </Link>
        </div>
        <RenderLoginButtons/>
      </nav>
    </header>
  );
  //#endregion
}
