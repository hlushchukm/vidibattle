import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import EditProfileHeader from "./components/EditProfileHeader";
import { get, update } from "../../services/crud";
import { toast } from "react-toastify";
import { updateUserData } from "../../services/auth";

export default function EditProfile() {
  const [pageLoading, setPageLoading] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState<any>();
  const [errors, setErrors] = useState<any>();
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);
  // TODO: profile image changing

  const fetchUserProfile = () => {
    setPageLoading(true);
    get("user/selfInfo")
      .then((res) => {
        setProfile(res.data);
        const data = res.data;
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
        setEmail(data.email ?? "");
        setBio(data.bio ?? "");
        setWhatsapp(data.whatsapp ?? "");
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't get user info"
        );
        setPageLoading(false);
      });
  };

  const onSave = () => {
    if (!validateForm() || updateLoading) {
      return;
    }

    setUpdateLoading(true);
    const payload = {
      first_name,
      last_name,
      email,
      whatsapp,
      bio,
    };
    update("user/", payload)
      .then((res) => {
        setProfile(res.data);
        if (res.data) {
          updateUserData(res.data);
        }
        toast.success(res.message);
        setUpdateLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update user data"
        );
        setUpdateLoading(false);
      });
  };

  const validateForm = () => {
    let valid = true;
    if (!first_name) {
      setErrors((e: any) => ({ ...e, first_name: "First Name is Required" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, first_name: null }));
    }

    if (!last_name) {
      setErrors((e: any) => ({ ...e, last_name: "Last Name is Required" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, last_name: null }));
    }

    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!emailRegex.test(email)) {
      setErrors((e: any) => ({ ...e, email: "invalid email pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, email: null }));
    }

    let whatsappRegex = /^[0-9]{7,15}$/;
    if (whatsapp.length > 0 && !whatsappRegex.test(whatsapp)) {
      setErrors((e: any) => ({
        ...e,
        whatsapp: "Invalid WhatsApp number length",
      }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, whatsapp: null }));
    }

    return valid;
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <EditProfileHeader saveClicked={onSave} loading={updateLoading} />

      <div className="page-content vh-100">
        <div className="container">
          <div className="edit-profile">
            <div className="profile-image">
              <div className="media media-100 rounded-circle">
                <img src="/assets/images/stories/pic3.png" alt="/" />
              </div>
              <a>Change profile photo</a>
              {profile && (
                <span>
                  {profile.is_complete ? (
                    <div className="badge badge-success me-1 mb-1">
                      Complete
                    </div>
                  ) : (
                    <div className="badge badge-danger me-1 mb-1">
                      Incomplete
                    </div>
                  )}
                </span>
              )}
            </div>
            <form>
              <div className="mb-3 input-group input-mini">
                {first_name && <div className="w-100 small">First Name:</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors?.first_name && (
                  <div className="small text-danger w-100 py-1">
                    {errors.first_name}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {last_name && <div className="w-100 small">Last Name:</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors?.last_name && (
                  <div className="small text-danger w-100 py-1">
                    {errors.last_name}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {email && <div className="w-100 small">Email:</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors?.email && (
                  <div className="small text-danger w-100 py-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {whatsapp && <div className="w-100 small">WhatsApp:</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
                {errors?.whatsapp && (
                  <div className="small text-danger w-100 py-1">
                    {errors.whatsapp}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {bio && <div className="w-100 small">Bio:</div>}
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
