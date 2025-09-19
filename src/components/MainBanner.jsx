// MainBanner.jsx
import "./MainBanner.css";

const MainBanner = ({
  title = "학생회 이벤트",
  description = "내용이 없습니다.",
  image = "/images/emblem.jpg",
  link = null,
}) => {
  return (
    <div className="MainBanner">
      {/* 썸네일 영역 */}
      <div className="thumbnail">
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 설명 영역 */}
      <div className="descript">
        <h2 className="banner-title">{title}</h2>
        <p
          className="banner-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {link && (
          <div className="banner-link">
            <a href={link} target="_blank" rel="noopener noreferrer">
              자세히 보기 →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainBanner;
