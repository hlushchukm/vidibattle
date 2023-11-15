export default function FollowUnfollowBtn({
  listType,
  user,
  followingHash,
  toggleFollow,
}: {
  listType: "followers" | "following";
  user: any;
  followingHash: { [key: string]: boolean };
  toggleFollow: (id: string, action: "follow" | "unfollow", user?: any) => void;
}) {
  return (
    <>
      {listType === "following" && (
        <a
          onClick={() => {
            toggleFollow(user._id, user?.unfollowed ? "follow" : "unfollow");
          }}
          style={{ cursor: "pointer" }}
          className="follow-btn"
        >
          {user?.unfollowed ? "FOLLOW" : "UNFOLLOW"}
        </a>
      )}
      {listType === "followers" && (
        <a
          onClick={() => {
            toggleFollow(
              user._id,
              followingHash[user?._id] && !user?.unfollowed
                ? "unfollow"
                : "follow",
              user
            );
          }}
          style={{ cursor: "pointer" }}
          className="follow-btn"
        >
          {followingHash[user?._id] && !user?.unfollowed
            ? "UNFOLLOW"
            : "FOLLOW"}
        </a>
      )}
    </>
  );
}
