// src/components/RolesBox.jsx
import { useState } from "react";
import "./RolesBox.css";
import axiosInstance from "../utils/AxiosInstance";
import { ROLE_DEFS } from "../utils/RoleUtils";
import { toast } from "sonner";
import RoleTag from "../RoleTag";

// ROLE_DEFS 기반으로 ROLE_OPTIONS 생성
const ROLE_OPTIONS = ROLE_DEFS.map((r) => ({ label: r.title, value: r.value }));

const RolesBox = () => {
  const [filters, setFilters] = useState({ username: "", name: "", role: "" });
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  // 역할 key → 한글 매핑
  const getRoleTitle = (key) => {
    const role = ROLE_DEFS.find((r) => r.value === key);
    return role ? role.title : key;
  };

  // 사용자 검색
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
      toast.error(err.response?.data?.message || "검색 실패");
    }
  };

  // 권한 부여
  const handleGrantRole = async (userId) => {
    try {
      await axiosInstance.post("/admin/grant-role", null, {
        params: { userId, role: selectedRole },
      });
      toast.success("권한 부여 완료");
      handleSearch();
    } catch (err) {
      toast.error(err.response?.data?.message || "권한 부여 실패");
    }
  };

  // 권한 회수
  const handleRevokeRole = async (userId) => {
    try {
      await axiosInstance.delete("/admin/revoke-role", {
        params: { userId, role: selectedRole },
      });
      toast.success("권한 회수 완료");
      handleSearch();
    } catch (err) {
      toast.error(err.response?.data?.message || "권한 회수 실패");
    }
  };

  return (
    <div className="RolesBox">
      <h2>유저 권한 관리</h2>

      <div>
        {/* 검색 필터 */}
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
            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
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
              <option key={role.value} value={role.value} title={role.label}>
                {role.label}
              </option>
            ))}
          </select>
          <button type="submit" className="primary-btn">
            검색
          </button>
        </form>

        {/* 변경할 권한 선택 */}
        <div className="role-control">
          <label>변경할 권한 선택: </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value} title={role.label}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 결과 */}
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
                  {/* 현재 권한: RoleTag 사용, 한글 타이틀 표시 */}
                  <td>
                    {u.roles?.map((role) => (
                      <RoleTag key={role} role={role} title={getRoleTitle(role)} />
                    ))}
                  </td>
                  {/* 권한 관리 버튼 */}
                  <td>
                    <button
                      className="btn grant-btn"
                      onClick={() => handleGrantRole(u.id)}
                    >
                      부여
                    </button>
                    <button
                      className="btn revoke-btn"
                      onClick={() => handleRevokeRole(u.id)}
                    >
                      회수
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {searched && users.length === 0 && (
          <p className="no-result">검색 결과 없음</p>
        )}
      </div>
    </div>
  );
};

export default RolesBox;
