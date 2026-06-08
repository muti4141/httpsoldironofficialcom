import { useRef, useState } from "react";

type ProductVideoProps = {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
};

export function ProductVideo({ src, poster, alt, className = "" }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  const holdOnStartScene = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    try {
      video.currentTime = 0.15;
    } catch {
      // Some browsers can reject seeking immediately after ended.
    }
    if (poster) setEnded(true);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlay={() => setEnded(false)}
        onEnded={holdOnStartScene}
        className={`${className} ${poster && ended ? "opacity-0" : "opacity-100"}`}
      />
      {poster && ended && (
        <img
          src={poster}
          alt={alt}
          loading="eager"
          className={`absolute inset-0 ${className}`}
        />
      )}
    </div>
  );
}