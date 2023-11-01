import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth";
import { useParams } from "react-router-dom";
import NavTabs from "./components/ui/NavTabs";
import ProfilePostsContainer from "./components/container/ProfilePostsContainer";
import BasicInfo from "./components/container/BasicInfo";
import ProfileHeader from "./components/ProfileHeader";

export default function Profile() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userId, setUserId] = useState("");
  const params = useParams();

  useEffect(() => {
    setLoggedIn(getUserId() !== null && getUserId() !== null);

    if (params.id && params.id !== getUserId()) {
      setIsOwnProfile(false);
      setUserId(params.id);
    } else {
      setIsOwnProfile(true);
      setUserId(getUserId() ?? "");
    }
  }, []);

  return (
    <>
      <ProfileHeader />

      <div className="page-content">
        <div className="container profile-area">
          <BasicInfo isLoggedIn={isLoggedIn} isOwnProfile={isOwnProfile} />
          <div className="contant-section">
            {/* Posts, followers and following buttons */}
            <NavTabs />

            <ProfilePostsContainer />
          </div>
        </div>
      </div>
    </>
  );
}
