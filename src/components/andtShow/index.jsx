import { Button, Input } from "antd";
import React, { useEffect, useReducer, useState } from "react";

function ShowAntd() {
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const noName = (state, { type, list, index }) => {
    switch (type) {
      case "Init":
        return { ...state, intational: list };
      case "Add":
        if (!list.trim()) return state;
        const setLocal = [...state.intational, list];
        localStorage.setItem("task", JSON.stringify(setLocal));
        return { ...state, intational: setLocal };
      case "Update":
        const updatedTasks = [...state.intational];
        updatedTasks[index] = list;
        localStorage.setItem("task", JSON.stringify(updatedTasks));
        return { ...state, intational: updatedTasks };
      case "Delete":
        const filteredTasks = state.intational.filter((_, i) => i !== index);
        localStorage.setItem("task", JSON.stringify(filteredTasks));
        return { ...state, intational: filteredTasks };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(noName, { intational: [] });

  useEffect(() => {
    const getDataValue = JSON.parse(localStorage.getItem("task")) || [];
    if (Array.isArray(getDataValue)) {
      dispatch({ type: "Init", list: getDataValue.filter(Boolean) });
    }
  }, []);

  const handleUpdate = (index) => {
    setEditIndex(index);
    setEditedValue(state.intational[index]);
  };

  const handleSave = () => {
    if (editedValue.trim()) {
      dispatch({ type: "Update", list: editedValue.trim(), index: editIndex });
      setEditedValue("");
      setEditIndex(null);
    }
  };

  const filteredTasks = state.intational.filter((task) =>
    task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[50%] mt-5 my-0 mx-auto">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[100%] mb-5"
        placeholder="Search tasks"
      />

      <form className="flex gap-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-[100%]"
          placeholder="Add to task"
        />
        <Button
          onClick={() => {
            if (inputValue.trim() !== "") {
              dispatch({ type: "Add", list: inputValue.trim() });
              setInputValue("");
            }
          }}
          className="w-[15%]"
          type="primary"
        >
          Add
        </Button>
      </form>

      {editIndex !== null && (
        <div className="mt-5">
          <Input
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder="Edit task"
          />
          <Button onClick={handleSave} className="ml-2" type="primary">
            Save
          </Button>
        </div>
      )}

      <div className="w-[100%] h-auto mt-5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((value, index) => (
            <div
              key={index}
              className="h-[40px] rounded-lg border-[1px] border-[rgb(169,169,169)] flex items-center p-2 justify-between"
            >
              <h4>{value}</h4>
              <div className="flex items-center gap-2">
                <Button
                  className="w-[60px]"
                  style={{ borderColor: "#228B22", color: "#228B22" }}
                  onClick={() => handleUpdate(index)}
                >
                  Edit
                </Button>
                <Button
                  className="w-[60px]"
                  danger
                  onClick={() => dispatch({ type: "Delete", index })}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Hozircha hech qanday vazifa yo'q yoki qidiruv bo'yicha mos keladigan
            vazifalar yo'q.
          </p>
        )}
      </div>
    </div>
  );
}

export default ShowAntd;
