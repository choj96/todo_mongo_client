import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import List from "../components/List";
import Form from "../components/Form";
import LoadingSpinner from "../components/LoadingSpinner";

// React-bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import { DropdownButton, Dropdown } from "react-bootstrap";
// import Spinner from "react-bootstrap/Spinner";

// 1.로그인 여부 파악
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

// 로컬스토리지에 내용을 읽어온다.
// MongoDB 에서 목록을 읽어온다.
// let initTodo = localStorage.getItem("todoData2");
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
  // MongoDB 에서 초기값 읽어서 셋팅
  // axios 및 useEffect 를 이용한다.
  // const [todoData, setTodoData] = useState(initTodo);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  // 2.로그인 상태 파악
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  // console.log("user", user);
  useEffect(() => {
    // 사용자 로그인 여부 파악
    if (user.accessToken === "") {
      // 로그인이 안된 경우
      alert("로그인을 하셔야 합니다.");
      navigate("/login");
    } else {
      // 로그인이 된 경우
    }
  }, [user]);

  // 목록 정렬 기능
  const [sort, setSort] = useState("최신글");
  useEffect(() => {
    getList();
  }, [sort]);
  // axios 를 이용해서 서버에 API 호출
  // 전체 목록 호출 메서드
  const getList = () => {
    // 로딩창 보여주기
    setLoding(true);

    let body = {
      sort: sort,
    };
    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          setTodoData(response.data.initTodo);
        }
        // 로딩창 숨기기
        setLoding(false);
      })

      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getList();
    // 초기데이터를 컴포넌트가 마운트 될때 한번 실행한다.
  }, []);

  const deleteClick = useCallback(
    (id) => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        let body = {
          id: id,
        };
        axios
          .post("/api/post/delete", body)
          .then((response) => {
            console.log(response);
            const nowTodo = todoData.filter((item) => item.id !== id);
            setTodoData(nowTodo);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // axios 를 이용해서 MongoDB 삭제 진행
      // localStorage.setItem("todoData2", JSON.stringify(nowTodo));
    },
    [todoData]
  );

  const addTodoSubmit = (event) => {
    event.preventDefault();

    // 공백 문자열 제거 추가
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("내용을 입력하세요.");
      setTodoValue("");
      return;
    }

    const addTodo = {
      id: Date.now(),
      title: todoValue,
      completed: false,

      // 1.DB 저장 : Server/Model/TodoModel Schema 업데이트(ObjectId)
      uid: user.uid, // 여러명의 사용자 구분용도
    };
    // axios 로 MongoDB 에 항목 추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(응답.data);
        if (res.data.success) {
          // setTodoData([...todoData, addTodo]);
          setTodoValue("");
          // 로컬에 저장한다.(DB 예정)
          // localStorage.setItem("todoData2", JSON.stringify([...todoData, addTodo]));
          // 목록 재호출
          getList();
          alert("할일이 등록되었습니다");
        } else {
          alert("할일이 등록 실패하였습니다");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAllClick = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // axios 를 이용하여 MongoDB 목록을 비워줌
      axios
        .post("/api/post/deleteall")
        .then(() => {
          setTodoData([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // localStorage.clear();
  };

  // 로딩창 관련
  const [loding, setLoding] = useState(false);
  // const lodingCss = {
  //   position: "fixed",
  //   left: 0,
  //   top: 0,
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100vw",
  //   height: "100vh",
  //   backgroundColor: "rgba(0,0,0,0.5)",
  // };
  const userName = useSelector((state) => state.user.nickName);
  return (
    <div className="flex justify-center w-full ">
      <div className="w-full p-6 m-4 bg-white rounded shadow lg:w-3/4 lg:max-w-5xl">
        <div className="flex justify-between mb-3">
          <h1>할일 목록 {userName}</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>
        {/* 옵션창 */}
        <DropdownButton title={sort} variant="outline-secondary">
          <Dropdown.Item onClick={() => setSort("최신글")}>
            최신글
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSort("과거순")}>
            과거순
          </Dropdown.Item>
        </DropdownButton>

        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
      {/* 로딩샘플 */}
      {loding && <LoadingSpinner />}
    </div>
  );
};

export default Todo;
