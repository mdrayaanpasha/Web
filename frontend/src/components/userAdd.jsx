import React, { useState } from "react";
import axios from "axios";

export default function UserAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      setMessage("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth", {
        Name: name,
        Email: email,
        Phone: phone,
      });

      if (response.status === 200) {
        setMessage("User registered successfully");
        window.location.href="./billing"
      } else {
        setMessage("Error: " + response.data.message);
      }
    } catch (error) {
        
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 border border-black">
        <h2 className="text-xl font-semibold mb-4 text-black">User Authentication</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-md"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-md"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md"
          >
            Register
          </button>
        </form>

        {message && <p className="mt-4 text-center text-black">{message}</p>}
      </div>
    </div>
  );
}
