import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/auth/Login";
import WhatsAppLogin from "./pages/auth/WhatsAppLogin";
import Home from "./pages/home/Home";
import NotFound from "./pages/NotFound";
import Timeline from "./pages/timeline/Timeline";
import { MainLayout } from "./layouts/Layouts";
import ChatList from "./pages/chat/ChatList";
import Profile from "./pages/profile/Profile";
import CreatePost from "./pages/create-post/CreatePost";
import Messages from "./pages/chat/Messages";
import SuccessCallback from "./pages/auth/SuccessCallback";
import { isLoggedIn } from "./services/auth";
import EditProfile from "./pages/profile/EditProfile";
import Setting from "./pages/setting/Setting";
import Blocked from "./pages/blocked/Blocked";
import SinglePost from "./pages/home/SinglePost";
import Logout from "./pages/Logout";
import StaticPage from "./pages/static-pages/StaticPage";
import SuggestUsersToFollow from "./pages/followers/SuggestUsersToFollow";
import CompetitionsList from "./pages/competition/CompetitionsList";
import CompetitionInfo from "./pages/competition/CompetitionInfo";
import CreateCompetitionPost from "./pages/create-post/CreateCompetitionPost";
import Wallet from "./pages/wallet/Wallet";
import CompetitionPosts from "./pages/competition/CompetitionPosts";

export default function Router() {
  let loggedIn = isLoggedIn();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loggedIn = isLoggedIn();
    setLoading(false);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="auth/">
            {/* <Route index element={<Welcome />} /> */}
            <Route index element={<Navigate to="login" />} />
            <Route path="login/">
              <Route index element={<Login />} />
              <Route path="successfull" element={<SuccessCallback />} />
              <Route path="whatsapp/" element={<WhatsAppLogin />} />
            </Route>
          </Route>
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/profile/:username"
            element={
              <MainLayout active="profile">
                <Profile />
              </MainLayout>
            }
          />
          <Route
            path="/post/:id"
            element={
              <MainLayout>
                <SinglePost />
              </MainLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={<StaticPage pagename="privacy-policy" />}
          />
          <Route
            path="/terms-and-conditions"
            element={<StaticPage pagename="terms-and-conditions" />}
          />
          <Route path="/account-setup/">
            <Route index element={<Navigate to={"profile"} />} />
            <Route
              path="profile"
              element={<EditProfile isAccountSetup={true} />}
            />
            <Route path="suggestion" element={<SuggestUsersToFollow />} />
          </Route>
          <Route
            path="/home"
            element={
              <MainLayout active="home">
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/competition"
            element={
              <MainLayout>
                <CompetitionsList />
              </MainLayout>
            }
          />
          <Route
            path="/competition/info/:name"
            element={
              <MainLayout>
                <CompetitionInfo />
              </MainLayout>
            }
          />
          <Route
            path="/competition/post/:name"
            element={
              <MainLayout>
                <CompetitionPosts />
              </MainLayout>
            }
          />
          <Route
            path="/competition/post/round/:number/:name"
            element={
              <MainLayout>
                <CompetitionPosts />
              </MainLayout>
            }
          />

          {/* Private Routes */}
          {loggedIn ? (
            <>
              <Route
                path="/timeline"
                element={
                  <MainLayout active="timeline">
                    <Timeline />
                  </MainLayout>
                }
              />
              <Route
                path="/chat"
                element={
                  <MainLayout active="chat">
                    <ChatList />
                  </MainLayout>
                }
              />
              <Route path="chat/:username" element={<Messages />} />
              <Route
                path="/profile"
                element={
                  <MainLayout active="profile">
                    <Profile />
                  </MainLayout>
                }
              />
              <Route path="/create-post" element={<CreatePost />} />
              <Route
                path="/competition/:name/:round/create-post"
                element={<CreateCompetitionPost />}
              />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/blocked" element={<Blocked />} />
              <Route path="/wallet" element={<Wallet />} />
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
