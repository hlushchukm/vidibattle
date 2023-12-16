import { useRef } from "react";
import { formatFileSize } from "../../../services/file";

interface PostPreviewProps {
  caption: string;
  type: "video" | "image";
  file: File | null;
  thumbnail?: File | null;
  deleteFiles: () => void;
  onVideoLengthChanged: (duration: number) => void;
}
export default function PostPreview({
  caption,
  type,
  file,
  thumbnail,
  deleteFiles,
  onVideoLengthChanged,
}: PostPreviewProps) {
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const handleLoadedMetadata = () => {
    onVideoLengthChanged(videoPreviewRef.current?.duration ?? 0);
  };

  return (
    <div className="container">
      <div className="col-12">
        <div className="card card-full">
          <div className="card-header">
            <h5 className="card-title">Preview</h5>
          </div>
          <div className="card-body">
            <p className="card-text">
              {caption.length === 0 ? (
                <span className="text-muted">No Caption</span>
              ) : (
                caption
              )}
            </p>
            <div className="divider divider-dotted"></div>
            <p>File Size: {formatFileSize(file?.size as number)}</p>
            {type === "video" && thumbnail && (
              <p>Thumbnail Size: {formatFileSize(thumbnail?.size as number)}</p>
            )}
            <div className="position-relative ">
              {type === "image" && file && (
                <img
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    height: "auto",
                    maxHeight: "500px",
                    objectFit: "scale-down",
                  }}
                  src={URL.createObjectURL(file)}
                  alt="No image found"
                />
              )}
              {type === "video" && (
                <video
                  id="videoPreview"
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    height: "auto",
                    maxHeight: "500px",
                  }}
                  poster={thumbnail ? URL.createObjectURL(thumbnail) : ""}
                  controls
                  src={URL.createObjectURL(file as File)}
                  ref={videoPreviewRef}
                  onLoadedMetadata={handleLoadedMetadata}
                ></video>
              )}
              <div className="position-absolute top-0 p-3">
                <button onClick={deleteFiles} className="btn btn-danger">
                  <i className="fa-solid fa-xmark me-2"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
