import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

const App = () => {
  const [todo, setTodo] = useState("");

  const [isEditing, setisEditing] = useState(false);
  const [editingIndex, seteditingIndex] = useState(null);

  const [filter, setFilter] = useState("all");

  //load todos from localstorage on first render
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem("todos"));
      if (Array.isArray(savedTodos)) {
        return savedTodos;
      }
    } catch (error) {
      console.log("Error reading todos from localStaroge", error);
    }
    return [];
  });

  //save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (todo.trim() === "") return;

    if (isEditing) {
      const updatedtodos = [...todos];
      updatedtodos[editingIndex].todo = todo;
      setTodos(updatedtodos);
      setisEditing(false);
      seteditingIndex(null);
    } else {
      setTodos([...todos, { todo, isCompleted: false }]);
    }

    setTodo("");
  };

  const handleEdit = (index) => {
    setisEditing(true);
    seteditingIndex(index);
    setTodo(todos[index].todo);
  };

  const handleDelete = (index) => {
    const newtodos = todos.filter((item, i) => i !== index);
    setTodos(newtodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  const handleToggle = (index) => {
    setTodos((prevTodos) =>
      prevTodos.map((item, i) =>
        i === index ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const filteredTodos = todos.filter((item) => {
    if (filter === "active") return !item.isCompleted;
    if (filter === "completed") return item.isCompleted;
    return true; // for all
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-violet-200 to-indigo-200 flex justify-center items-start py-10">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
          {/* HEADER */}
          <h1 className="text-2xl font-bold text-center text-violet-800 mb-6">
            ✅ My Todo App
          </h1>

          {/* ADD TODO */}
          <div className="flex gap-3 mb-6">
            <input
              onChange={handleChange}
              value={todo}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
              type="text"
              placeholder="Add a new todo..."
            />
            <button
              onClick={handleAdd}
              className="bg-violet-800 hover:bg-violet-900 text-white px-5 py-2 rounded-md font-semibold"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex justify-center gap-3 mb-6">
            {["all", "active", "completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  filter === type
                    ? "bg-violet-800 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* TODO LIST */}
          <div className="space-y-3">
            {filteredTodos.length === 0 && (
              <p className="text-center text-gray-500">No todos to show</p>
            )}

            {filteredTodos.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleToggle(index)}
                    className="w-4 h-4 accent-violet-700"
                  />

                  <span
                    className={`text-sm ${
                      item.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {item.todo}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
