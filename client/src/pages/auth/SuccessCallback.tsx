import { useEffect } from "react";
import { useCurrentUserStore } from "../../store";
import { get } from "../../services/crud";
import { setUser, setUserId } from "../../services/auth";
import SplashScreen from "../../components/SplashScreen";
import { useNavigate } from "react-router-dom";

export default function SuccessCallback() {
  const setUserId_store = useCurrentUserStore((s: any) => s.setCurrentUserId);
  const setCurrentUser_store = useCurrentUserStore(
    (s: any) => s.setCurrentUserId
  );
  const navigate = useNavigate();

  useEffect(() => {
    get("user/authenticated")
      .then((res) => {
        if (res.data.is_complete) {
          setUserId_store(res.data._id);
          setCurrentUser_store(res.data);
          setUserId(res.data._id);
          setUser(res.data);
          window.location.replace("/home");
        } else {
          // go to profile completion
          navigate("/account-setup");
        }
      })
      .catch(() => {
        window.location.replace("/auth/login");
      });
  }, []);

  return <SplashScreen />;
}
