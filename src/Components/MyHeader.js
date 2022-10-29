const MyHeader = ({ headText, leftChild, rightChild }) => {
  //leftChild로 <MyButton>컴포넌트를 전달 받았음
  return (
    <header>
      <div className="head_btn_left">{leftChild}</div>
      <div className="head_text">{headText}</div>
      <div className="head_btn_right">{rightChild}</div>
    </header>
  );
};

export default MyHeader;
