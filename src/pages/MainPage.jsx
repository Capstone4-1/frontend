import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import "./MainPage.css";

const MainPage = () => {

  return (
    <div className="MainPage">
      <div className="Panel-Dashboard-Container">
        <div className="Dashboard-container">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
