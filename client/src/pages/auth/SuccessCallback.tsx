import { useEffect } from "react";
import { useCurrentUserStore } from "../../store";
import { get } from "../../services/crud";
import { setUser, setUserId } from "../../services/auth";
import SplashScreen from "../../components/SplashScreen";

export default function SuccessCallback() {
  const setUserId_store = useCurrentUserStore((s: any) => s.setCurrentUserId);
  const setCurrentUser_store = useCurrentUserStore(
    (s: any) => s.setCurrentUserId
  );

  useEffect(() => {
    get("user/authenticated")
      .then((res) => {
        setUserId_store(res.data._id);
        setCurrentUser_store(res.data);
        setUserId(res.data._id);
        setUser(res.data);
        window.location.replace("/home");
      })
      .catch(() => {
        // TODO: uncomment letter
        // window.location.replace("/auth/login");
      });
  }, []);

  return <SplashScreen />;
}
