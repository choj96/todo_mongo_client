import axios from "axios";
import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData, deleteClick }) => {
  // console.log("ListItem Rendering...", item);

  // 현재 편집 중인지 아닌지를 관리하는 State 생성
  // isEditing false 라면 목록보여줌
  // isEditing true 라면 편집보여줌
  const [isEditing, setIsEditing] = useState(false);
  // 제목을 출력하고 변경하는 State
  // 편집창에는 타이틀이 먼저 작성되 있어야 하므로
  const [editedTitle, setEditedTitle] = useState(item.title);

  // console.log(item);
  // const deleteClick = (id) => {
  //   // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
  //   const nowTodo = todoData.filter((item) => item.id !== id);
  //   // console.log("클릭", nowTodo);
  //   setTodoData(nowTodo);
  // };

  // 편집창 내용 갱신 처리
  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const toggleClick = (id) => {
    // map 을 통해서 this.state.todoData 의 completed 를 업데이트 해보자
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        // if(item.id === id) {
        //   item.completed =false;
        // }else {
        //   item.completed =true;
        // }
        // 할일 목록 값을 변경한다.
        // !의 의미는 반대값으로 변경한다.
        item.completed = !item.completed;
      }
      return item;
    });
    let body = {
      id: todoId,
      completed: item.completed,
    };
    // axios 를 통해 MongoDB complete 업데이트
    // then() : 서버에서 회신(응답)이 없을때 처리
    // catch() :서버에서 응답이없을때
    axios
      .post("/api/post/updatetoggle", body)
      .then((response) => {
        // console.log(response);
        setTodoData(updateTodo);
      })
      .catch((err) => {
        console.log(err);
      });
    // 로컬에 저장(DB 저장)
    // localStorage.setItem("todoData2", JSON.stringify(updateTodo));
  };

  // 현재 item.id 에 해당하는 것만 업데이트한다.
  const todoId = item.id;
  const upDateTitle = () => {
    // 공백 문자열 제거 추가
    let str = editedTitle;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("제목을 입력하세요.");
      setEditedTitle("");
      return;
    }
    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 id 와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정하겠다
        item.title = editedTitle;
      }
      return item;
    });
    // 데이터 갱신
    let body = {
      id: todoId,
      title: editedTitle,
    };
    // axios 를 이용해서 MongoDB 타이틀업데이트
    axios
      .post("/api/post/updatetitle", body)
      .then((response) => {
        setTodoData(tempTodo);
        setIsEditing(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // localStorage.setItem("todoData2", JSON.stringify(tempTodo));
    // 목록창으로 이동
  };
  // 날짜 출력
  // const WEEKDAY = [
  //   "일요일",
  //   "월요일",
  //   "화요일",
  //   "수요일",
  //   "목요일",
  //   "금요일",
  //   "토요일",
  // ];
  const showTime = (_timestamp) => {
    const date = new Date(_timestamp);
    // 시간 오전/오후 표시
    let hours = date.getHours();
    let ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours + 1 < 9 ? "0" + hours : hours;
    // 월 표시
    let months = date.getMonth();
    months = months + 1 < 9 ? "0" + (months + 1) : months + 1;
    // 분 표시
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    // 초 표시
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let time = date.getFullYear();
    time += "/";
    time += months;
    time += "/";
    time += date.getDate();
    // time += "/";
    // time += WEEKDAY[date.getDay()];
    time += " ";
    time += hours;
    time += ":";
    time += minutes;
    time += ":";
    time += seconds;
    time += "  ";
    time += ampm;
    return time;
  };

  if (isEditing) {
    // 편집일 때 JSX리턴
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
        <div className="items-center">
          <input
            type="text"
            className="w-full px-3 py-2 mr-4 text-gray-500 bg-white-100 border rounded"
            value={editedTitle}
            onChange={editChange}
          />
        </div>
        <div className="items-center">
          <button className="px-4 py-2" onClick={upDateTitle}>
            Update
          </button>
          <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
            Close
          </button>
        </div>
      </div>
    );
  } else {
    // 목록일 때 JSX리턴
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
        <div className="items-center">
          <input
            type="checkbox"
            defaultChecked={item.completed}
            onChange={() => toggleClick(item.id)}
          />{" "}
          <span className={item.completed ? "line-through" : "none"}>
            {item.title}
          </span>
        </div>
        <div className="items-center">
          <span>{showTime(item.id)}</span>
          <button
            className="px-4 py-2"
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(item.title);
            }}
          >
            Edit
          </button>
          <button className="px-4 py-2" onClick={() => deleteClick(item.id)}>
            x
          </button>
        </div>
      </div>
    );
  }
});

export default ListItem;
