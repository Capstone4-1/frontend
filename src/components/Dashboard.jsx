import "./Dashboard.css"

const Dashboard = () => {

    return (
        <div className="Dashboard">
            <div className="Content-Container">
                <div className="MainBoard">
                    <div className="AnannouncementBoard">학과공지사항</div>
                    <div className="TopDividedBoard">
                        <div className="BulletinBoard">자유게시판</div>
                        <div className="LectureBoard">강의게시판</div>
                    </div>
                    <div className="Market">장터</div>
                    <div className="DownDividedBoard">
                        <div className="HottopicBoard">인기게시판</div>
                        <div className="SecretBulletinBoard">익명게시판</div>
                    </div>
                </div>
                <div className="SideBoard">
                    <div className="EmploymentinformationBoard">취창업정보</div>
                </div>
            </div>
        </div>
    )
}


export default Dashboard