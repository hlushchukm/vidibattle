import { useEffect, useRef, useState } from "react";
import PageLoading from "../../components/PageLoading";
import EditProfileHeader from "./components/EditProfileHeader";
import { get, update, upload } from "../../services/crud";
import { toast } from "react-toastify";
import { updateUserData } from "../../services/auth";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../services/asset-paths";
import { useNavigate } from "react-router-dom";
import { Profile, emptyProfileData } from "./ProfileInterface";
import AddressForm from "./components/container/AddressForm";
import SocialMediaLinksForm from "./components/container/SocialMediaLinksForm";

export default function EditProfile({
  isAccountSetup,
}: {
  isAccountSetup?: boolean;
}) {
  const [pageLoading, setPageLoading] = useState(false);
  const [fullProfileData, setFullProfileData] = useState<any>({});
  const [formData, setFormData] = useState<Profile>(emptyProfileData);
  const [errors, setErrors] = useState<any>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newProfileImg, setNewProfileImg] = useState<any>();
  const profileImgInputRef = useRef<any>();
  const [disableEmail, setDisableEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profileImgInputRef.current) profileImgInputRef.current.value = null;
  }, [newProfileImg]);

  const fetchUserProfile = () => {
    setPageLoading(true);
    get("user/selfInfo")
      .then((res) => {
        setFullProfileData(res.data);
        assignDataToFormData(res.data as Profile);
        setPageLoading(false);
        setNewProfileImg(null);

        if (res.data?.email && res.data?.email.length > 0) {
          setDisableEmail(true);
        } else {
          setDisableEmail(false);
        }
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

    if (newProfileImg) {
      saveWithProfileImg();
      return;
    }

    setUpdateLoading(true);
    const payload = { data: JSON.stringify(formData) };
    update("user/", payload)
      .then((res) => {
        setFullProfileData(res.data);
        assignDataToFormData(res.data);
        if (res.data) {
          updateUserData(res.data);
        }
        toast.success(res.message);
        setUpdateLoading(false);
        setNewProfileImg(null);
        if (isAccountSetup) {
          navigate("/account-setup/suggestion");
        }

        if (res.data?.email && res.data?.email.length > 0) {
          setDisableEmail(true);
        } else {
          setDisableEmail(false);
        }
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
    if (!formData.first_name) {
      setErrors((e: any) => ({ ...e, first_name: "First Name is Required" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, first_name: null }));
    }

    if (!formData.last_name) {
      setErrors((e: any) => ({ ...e, last_name: "Last Name is Required" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, last_name: null }));
    }

    if (!formData.username) {
      setErrors((e: any) => ({ ...e, username: "User Name is Required" }));
      valid = false;
    } else if (formData.username.includes(" ")) {
      setErrors((e: any) => ({
        ...e,
        username: "User Name Can't Contain a Space",
      }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, username: null }));
    }

    if (!formData.bio) {
      setErrors((e: any) => ({ ...e, bio: "Bio is Required" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, bio: null }));
    }

    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!emailRegex.test(formData.email)) {
      setErrors((e: any) => ({ ...e, email: "invalid email pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, email: null }));
    }

    let contactNo = /^[0-9]{7,15}$/;
    if (
      formData.contact_no.length > 0 &&
      !contactNo.test(formData.contact_no)
    ) {
      setErrors((e: any) => ({
        ...e,
        contact_no: "Invalid contact number length",
      }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, contact_no: null }));
    }

    // Social Media Links Validations
    if (
      formData.social_links.facebook &&
      !validateURL(formData.social_links.facebook)
    ) {
      setErrors((e: any) => ({ ...e, facebook: "invalid url pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, facebook: null }));
    }

    if (
      formData.social_links.instagram &&
      !validateURL(formData.social_links.instagram)
    ) {
      setErrors((e: any) => ({ ...e, instagram: "invalid url pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, instagram: null }));
    }

    if (
      formData.social_links.twitter &&
      !validateURL(formData.social_links.twitter)
    ) {
      setErrors((e: any) => ({ ...e, twitter: "invalid url pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, twitter: null }));
    }

    if (
      formData.social_links.linkedin &&
      !validateURL(formData.social_links.linkedin)
    ) {
      setErrors((e: any) => ({ ...e, linkedin: "invalid url pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, linkedin: null }));
    }

    if (
      formData.social_links.snapchat &&
      !validateURL(formData.social_links.snapchat)
    ) {
      setErrors((e: any) => ({ ...e, snapchat: "invalid url pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, snapchat: null }));
    }

    if (
      formData.social_links.whatsapp &&
      !validateURL(formData.social_links.whatsapp)
    ) {
      setErrors((e: any) => ({ ...e, whatsapp_link: "invalid url pattern" }));
      valid = false;
    } else {
      setErrors((e: any) => ({ ...e, whatsapp_link: null }));
    }

    return valid;
  };

  function validateURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  const saveWithProfileImg = () => {
    const fd = new FormData();
    fd.append("file", newProfileImg);
    fd.append("data", JSON.stringify(formData));

    setUpdateLoading(true);
    upload("user/", fd, () => {}, "put")
      .then((res) => {
        setFullProfileData(res.data);
        assignDataToFormData(res.data);
        if (res.data) {
          updateUserData(res.data);
        }
        toast.success(res.message);
        setUpdateLoading(false);
        setNewProfileImg(null);
        if (isAccountSetup) {
          navigate("/account-setup/suggestion");
        }

        if (res.data?.email && res.data?.email.length > 0) {
          setDisableEmail(true);
        } else {
          setDisableEmail(false);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update user data"
        );
        setUpdateLoading(false);
      });
  };

  const openProfileImgDialog = () => {
    if (profileImgInputRef.current) profileImgInputRef.current.click();
  };

  const handleProfileImgChange = (event: any) => {
    setNewProfileImg(event.target.files[0]);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((data) => ({ ...data, [key]: value }));
  };

  const updateAddressData = (key: string, value: any) => {
    setFormData((data) => ({
      ...data,
      address: { ...data.address, [key]: value },
    }));
  };
  const updateAddressAsGroup = ({
    country,
    state,
    city,
  }: {
    country: string;
    state: string;
    city: string;
  }) => {
    setFormData((data) => ({
      ...data,
      address: { ...data.address, country, city, state },
    }));
  };

  const updateSocialMediaData = (key: string, value: any) => {
    setFormData((data) => ({
      ...data,
      social_links: { ...data.social_links, [key]: value },
    }));
  };

  const assignDataToFormData = (data: any) => {
    const obj: Profile = {
      first_name: data.first_name ?? "",
      last_name: data.last_name ?? "",
      email: data.email ?? "",
      username: data.username ?? "",
      contact_no: data.contact_no ?? "",
      bio: data.bio ?? "",
      address: {
        country: data.address?.country ?? "",
        state: data.address?.state ?? "",
        city: data.address?.city ?? "",
        address_line: data.address?.address_line ?? "",
        zip_code: data.address?.zip_code ?? "",
      },
      social_links: {
        facebook: data.social_links?.facebook ?? "",
        instagram: data.social_links?.instagram ?? "",
        twitter: data.social_links?.twitter ?? "",
        linkedin: data.social_links?.linkedin ?? "",
        snapchat: data.social_links?.snapchat ?? "",
        whatsapp: data.social_links?.whatsapp ?? "",
      },
      interested_to_earn: data?.interested_to_earn ?? false,
    };

    setFormData(obj);
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <EditProfileHeader
        saveClicked={onSave}
        loading={updateLoading}
        disableCancel={isAccountSetup || false}
      />

      <div className="page-content vh-100">
        <div className="container">
          <div className="edit-profile">
            <div className="profile-image">
              <div className="media media-100 rounded-circle position-relative">
                <img
                  src={
                    newProfileImg
                      ? URL.createObjectURL(newProfileImg)
                      : formatResourceURL(fullProfileData?.profile_img)
                  }
                  onError={handleProfileImageError}
                />

                {newProfileImg && (
                  <div
                    onClick={() => setNewProfileImg(null)}
                    className="position-absolute rounded-circle bg-danger d-flex justify-content-center align-items-center"
                    style={{
                      height: "30px",
                      width: "30px",
                      top: "-15px",
                      right: "-15px",
                      cursor: "pointer",
                    }}
                  >
                    <i
                      className="fa fa-x text-white"
                      style={{ fontSize: "14px", lineHeight: "0" }}
                    ></i>
                  </div>
                )}
              </div>
              <a onClick={openProfileImgDialog} style={{ cursor: "pointer" }}>
                Change profile photo
              </a>
              {fullProfileData && (
                <span>
                  {fullProfileData.is_complete ? (
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
                {formData.first_name && (
                  <div className="w-100 small">First Name:</div>
                )}
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData("first_name", e.target.value)}
                />
                {errors?.first_name && (
                  <div className="small text-danger w-100 py-1">
                    {errors.first_name}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {formData.last_name && (
                  <div className="w-100 small">Last Name:</div>
                )}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData("last_name", e.target.value)}
                />
                {errors?.last_name && (
                  <div className="small text-danger w-100 py-1">
                    {errors.last_name}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {formData.username && (
                  <div className="w-100 small">User Name:</div>
                )}
                <span
                  className="input-group-text"
                  style={{ paddingLeft: "0px", paddingRight: "0px" }}
                >
                  <i className="fa fa-at"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="User Name"
                  value={formData.username}
                  onChange={(e) => updateFormData("username", e.target.value)}
                />
                {errors?.username && (
                  <div className="small text-danger w-100 py-1">
                    {errors.username}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {formData.email && <div className="w-100 small">Email:</div>}
                <input
                  type="text"
                  className={`form-control ${disableEmail ? "text-muted" : ""}`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  disabled={disableEmail}
                />
                {errors?.email && (
                  <div className="small text-danger w-100 py-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {formData.contact_no && (
                  <div className="w-100 small">Contact Number:</div>
                )}
                <input
                  type="number"
                  className="form-control numberInput"
                  placeholder="Contact Number"
                  value={formData.contact_no}
                  onChange={(e) => updateFormData("contact_no", e.target.value)}
                />
                {errors?.contact_no && (
                  <div className="small text-danger w-100 py-1">
                    {errors.contact_no}
                  </div>
                )}
              </div>
              <div className="mb-3 input-group input-mini">
                {formData.bio && <div className="w-100 small">Bio:</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                />
                {errors?.bio && (
                  <div className="small text-danger w-100 py-1">
                    {errors.bio}
                  </div>
                )}
              </div>
              <div className="mb-3 d-flex form-check align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="interestedToEarn"
                  checked={formData.interested_to_earn}
                  onChange={() => {
                    updateFormData(
                      "interested_to_earn",
                      !formData.interested_to_earn
                    );
                  }}
                />
                <label
                  className="form-check-label"
                  style={{ lineHeight: "0" }}
                  htmlFor="interestedToEarn"
                >
                  Interested to Earning
                </label>
              </div>

              {/* Address Info */}
              <div className="divider mt-4"></div>
              <h3 className="text-primary">Address Information</h3>
              <div className="divider"></div>
              <AddressForm
                addressData={formData.address}
                onAddressChange={updateAddressData}
                updateAddressAsGroup={updateAddressAsGroup}
              />

              {/* Social Media Links */}
              <div className="divider mt-4"></div>
              <h3 className="text-primary">Social Media Links</h3>
              <div className="divider"></div>

              <SocialMediaLinksForm
                socialMediaData={formData.social_links}
                onSocialMediaLinkChange={updateSocialMediaData}
                errors={errors}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Hidden Input Elements for profile_img upload */}
      <input
        type="file"
        accept="image/*"
        ref={profileImgInputRef}
        onChange={handleProfileImgChange}
        style={{ display: "none" }}
      />
    </>
  );
}
