import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/auth/Login";
import WhatsAppLogin from "./pages/auth/WhatsAppLogin";
import Welcome from "./pages/auth/Welcome";
import Home from "./pages/home/Home";
import NotFound from "./pages/NotFound";

export default function Router() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: check if user is logged in
    setLoading(false);
    setLoggedIn(true);
  });

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="auth/">
            <Route index element={<Welcome />} />
            <Route path="login/">
              <Route index element={<Login />} />
              <Route path="whatsapp/" element={<WhatsAppLogin />} />
            </Route>
          </Route>
          {loggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/home" />}></Route>
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<NotFound />} />

              {/* <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NoPage />} />
                  </Route> */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth" replace />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
