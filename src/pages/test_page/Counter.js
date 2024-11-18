import React, { useState } from "react";

const Counter = () => {
    const [num, setNumber] = useState(0);

    const Increase = () => {
        setNumber(num + 1);
    }
    const Decrease = () => {
        setNumber(num - 1);
    }
    return (
        <div>
            <button onClick={Increase}>+1</button>
            <button onClick={Decrease}>-1</button>
            <p>{num}</p>
        </div>
    )
}

export default Counter;