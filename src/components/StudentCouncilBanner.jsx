import "./StudentCouncilBanner.css";

const StudentCouncilBanner = ({
  title = "학생회 이벤트",
  description = "내용이 없습니다.",
  image = "/images/emblem.jpg",
  link = null
}) => {
  const content = (
    <div className="banner-content">
      <h2 className="banner-title">{title}</h2>
      <p className="banner-description" dangerouslySetInnerHTML={{ __html: description }} />

      {/* 링크가 있으면 하단에 표시 */}
      {link && (
        <div className="banner-link">
          <a href={link} target="_blank" rel="noopener noreferrer">
            자세히 보기 →
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="student-council-banner">
      <div className="banner-poster">
        <img src={image || "/images/emblem.jpg"} alt={title} />
      </div>

      {link ? (
        <div
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", flex: 1 }}
        >
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default StudentCouncilBanner;
