import React, { useState } from "react";
import axios from "axios";
import Nav from "./Nav";

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
      const response = await axios.post("https://royalco-api.onrender.com/api/auth", {
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
    <>
    <Nav></Nav>
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
      <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center fixed bottom-5 right-5 hover:cursor-pointer" onClick={e=>window.location.href="./"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2d2d2d">
                    <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
                </svg>
            </div>
    </div>
    </>
  );
}
