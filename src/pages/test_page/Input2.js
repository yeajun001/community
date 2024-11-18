import React, { useState } from "react";

const Input2 = () => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        tel: ""
    });


    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setInputs({
            ...inputs,  // 기존 상태 유지
            [id]: value // 변경된 값 업데이트
        });
    };

    return (
        <div>
            <div>
                <label>이름</label>
                <input
                    type="text"
                    id="name"
                    value={inputs.name} // 상태에서 name 값을 가져옴
                    onChange={onChange}
                />
            </div>
            <div>
                <label>이메일</label>
                <input
                    type="email"
                    id="email"
                    value={inputs.email} // 상태에서 email 값을 가져옴
                    onChange={onChange}
                />
            </div>
            <div>
                <label>전화번호</label>
                <input
                    type="tel"
                    id="tel"
                    value={inputs.tel} // 상태에서 tel 값을 가져옴
                    onChange={onChange}
                />
            </div>
            <br />
            <p>이름: {inputs.name}</p> {/* 입력된 name 출력 */}
            <p>이메일: {inputs.email}</p> {/* 입력된 email 출력 */}
            <p>전화번호: {inputs.tel}</p> {/* 입력된 tel 출력 */}
        </div>
    );
};

export default Input2;
