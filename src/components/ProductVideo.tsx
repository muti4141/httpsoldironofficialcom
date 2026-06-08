import { useEffect, useRef, useState } from "react";

type ProductVideoProps = {
  src: string;
  poster?: string;
  alt: string;
  loop?: boolean;
  className?: string;
};

export function ProductVideo({ src, poster, alt, loop = false, className = "" }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isVisible = false;
    const playIfVisible = () => {
      if (!isVisible || document.hidden || ended) return;
      if (!shouldLoad) {
        setShouldLoad(true);
        return;
      }
      video.play().catch(() => {
        // Autoplay can be blocked while the browser is busy; poster remains visible.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          playIfVisible();
        } else {
          video.pause();
        }
      },
      { threshold: 0.35, rootMargin: "120px" },
    );

    const handleVisibility = () => {
      if (document.hidden) video.pause();
      else playIfVisible();
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      video.pause();
    };
  }, [ended, shouldLoad, src]);

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
        src={shouldLoad ? src : undefined}
        poster={poster}
        muted
        playsInline
        loop={loop}
        preload="metadata"
        onPlay={() => {
          if (!videoRef.current?.ended) setEnded(false);
        }}
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