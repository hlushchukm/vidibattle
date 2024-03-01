import { useState, useRef, useEffect } from "react";
import CreatePostHeader from "./components/CreatePostHeader";
import { get, upload } from "../../services/crud";
import { useNavigate } from "react-router-dom";
import { getUser, getUserId } from "../../services/auth";
import { ProgressBarStriped } from "../../components/ProgressBar";
import PostPreview from "./components/PostPreview";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../services/asset-paths";
import { toast } from "react-toastify";
import PageLoading from "../../components/PageLoading";
import {
  validateImageSize,
  validateVideoLength,
  validateVideoSize,
} from "../../services/validateFile";

export default function CreatePost({
  allowedTypes = "any",
  competitionId = null,
  round = null,
}: {
  allowedTypes?: "image" | "video" | "any";
  competitionId?: string | null;
  round?: number | null;
}) {
  const [postBtnDisabled, setPostBtnDisabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [caption, setCaption] = useState("");
  const [fileType, setFileType] = useState<"video" | "image">("image");
  const photoInputRef = useRef<any>(null);
  const videoInputRef = useRef<any>(null);
  const thumbnailInputRef = useRef<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState<any>({});
  const [videoLength, setVideoLength] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (competitionId) getConfigurationData();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      validateMedia();
    } else {
      setPostBtnDisabled(true);
      setErrorMessage("");
    }
  }, [selectedFile]);

  useEffect(() => {
    validateMedia();
  }, [videoLength]);

  useEffect(() => {
    if (thumbnail) {
      validateMedia();
    }
  }, [thumbnail]);

  const getConfigurationData = () => {
    setLoading(true);
    get("configuration", {
      keys: [
        "max_image_upload_size",
        "max_video_upload_size",
        "max_video_duration",
      ],
    })
      .then((res) => {
        if (res.data?.length > 0) {
          const data: any = {};
          for (const entry of res.data) {
            data[entry.key] = entry;
          }
          setConfigData(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const openPhotoDialog = () => {
    photoInputRef.current.value = null;
    videoInputRef.current.value = null;
    setFileType("image");
    if (photoInputRef.current) photoInputRef.current.click();
  };

  const openVideoDialog = () => {
    photoInputRef.current.value = null;
    videoInputRef.current.value = null;
    thumbnailInputRef.current.value = null;
    setFileType("video");
    if (videoInputRef.current) videoInputRef.current.click();
  };

  const openThumbnailDialog = () => {
    if (thumbnailInputRef.current) thumbnailInputRef.current.click();
  };

  const handlePhotoChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setThumbnail(null);
  };

  const handleVideoChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setThumbnail(null);
  };

  const handleThumbnailChange = (event: any) => {
    setThumbnail(event.target.files[0]);
  };

  const handleCaptionChange = (e: any) => {
    setCaption(e.target.value);
  };

  const handleUpload = () => {
    if (selectedFile && validateMedia()) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("author", getUserId() ?? "");
      formData.append("caption", caption);
      formData.append("type", fileType);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (competitionId) formData.append("competition", competitionId);
      if (round !== null) formData.append("round", round.toString());

      setUploading(true);

      upload("post", formData, onUploadProgress)
        .then((_) => {
          setUploading(false);
          toast.success("post uploaded successfully");
          competitionId ? navigate(-1) : navigate("/home");
        })
        .catch((error) => {
          setUploading(false);
          toast.error(error.response?.data?.message ?? "Error uploading file");
          console.error("Error uploading file:", error);
        });
    } else {
      toast.info("Unable to upload post!");
    }
  };

  const onUploadProgress = (event: any) => {
    setUploadProgress(Math.round(100 * event.loaded) / event.total);
  };

  const clearFileSelections = () => {
    setSelectedFile(null);
    setThumbnail(null);
  };

  const validateMedia = () => {
    let valid = false;
    let errorType:
      | "video_size"
      | "video_duration"
      | "image"
      | "thumbnail"
      | null = null;

    if (selectedFile) {
      if (fileType === "video") {
        valid = validateVideoSize(
          selectedFile,
          configData["max_video_upload_size"]
        );

        errorType = !valid ? "video_size" : null;

        if (valid && videoLength) {
          valid = validateVideoLength(
            videoLength,
            configData["max_video_duration"]
          );

          errorType = !valid ? "video_duration" : null;
        }

        if (thumbnail && valid) {
          valid = validateImageSize(
            thumbnail,
            configData["max_image_upload_size"]
          );
          errorType = !valid ? "thumbnail" : null;
        }
      } else {
        valid = validateImageSize(
          selectedFile,
          configData["max_image_upload_size"]
        );
        errorType = !valid ? "image" : null;
      }
    } else {
      valid = false;
    }

    setPostBtnDisabled(!valid);

    setErrorMessage(valid ? "" : getErrorMessage(errorType));

    return valid;
  };

  const getErrorMessage = (
    errorType: "video_size" | "video_duration" | "image" | "thumbnail" | null
  ) => {
    if (!errorType) {
      return "";
    }

    switch (errorType) {
      case "image":
        return `Maximum image size allowed is ${configData["max_image_upload_size"].value}${configData["max_image_upload_size"].unit}`;
      case "thumbnail":
        return `Maximum thumbnail size allowed is ${configData["max_image_upload_size"].value}${configData["max_image_upload_size"].unit}`;
      case "video_size":
        return `Maximum video size allowed is ${configData["max_video_upload_size"].value}${configData["max_video_upload_size"].unit}`;
      case "video_duration":
        return `Maximum video duration allowed is ${configData["max_video_duration"].value}${configData["max_video_duration"].unit}`;
      default:
        return "unknown error";
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <CreatePostHeader
        disabled={postBtnDisabled || uploading}
        uploadPost={handleUpload}
      />

      {uploading && (
        <div className="container">
          {uploadProgress < 100 ? (
            <ProgressBarStriped value={uploadProgress} />
          ) : (
            <>
              <div className="d-flex align-items-center gap-2 ms-3">
                <div
                  className="spinner-border spinner-md me-2 mb-2 text-info"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
                <div className="text-info h6">Processing Post ...</div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="page-content">
        <div className="container">
          <div className="post-profile">
            {postBtnDisabled && (
              <div className="p-3">
                <h1 className="text-danger small fw-bold mt-1">
                  {errorMessage}
                </h1>
              </div>
            )}
            <div className="left-content">
              <div className="media media-50 rounded-circle">
                <img
                  src={formatResourceURL(getUser().profile_img)}
                  onError={handleProfileImageError}
                  alt="/"
                />
              </div>
              <div className="ms-2">
                <h6 className="mb-1">
                  {getUser()?.first_name + " " + getUser()?.last_name}
                </h6>
                {/* <ul className="meta-list">
                  <li className="me-2">
                    <a
                      href="javascript:void(0);"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasEnd1"
                      aria-controls="offcanvasEnd1"
                    >
                      <svg
                        className="me-1"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.2124 7.76241C14.2124 10.4062 12.0489 12.5248 9.34933 12.5248C6.6507 12.5248 4.48631 10.4062 4.48631 7.76241C4.48631 5.11865 6.6507 3 9.34933 3C12.0489 3 14.2124 5.11865 14.2124 7.76241ZM2 17.9174C2 15.47 5.38553 14.8577 9.34933 14.8577C13.3347 14.8577 16.6987 15.4911 16.6987 17.9404C16.6987 20.3877 13.3131 21 9.34933 21C5.364 21 2 20.3666 2 17.9174ZM16.1734 7.84875C16.1734 9.19506 15.7605 10.4513 15.0364 11.4948C14.9611 11.6021 15.0276 11.7468 15.1587 11.7698C15.3407 11.7995 15.5276 11.8177 15.7184 11.8216C17.6167 11.8704 19.3202 10.6736 19.7908 8.87118C20.4885 6.19676 18.4415 3.79543 15.8339 3.79543C15.5511 3.79543 15.2801 3.82418 15.0159 3.87688C14.9797 3.88454 14.9405 3.90179 14.921 3.93246C14.8955 3.97174 14.9141 4.02253 14.9396 4.05607C15.7233 5.13216 16.1734 6.44206 16.1734 7.84875ZM19.3173 13.7023C20.5932 13.9466 21.4317 14.444 21.7791 15.1694C22.0736 15.7635 22.0736 16.4534 21.7791 17.0475C21.2478 18.1705 19.5335 18.5318 18.8672 18.6247C18.7292 18.6439 18.6186 18.5289 18.6333 18.3928C18.9738 15.2805 16.2664 13.8048 15.5658 13.4656C15.5364 13.4493 15.5296 13.4263 15.5325 13.411C15.5345 13.4014 15.5472 13.3861 15.5697 13.3832C17.0854 13.3545 18.7155 13.5586 19.3173 13.7023Z"
                          fill="#130F26"
                        />
                      </svg>
                      Friends
                      <i className="fa-solid fa-angle-down ms-2"></i>
                    </a>
                  </li>
                  <li className="me-2">
                    <a href="javascript:void(0);">
                      <i className="fa-solid fa-plus me-1"></i>
                      Album
                      <i className="fa-solid fa-angle-down ms-2"></i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <i className="fa-brands fa-instagram me-1"></i>
                      Off
                      <i className="fa-solid fa-angle-down ms-2"></i>
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
          <div className="post-content-area">
            <textarea
              className="form-control"
              placeholder="What's on your mind?"
              value={caption}
              onChange={handleCaptionChange}
              style={{ height: "200px" }}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Display Post Preview */}
      {selectedFile && (
        <PostPreview
          caption={caption}
          type={fileType}
          file={selectedFile}
          thumbnail={thumbnail}
          deleteFiles={clearFileSelections}
          onVideoLengthChanged={setVideoLength}
        />
      )}

      <footer className="footer border-0">
        <div className="container">
          <ul className="element-list">
            {(!selectedFile || fileType === "image") &&
              (allowedTypes === "any" || allowedTypes === "image") && (
                <>
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={openPhotoDialog}>
                      <i className="fa-solid fa-file-image"></i>Photo
                    </a>
                  </li>
                </>
              )}
            {(allowedTypes === "any" || allowedTypes === "video") && (
              <>
                {(!selectedFile || fileType === "video") && (
                  <>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={openVideoDialog}>
                        <i className="fa-solid fa-video"></i>Video
                      </a>
                    </li>
                  </>
                )}
                {selectedFile && fileType === "video" && (
                  <>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={openThumbnailDialog}>
                        <i className="fa-solid fa-file-image"></i>Thumbnail
                        (optional)
                      </a>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </footer>

      {/* Hidden Input Elements */}
      <input
        type="file"
        accept="image/*"
        ref={photoInputRef}
        onChange={handlePhotoChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="image/*"
        ref={thumbnailInputRef}
        onChange={handleThumbnailChange}
        style={{ display: "none" }}
      />
    </>
  );
}
