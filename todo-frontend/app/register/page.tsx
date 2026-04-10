"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleRegister = async () => {
    // 🔥 FRONTEND VALIDATION
    if (!form.name || !form.email || !form.password) {
      setError("All required fields must be filled ❗");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters ❗");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/auth/register", {
        ...form,
        age: Number(form.age),
      });

      setLoading(false);
      router.push("/");
    } catch (err: any) {
      setLoading(false);

      // 🔥 SHOW BACKEND ERROR
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account 🚀
        </h1>

        {/* ❌ ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        {/* Email */}
        <input
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        {/* Age */}
        <input
          name="age"
          type="number"
          placeholder="Age"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}