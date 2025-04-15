import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    mobile: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch students on page load
  useEffect(() => {
    axios.get("http://localhost:8080/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Form input change handler
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Add or Update student
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      axios.put(`http://localhost:8080/api/students/${editingId}`, formData)
        .then(res => {
          setStudents(students.map(s => (s.id === editingId ? res.data : s)));
          resetForm();
        })
        .catch(err => console.error(err));
    } else {
      // Add
      axios.post("http://localhost:8080/api/students", formData)
        .then(res => {
          setStudents([...students, res.data]);
          resetForm();
        })
        .catch(err => console.error(err));
    }
  };

  // Edit button - load data into form
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      mobile: student.mobile
    });
    setEditingId(student.id);
  };

  // Delete student
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/students/${id}`)
      .then(() => {
        setStudents(students.filter(s => s.id !== id));
      })
      .catch(err => console.error(err));
  };

  const resetForm = () => {
    setFormData({ name: '', rollNumber: '', email: '', mobile: '' });
    setEditingId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student CRUD App</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="rollNumber"
              className="form-control"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="mobile"
              className="form-control"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mt-3 text-end">
          <button type="submit" className="btn btn-primary me-2">
            {editingId ? "Update" : "Add"} Student
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Student Table */}
      <h4>Student List</h4>
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.email}</td>
                <td>{student.mobile}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No students available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
