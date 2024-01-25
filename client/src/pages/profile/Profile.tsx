import { useEffect, useState } from "react";
import { getUser, getUserId, getUsername } from "../../services/auth";
import { useParams } from "react-router-dom";
import BasicInfo from "./components/container/BasicInfo";
import ProfileHeader from "./components/ProfileHeader";
import PageLoading from "../../components/PageLoading";
import { create, get } from "../../services/crud";
import UserNotFound from "../../components/UserNotFound";
import SwiperContainer from "./components/container/SwiperContainer";
import SocialMediaLinks from "./components/ui/SocialMediaLinks";

export default function Profile() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState<any>(null);
  const [noUserFound, setNoUserFound] = useState(false);

  const params = useParams();

  useEffect(() => {
    setLoggedIn(getUserId() !== null && getUser() !== null);

    if (params.username && params.username !== getUsername()) {
      setIsOwnProfile(false);
      setUsername(params.username);
    } else {
      setIsOwnProfile(true);
      setUsername(getUsername() ?? "");
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchProfileInfo(username);
    }
  }, [username]);

  const fetchProfileInfo = (id: string) => {
    get("user/profileInfo/" + id)
      .then((res) => {
        setProfileData(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        if (e.response?.status) {
          setNoUserFound(true);
        }
        setPageLoading(false);
      });
  };

  const toggleBlock = (is_block: boolean) => {
    setProfileData((profile: any) => ({
      ...profile,
      is_blocked: is_block,
    }));

    create(
      "user/" + (is_block ? "block/" : "unblock/") + profileData._id,
      {}
    ).catch((e) => {
      console.log(e);
      setProfileData((profile: any) => ({
        ...profile,
        is_blocked: !is_block,
      }));
    });
  };

  const toggleFollow = (is_follow: boolean) => {
    setProfileData((profile: any) => ({
      ...profile,
      is_followed: is_follow,
      followers_count: is_follow
        ? profile.followers_count + 1
        : profile.followers_count - 1,
    }));

    create(
      "user/" + (is_follow ? "follow/" : "unfollow/") + profileData._id,
      {}
    ).catch((e) => {
      console.log(e);
      setProfileData((profile: any) => ({
        ...profile,
        is_followed: !is_follow,
        followers_count: !is_follow
          ? profile.followers_count + 1
          : profile.followers_count - 1,
      }));
    });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (noUserFound) {
    return (
      <>
        <ProfileHeader isOwnProfile={isOwnProfile} />
        <UserNotFound />;
      </>
    );
  }

  return (
    <>
      <ProfileHeader isOwnProfile={isOwnProfile} />

      <div className="page-content">
        <div className="container profile-area">
          <BasicInfo
            profile={profileData}
            isLoggedIn={isLoggedIn}
            isOwnProfile={isOwnProfile}
            toggleBlock={() => toggleBlock(!profileData.is_blocked)}
            toggleFollow={() => toggleFollow(!profileData.is_followed)}
          />
          <div className="w-100 d-flex justify-content-center mt-3">
            <SocialMediaLinks social_links={profileData?.social_links} />
          </div>
          <div className="contant-section pb-5">
            <SwiperContainer
              profileData={profileData}
              isOwnProfile={isOwnProfile}
              username={username}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </>
  );
}
