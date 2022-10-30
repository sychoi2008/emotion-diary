import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";

import MyHeader from "../Components/MyHeader";
import MyButton from "../Components/MyButton";
import DiaryList from "../Components/DiaryList";

const Home = () => {
  //context를 이용하여 데이터 공급받기
  const diaryList = useContext(DiaryStateContext);
  //월별로 데이터가 다르기 때문에 가공하기
  const [data, setData] = useState([]);
  //날짜를 저장하는 state
  const [curDate, setCurDate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  //curDate가 변화하는 순간에만, diaryList에서 연도와 월에 맞는 데이터를 뽑아 올거임
  //curDate정의한 다음에 쓰기
  useEffect(() => {
    if (diaryList.length >= 1) {
      const firstDay = new Date(
        //0000년 00월 1일의 시간을 구하게 됨
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime(); //그거의 ms를 구함

      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0
      ).getTime();
      //deps에 diaryList가 바뀔때도 useEffect가 움직여야함
      setData(
        diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)
      );
    }
  }, [diaryList, curDate]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  //<버튼이나 >버튼을 누르면 무엇인가를 하나씩 깎아야 함, curDate.getDate()=>오늘이 몇일인지를 보여줌
  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
    );
  };
  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
    );
  };
  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
        rightChild={<MyButton text={">"} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data} />
    </div>
  );
};

export default Home;
