import "./InputBox.css";

const InputBox = ({ state, setStateFunction, onClickFunction, placeholder }) => {
    const handleKeyDown = (event) => {
        // 엔터 키가 눌리면 검색 버튼 클릭 실행
        if (event.key === "Enter") {
            onClickFunction();
        }
    };

    return (
        <div className="InputBox">
            <input
                type="text"
                value={state}
                onChange={(event) => {
                    setStateFunction(event.target.value);
                }}
                placeholder = {placeholder}
                onKeyDown={handleKeyDown}  // 엔터 키 이벤트 처리
            />
            <button
                className="search-btn"
                style={{ backgroundImage: "url('/icons/search-image.svg')" }}
                onClick={onClickFunction}
                onKeyDown={handleKeyDown}  // 버튼에도 엔터 키 이벤트 처리
                tabIndex={0}  // 버튼이 키보드 포커스를 받을 수 있도록 함
            ></button>
        </div>
    );
};

export default InputBox;
