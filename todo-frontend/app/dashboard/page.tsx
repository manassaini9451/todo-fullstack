"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [todos, setTodos] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/");
    }
  }, []);

  const getTodos = async () => {
    const res = await axios.get("http://localhost:5000/todo");
    setTodos(res.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE / UPDATE
  const handleSubmit = async () => {
    if (!form.title) return alert("Title is required");

    if (editId) {
      await axios.patch(`http://localhost:5000/todo/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/todo", form);
    }

    setForm({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
    });

    getTodos();
  };

  // DELETE
  const deleteTodo = async (id: string) => {
    await axios.delete(`http://localhost:5000/todo/${id}`);
    getTodos();
  };

  // EDIT
  const editTodo = (todo: any) => {
    setForm({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority || "low",
      dueDate: todo.dueDate?.slice(0, 10) || "",
    });
    setEditId(todo._id);
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (todo: any) => {
    await axios.patch(`http://localhost:5000/todo/${todo._id}`, {
      completed: !todo.completed,
    });
    getTodos();
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo Dashboard 🚀</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="border p-3 rounded-lg"
            />

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-3 rounded-lg"
            />

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold"
          >
            {editId ? "Update Todo" : "Add Todo"}
          </button>
        </div>

        {/* LIST */}
        <div className="grid gap-4">
          {todos.map((t) => (
            <div
              key={t._id}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p className="text-gray-500 text-sm">{t.description}</p>

                <div className="text-sm mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-200 rounded">
                    {t.priority}
                  </span>

                  {t.dueDate && (
                    <span className="px-2 py-1 bg-blue-100 rounded">
                      {t.dueDate.slice(0, 10)}
                    </span>
                  )}

                  <span
                    className={`px-2 py-1 rounded ${
                      t.completed ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    {t.completed ? "Done" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => toggleComplete(t)}
                  className="text-green-600"
                >
                  ✔
                </button>

                <button
                  onClick={() => editTodo(t)}
                  className="text-yellow-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTodo(t._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}