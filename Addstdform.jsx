"use client";

import { useState, useEffect } from "react";

const Addstdform = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    userName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch all students on component mount
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3001/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        setMessage("Failed to fetch students");
      }
    } catch (error) {
      setMessage(`Failed to fetch students: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedStudent
        ? `http://localhost:3002/students/${selectedStudent.id}`
        : "http://localhost:3002/students";
      const method = selectedStudent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(selectedStudent ? "Student updated successfully" : "Student added successfully");
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          userName: "",
          email: "",
          password: "",
        });
        setSelectedStudent(null);
        await fetchStudents(); // Refresh the student list
      } else {
        setMessage("Failed to submit data");
      }
    } catch (error) {
      setMessage(`Failed to submit data: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      phoneNumber: student.phoneNumber,
      userName: student.userName,
      email: student.email,
      password: "", // Keep password empty for security
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">{selectedStudent ? "Edit Student" : "Add Student"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
            User Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            onChange={handleInputChange}
            required={!selectedStudent} 
          />
        </div>

        <div className="mb-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600">
            {selectedStudent ? "Update Student" : "Register"}
          </button>
        </div>
      </form>
      {message && <div className="mt-4 text-center text-red-400">{message}</div>}

      {/* List of students */}
      <div className="mt-8">
        <h3 className="text-xl mb-4">Student List</h3>
        <ul>
          {students.map((student) => (
            <li key={student.id} className="mb-2">
              {student.firstName} {student.lastName} - {student.email}
              <button
                onClick={() => handleEdit(student)}
                className="ml-4 text-blue-500 underline"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Addstdform;
