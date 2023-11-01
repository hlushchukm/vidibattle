import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import EditProfileHeader from "./components/EditProfileHeader";

export default function EditProfile() {
  const [pageLoading, setPageLoading] = useState(true);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setPageLoading(false);

    // TODO: send request to fetch profile info to be edited
  }, []);

  const onSave = () => {
    //  TODO: handle required fields before sending
    console.log("save clicked");
    console.log(first_name, last_name, email, whatsapp, bio);
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <EditProfileHeader saveClicked={onSave} />

      <div className="page-content vh-100">
        <div className="container">
          <div className="edit-profile">
            <div className="profile-image">
              <div className="media media-100 rounded-circle">
                <img src="/assets/images/stories/pic3.png" alt="/" />
              </div>
              <a href="javascript:void(0);">Change profile photo</a>
            </div>
            <form>
              <div className="mb-3 input-group input-mini">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group input-mini">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group input-mini">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group input-mini">
                <input
                  type="text"
                  className="form-control"
                  placeholder="WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group input-mini">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
