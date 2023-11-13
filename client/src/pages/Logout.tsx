import { useEffect } from "react";
import PageLoading from "../components/PageLoading";
import { get } from "../services/crud";
import { clearAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    clearAuth();
    get("auth/logout")
      .then(() => {
        navigate("/auth/login");
      })
      .catch((e) => {
        console.log(e);
        toast.error(e?.response?.data?.message ?? "Error! Couldn't Logout");
      });
  }, []);

  return <PageLoading />;
}
