import { useState } from "react";
import "./RolesBox.css";
import axiosInstance from "../utils/AxiosInstance";
import { ROLE_OPTIONS } from "../utils/RoleUtils";

const RolesBox = () => {
  const [filters, setFilters] = useState({ username: "", name: "", role: "" });
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get("/admin/search-users", {
        params: {
          username: filters.username || null,
          name: filters.name || null,
          role: filters.role || null,
        },
      });
      setUsers(res.data);
      setSearched(true);
    } catch (err) {
      console.error("❌ 유저 불러오기 실패:", err);
      alert("유저 검색 실패");
    }
  };

  const handleGrantRole = async (userId) => {
    try {
      await axiosInstance.post("/admin/grant-role", null, {
        params: {
          userId,
          role: selectedRole,
        },
      });
      alert("권한 부여 완료");
      handleSearch();
    } catch (err) {
      console.error("❌ 권한 부여 실패:", err);
      alert("권한 부여 실패");
    }
  };

  const handleRevokeRole = async (userId) => {
    try {
      await axiosInstance.delete("/admin/revoke-role", {
        params: {
          userId,
          role: selectedRole,
        },
      });
      alert("권한 회수 완료");
      handleSearch();
    } catch (err) {
      console.error("❌ 권한 회수 실패:", err);
      alert("권한 회수 실패");
    }
  };

  return (
    <div className="RolesBox">
      <h2>유저 권한 관리</h2>

      <form
        className="filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          placeholder="아이디"
          value={filters.username}
          onChange={(e) =>
            setFilters({ ...filters, username: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="이름"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">전체 권한</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <button type="submit">검색</button>
      </form>

      <div className="role-control">
        <label>변경할 권한 선택: </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {searched && users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>userId</th>
              <th>아이디</th>
              <th>이름</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>현재 권한</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.name}</td>
                <td>{u.nickname}</td>
                <td>{u.email}</td>
                <td>{u.roles?.join(", ")}</td>
                <td>
                  <button onClick={() => handleGrantRole(u.id)}>부여</button>
                  <button onClick={() => handleRevokeRole(u.id)}>회수</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {searched && users.length === 0 && <p>검색 결과 없음</p>}
    </div>
  );
};

export default RolesBox;
