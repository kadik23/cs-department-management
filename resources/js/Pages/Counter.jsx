import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrement, incrementAsync } from "../state/counter/counterSlice";

function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();
    return (
        <div>
            <h1>Test Redux (counter)</h1>
            <h2>{count}</h2>
            <div>
                <button onClick={() => dispatch(incrementAsync(10))}>
                    Increment
                </button>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
            </div>
        </div>
    );
}

export default Counter;
