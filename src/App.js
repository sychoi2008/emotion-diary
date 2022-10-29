import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useReducer, useRef } from "react";

//다른 페이지들을 import해준다
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      //newState라는 변수에다가 새로운 state로 바뀔 값을 전달
      newState = [action.data, ...state];
      //break를 하지 않으면 default도 실행되어 버림(return값이 없으므로)
      break;
    }
    case "REMOVE": {
      //filtering을 통해, targetId가 아닌 녀석들만 newState에 업데이트
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      //content뿐만 아니라 전체를 다 바꿀 수 있게 한다.
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  return newState;
};

//context를 만들어 datastate를 컴포넌트 전역에 전달 : data를 전달
export const DiaryStateContext = React.createContext();
//onCreate, onRemove, onEdit함수도 context로 전달
export const DiaryDispatchContext = React.createContextContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);
  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  };
  //REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };
  //EDIT
  //일기의 모든 부분을 수정해야 하므로 다 인자로 받아야 한다.
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };
  return (
    <DiaryStateContext.Provider value={data}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/diary/:id" element={<Diary />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DiaryStateContext.Provider>
  );
}

export default App;
