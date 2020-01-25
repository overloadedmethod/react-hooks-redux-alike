import * as React from "react";
import { render } from "react-dom";

import "./styles.css";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const initialState = { count: 0 };

const INCREMENT = "INCREMENT";
const INCREMENT_DELAY = "INCREMENT_DELAY";
const DECREMENT = "DECREMENT";
const DECREMENT_DELAY = "DECREMENT_DELAY";
const SET = "SET";
const SET_DELAY = "SET_DELAY";

const counterReducer = (state, { type, ...args }) => {
  switch (type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    case SET:
      return { state, ...args };
  }
};

const asyncMiddleware = dispatchSync => async ({ type, ...args }) => {
  switch (type) {
    case INCREMENT_DELAY:
      await sleep(1000);
      dispatchSync({ type: INCREMENT });
      break;
    case DECREMENT_DELAY:
      await sleep(1000);
      dispatchSync({ type: DECREMENT });
      break;
    case SET_DELAY:
      await sleep(1000);
      dispatchSync({ type: SET, ...args });
      break;
    default:
      return dispatchSync({ type, ...args });
  }
};

const CountContext = React.createContext([]);

const CounterProvider = ({ children }) => {
  const [store, syncReducer] = React.useReducer(counterReducer, {
    ...initialState
  });

  return (
    <CountContext.Provider value={[store, asyncMiddleware(syncReducer)]}>
      {children}
    </CountContext.Provider>
  );
};

const Counter = () => {
  const [state, dispatch] = React.useContext(CountContext);
  return (
    <>
      <div className="counter-display">{state.count}</div>
      <ul className="counter-panel">
        <li>
          <button onClick={() => dispatch({ type: INCREMENT })}>+</button>
        </li>
        <li>
          <button onClick={() => dispatch({ type: INCREMENT_DELAY })}>
            async +
          </button>
        </li>
        <li>
          <button onClick={() => dispatch({ type: DECREMENT })}>-</button>
        </li>
        <li>
          <button onClick={() => dispatch({ type: DECREMENT_DELAY })}>
            async -
          </button>
        </li>
        <li>
          <button onClick={() => dispatch({ type: SET_DELAY, count: 0 })}>
            async reset
          </button>
        </li>
      </ul>
    </>
  );
};

const rootElement = document.getElementById("root");
render(
  <CounterProvider>
    <Counter />
    <Counter />
  </CounterProvider>,
  rootElement
);
