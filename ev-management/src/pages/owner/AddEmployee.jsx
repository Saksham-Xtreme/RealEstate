import React, { useState } from "react";
import axios from "axios";

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const BASE_URL = import.meta.env.VITE_SERVER_URL;
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/api/owner/add-employee`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee added successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
      });

    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Add Employee</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border max-w-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;