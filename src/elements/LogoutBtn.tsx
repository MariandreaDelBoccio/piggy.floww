import Button from "./Button";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (e: unknown) {
      console.log(e);
    }
  };

  return (
    <Button
      $flat
      $textColor="#000"
      as="button"
      onClick={logout}
      to="#"
      className="w-full flex items-center text-left rounded-lg hover:bg-gray-100 transition-colors"
      style={{ paddingLeft: "0" }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-4"
      >
        <rect
          x="3"
          y="3"
          width="12"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M16 12h5m0 0l-3-3m3 3l-3 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
      <span className="uppercase font-semibold">Logout</span>
    </Button>
  );
};

export default LogoutButton;
