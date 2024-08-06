import { useState, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  poster: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDoubleClick = async () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ((video as any).mozRequestFullScreen) {
        await (video as any).mozRequestFullScreen();
      } else if ((video as any).webkitRequestFullscreen) {
        await (video as any).webkitRequestFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        await (video as any).msRequestFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  const handlePlayClick = async () => {
    const video = videoRef.current;
    if (video && !isLoading) {
      setIsLoading(true);
      await video.play();
      setIsPlaying(true);
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        await video.pause();
        setIsPlaying(false);
      } else {
        handlePlayClick();
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div
      className="video-container"
      onDoubleClick={handleDoubleClick}
    >
      <video
        onClick={togglePlay}
        className="video-player"
        ref={videoRef}
        poster={poster}
        onLoadedData={handleLoadedData}
        preload="none"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="button-container">
        {isLoading && <div className="loader"></div>}
        {!isLoading && (
          isPlaying ? (
            <i style={{cursor:'pointer', color:"#ffffff"}} className="fa fa-pause bell-icon" onClick={togglePlay}></i>            
          ) : (
            <i style={{cursor:'pointer', color:"#ffffff"}} className="fa fa-play bell-icon" onClick={handlePlayClick}></i>
          )
        )}
      </div>
    </div>
  );
}
