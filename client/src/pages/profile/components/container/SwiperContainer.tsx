import { useState, useRef, useEffect } from "react";
import NavTabs from "../ui/NavTabs";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import ProfilePostsContainer from "./ProfilePostsContainer";
import { create, get } from "../../../../services/crud";
import { formatResourceURL } from "../../../../services/asset-paths";
import UsersListContainer from "./UsersListContainer";
import { toast } from "react-toastify";

export default function SwiperContainer({
  profileData,
  isOwnProfile,
  username,
  isLoggedIn,
}: {
  profileData: any;
  isOwnProfile: boolean;
  username: string;
  isLoggedIn: boolean;
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [lastDate, setLastDate] = useState();
  const [lastPostId, setLastPostId] = useState();
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followingsHash, setFollowingsHash] = useState<{
    [key: string]: boolean;
  }>({});
  const [followersAndFollowingData, setFollowersAndFollowingData] = useState<{
    followers: any[];
    following: any[];
  }>({
    followers: [],
    following: [],
  });
  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    if (username) {
      fetchPosts(username);
    }
  }, [username]);

  useEffect(() => {
    const hash: { [key: string]: boolean } = {};
    followersAndFollowingData.following.map((f: any) => {
      if (!hash[f._id]) {
        hash[f._id] = f.unfollowed !== undefined ? !f.unfollowed : true;
      }
    });

    setFollowingsHash(hash);
  }, [followersAndFollowingData.following]);

  const fetchPosts = async (username: string) => {
    setPostsLoading(true);
    const pageSize = 15;
    try {
      const res = await get("post/timeline/" + username, {
        pageSize,
        lastDate,
        lastPostId,
      });

      if (res.data.length === 0 || res.data.length < pageSize) {
        setPostsLoading(false);
        setNoMorePosts(true);
      }
      const photos = res.data.map((data: any) => {
        if (data.media.length > 0) {
          const media = data.media[0];
          if (media?.type === "video") {
            data.src = media?.thumbnail?.filename
              ? formatResourceURL(media?.thumbnail?.filename)
              : null;
          } else {
            data.src = media?.filename
              ? formatResourceURL(media?.filename)
              : null;
          }
        }
        return data;
      });
      setPosts((p) => [...p, ...photos]);
      setLastDate(res.lastDate);
      setLastPostId(res.lastPostId);
      setPostsLoading(false);
    } catch (e) {
      console.log(e);
      setPostsLoading(false);
    }
  };

  const toggleFollow = (
    id: string,
    action: "follow" | "unfollow",
    userData?: boolean
  ) => {
    const originalCopy = JSON.stringify(followersAndFollowingData);
    const dataCopy = { ...followersAndFollowingData };

    let found = false;
    dataCopy.following = dataCopy?.following?.map((followed: any) => {
      if (followed._id === id) {
        followed.unfollowed = !followed.unfollowed ?? true;
        found = true;
      }
      return followed;
    });

    if (!found && "follow" && userData) {
      dataCopy.following = [userData, ...dataCopy.following];
    }

    setFollowingCount((c: number) => (action === "follow" ? c + 1 : c - 1));

    setFollowersAndFollowingData({ ...dataCopy });

    create("user/" + action + "/" + id, {}).catch((e) => {
      console.log(e);
      toast.error("Error! action failed");
      setFollowersAndFollowingData(JSON.parse(originalCopy));
    });
  };

  const addToFollowersList = (newFollowers: any[]) => {
    const datacopy = followersAndFollowingData;
    datacopy.followers = [...datacopy.followers, ...newFollowers];
    setFollowersAndFollowingData(datacopy);
  };

  const addToFollowingsList = (newFollowings: any[]) => {
    const datacopy = followersAndFollowingData;
    datacopy.following = [...datacopy.following, ...newFollowings];
    setFollowersAndFollowingData(datacopy);
  };

  useEffect(() => {
    setFollowersCount(profileData?.followers_count ?? 0);
    setFollowingCount(profileData?.following_count ?? 0);
  }, []);

  return (
    <>
      {/* Posts, followers and following buttons */}
      <NavTabs
        activeIndex={swiperIndex}
        posts={profileData?.posts_count}
        followers={followersCount.toString()}
        following={followingCount.toString()}
        changeSlide={(index: number) =>
          swiperRef.current?.swiper.slideTo(index)
        }
      />

      {/* Posts, followers and following swiper */}
      <Swiper
        ref={swiperRef}
        className="overflow-hidden"
        onSlideChange={(swiper) => setSwiperIndex(swiper.activeIndex)}
      >
        <SwiperSlide>
          <ProfilePostsContainer
            posts={posts}
            loading={postsLoading}
            showMoreBtn={!noMorePosts}
            loadMore={() => fetchPosts(username)}
          />
        </SwiperSlide>
        <SwiperSlide>
          <UsersListContainer
            users={followersAndFollowingData}
            username={username}
            listType="following"
            followingsHash={followingsHash}
            isLoggedIn={isLoggedIn}
            isOwnProfile={isOwnProfile}
            addToList={addToFollowingsList}
            toggleFollow={toggleFollow}
          />
        </SwiperSlide>
        <SwiperSlide>
          <UsersListContainer
            users={followersAndFollowingData}
            username={username}
            listType="followers"
            followingsHash={followingsHash}
            isLoggedIn={isLoggedIn}
            isOwnProfile={isOwnProfile}
            addToList={addToFollowersList}
            toggleFollow={toggleFollow}
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
