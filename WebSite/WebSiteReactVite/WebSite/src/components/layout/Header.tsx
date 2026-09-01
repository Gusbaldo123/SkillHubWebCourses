//#region imports
import React,{useState,useEffect} from "react";
import { Link,useNavigate, type NavigateFunction } from "react-router";
import "./Header.css";
import "./HeaderMobile.css";

import IconSH from "../../assets/IconSH.png";

import UserManager from "../../utils/UserManager";
import type { User } from "../../model/User";

export default Header;
//#endregion

function Header() {

  //#region Handlers
  function LogoffClickHandler(navigate: NavigateFunction, SetUser: React.Dispatch<React.SetStateAction<User | null>>) {
    SetUser(null);
    UserManager.setLocalUser(null);
    alert("Logged off successfully")
    navigate("/Home");
  }
  //#endregion
  
  //#region Components
  function RenderLoginButtons({ user, navigate, SetUser }: { user: User | null, navigate: NavigateFunction, SetUser: React.Dispatch<React.SetStateAction<User | null>> }) {
    return user == null ? //if unlogged, return login/signup buttons
      <div className="navHeaderButtons">
        <Link className="btSignIn" to={{ pathname: "/login", search: "?form=signIn" }}>Sign In</Link>
        <Link className="btSignUp" to={{ pathname: "/login", search: "?form=signUp" }}>Sign Up</Link>
      </div>
      : // if logged, return account/logoff buttons
      <div className="navHeaderButtons">
        <Link className="btUser" to={{ pathname: "/Account" }}>{user.firstName}</Link>
        <button className="btLogOff" onClick={() => LogoffClickHandler(navigate,SetUser)}>LogOff</button>
      </div>
  }
  //#endregion

  const [user, SetUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = UserManager.getLocalUser();
    SetUser(localUser as User | null);
  }, []);

  //#region JSX
  return (
    <header className="siteHeader">
      <nav className="navHeader">
        <div className="navHeaderIcon">
          <Link className="iconHeader" to={{ pathname: '/Home' }}>
            <img src={IconSH} alt="iconWebsite" />
          </Link>
        </div>
        <RenderLoginButtons user={user} navigate={navigate} SetUser={SetUser}/>
      </nav>
    </header>
  );
  //#endregion
}
