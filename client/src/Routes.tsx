import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/auth/Login";
import WhatsAppLogin from "./pages/auth/WhatsAppLogin";
import Welcome from "./pages/auth/Welcome";
import Home from "./pages/home/Home";
import NotFound from "./pages/NotFound";
import Timeline from "./pages/timeline/Timeline";
import { MainLayout } from "./layouts/Layouts";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import CreatePost from "./pages/create-post/CreatePost";

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
          <Route path="/" element={<Navigate to="/home" />}></Route>
          {/* Private Routes */}
          {loggedIn ? (
            <>
              <Route
                path="/home"
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                }
              />
              <Route
                path="/timeline"
                element={
                  <MainLayout>
                    <Timeline />
                  </MainLayout>
                }
              />
              <Route
                path="/chat"
                element={
                  <MainLayout>
                    <Chat />
                  </MainLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                }
              />
              <Route
                path="/create-post"
                element={
                  <MainLayout>
                    <CreatePost />
                  </MainLayout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth" replace />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
