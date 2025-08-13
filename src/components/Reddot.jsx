import "./Reddot.css";

const Reddot = ({ count }) => {
    if (count === 0) return null;

    return (
        <div className="Reddot">
            <div className="content">{count}</div>
        </div>
    );
};

export default Reddot;
