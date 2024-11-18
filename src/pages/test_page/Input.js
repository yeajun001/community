import React, { useState } from "react";

const Input = () => {
    const [txtValue, setTextValue] = useState(""); // 상태는 컴포넌트 최상위에서 선언

    const onChange = (e) => {
        setTextValue(e.target.value); // 입력값을 상태에 저장
    };

    return (
        <div>
            <input type="text" value={txtValue} onChange={onChange} />
            <br />
            <p>{txtValue}</p> {/* 입력된 값 출력 */}
        </div>
    );
};

export default Input;
