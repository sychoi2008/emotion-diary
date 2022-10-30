import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";
import MyButton from "./MyButton";

const sortOptionList = [
  { value: "latest", name: "최신순" },
  { value: "oldest", name: "오래된 순" },
];

const filterOptionList = [
  { value: "all", name: "전부 다" },
  { value: "good", name: "좋은 감정만" },
  { value: "bad", name: "안좋은 감정만" },
];

//정렬할 컴포넌트 분할해서 만들기

//컨트롤메뉴의 역할은 sortType을 변화시키는 select 역할을 수행
const ControlMenu = ({ value, onChange, optionList }) => {
  //value 프롭 => select가 어떤 것을 선택했는지,
  //onChange => select가 선택한 것이 변화했을 때, 바꿀 기능
  //optionList => select태그에 들어갈 옵션 기능
  //select에서는 {}안에서의 값이 props임
  return (
    <select
      className="ControlMenu"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </select>
  );
};

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();
  //정렬기준을 저장할 state 생성. 초기값 : 최신순이라는 latest
  const [sortType, setSortType] = useState("latest");
  //감정 필터의 현재 상태를 저장할 state(select에서!!)
  const [filter, setFilter] = useState("all");

  //정렬기준에 따라 일기 데이터들이 다시 정렬되어야 함
  //getProcessedDiaryList란 함수는 compare함수를 통해 최신순인지, 오래된 순인지를
  //다뤄가지고 정렬된 리스트를 반환하는 함수가 된다.
  const getProcessedDiaryList = () => {
    //좋은 감정과 안좋은 감정 판별 함수
    const filterCallBack = (item) => {
      if (filter === "good") {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    };

    //오래된 순, 최신순 판별 함수
    const compare = (a, b) => {
      if (sortType === "latest") {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    //diaryList란 배열을 JSON화(문자화) 시켜서 문자열로 바꿔서 반환.
    //parse를 통해 다시 배열이 됨
    const copyList = JSON.parse(JSON.stringify(diaryList));

    //좋은 감정과 안좋은 감정 판별
    //filterCallback에 it을 전달했을 때, return true를 반환하게 하는 아이들로만 필터링을 해라라고 지시
    const filterdList =
      filter === "all" ? copyList : copyList.filter((it) => filterCallBack(it));

    //최신순인지 오래된 순인지 sort로 정렬
    const sortedList = filterdList.sort(compare);
    return sortedList;
  };

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />
          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={filterOptionList}
          />
        </div>

        <div className="right_col">
          <MyButton
            type={"positive"}
            text={"새 일기 쓰기"}
            onClick={() => navigate("/new")}
          />
        </div>
      </div>

      {getProcessedDiaryList().map((it) => (
        <DiaryItem key={it.id} {...it} />
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: [],
};
export default DiaryList;
