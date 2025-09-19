import "./MediaBox.css";
import { Play } from "lucide-react";

const MediaBox = ({ videoUrl = "" }) => {
  if (!videoUrl) {
    return <div className="MediaBox">⚠️ 영상 링크가 없습니다.</div>;
  }

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(videoUrl);
  if (!videoId) return <div className="MediaBox">잘못된 유튜브 링크</div>;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="MediaBox"
      style={{ backgroundImage: `url(${thumbnailUrl})` }}
    >
      <div className="MediaBox-overlay">
        <Play size={48} className="MediaBox-playButton" />
      </div>
    </a>
  );
};

export default MediaBox;
