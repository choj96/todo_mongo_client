import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";

const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  const user = useSelector((state) => state.user);
  // console.log("List user", user.uid);
  return (
    <div>
      {todoData.map(
        (item) =>
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </div>
  );
});

export default List;
