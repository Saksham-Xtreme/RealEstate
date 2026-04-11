import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/owner.css";

const SERVER = import.meta.env.VITE_SERVER_URL;

const STATUS_META = {
  Active: { cls: "ev-ow-status--active" },
  Idle:   { cls: "ev-ow-status--idle"   },
};

const EmployeesTable = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${SERVER}/api/owner/employees-insights`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return (
    <div className="ev-ow-loading">
      <div className="ev-ow-spinner" /><p>Loading employees…</p>
    </div>
  );

  return (
    <div className="ev-ow-page">

      <div className="ev-ow-page-header">
        <div>
          <p className="ev-sec-label">Team</p>
          <h1 className="ev-ow-page-title">Employees</h1>
          <p className="ev-ow-page-sub">{employees.length} team member{employees.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="ev-btn" style={{ width: "auto" }} onClick={() => navigate("/owner/add-employee")}>
          + Add Employee
        </button>
      </div>

      <div className="ev-ow-card" style={{ padding: 0 }}>
        <div className="ev-ow-table-wrap">
          <table className="ev-ow-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Last Login</th>
                <th>Active Time</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan="6" className="ev-ow-table-empty">No employees found</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="ev-ow-user-cell">
                        <div className="ev-ow-avatar">{(emp.name || "E")[0].toUpperCase()}</div>
                        <div>
                          <div className="ev-ow-user-name">{emp.name}</div>
                          <div className="ev-ow-user-email">{emp.email || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.phone || "—"}</td>
                    <td>{emp.lastLogin ? new Date(emp.lastLogin).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Never"}</td>
                    <td>{emp.activeTime || 0}s</td>
                    <td>
                      <span className={`ev-ow-status ${STATUS_META[emp.status]?.cls || "ev-ow-status--idle"}`}>
                        {emp.status || "Offline"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="ev-ow-view-btn"
                        onClick={() => navigate(`/owner/employee/${emp._id}`)}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesTable;