import { useEffect, useState } from "react";
import { get } from "../../../../services/crud";
import { toast } from "react-toastify";
import UsersList from "../ui/UsersList";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";

export default function UsersListContainer({
  users,
  username,
  listType,
  isLoggedIn,
  isOwnProfile,
  followingsHash,
  addToList,
  toggleFollow,
}: {
  users: { followers: any[]; following: any[] };
  username: string;
  listType: "followers" | "following";
  isLoggedIn: boolean;
  isOwnProfile: boolean;
  followingsHash: { [key: string]: boolean };
  addToList: (data: any[]) => void;
  toggleFollow: (id: string, action: "follow" | "unfollow", user?: any) => void;
}) {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (username) fetchUsers();
  }, [username]);

  const fetchUsers = () => {
    setLoading(true);
    get("user/" + listType + "/" + username, { page: page + 1, limit })
      .then((res) => {
        if (res.data.length < limit) {
          setNoMoreUsers(true);
        }
        addToList([...res.data]);
        setLimit(parseInt(res.limit));
        setPage(parseInt(res.page));
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't fetch users"
        );
        setLoading(false);
      });
  };

  if (loading && users[listType].length === 0) {
    return <BlinkingLoadingCircles />;
  }

  if (!loading && users[listType].length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light my-4 h1 text-secondary rounded"
        style={{ height: "250px", opacity: 0.7 }}
      >
        No Users Found
      </div>
    );
  }

  return (
    <>
      <UsersList
        isLoggedIn={isLoggedIn}
        isOwnProfile={isOwnProfile}
        listType={listType}
        users={users[listType]}
        toggleFollow={toggleFollow}
        followingHash={followingsHash}
        showMoreBtn={!noMoreUsers}
        loading={loading}
        showMoreClicked={fetchUsers}
      />
    </>
  );
}
