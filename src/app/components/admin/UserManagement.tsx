import { Card } from "../ui/card";
import { Search, Edit2, Trash2, UserPlus, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  age: number;
  sex: string;
  email: string;
  lastMeasurement?: string;
  totalRecords: number;
  currentBMI: number;
  status: "active" | "inactive";
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "12345",
    name: "Juan Dela Cruz",
    age: 21,
    sex: "Male",
    email: "juan@example.com",
    lastMeasurement: "2026-02-14",
    totalRecords: 5,
    currentBMI: 23.5,
    status: "active",
  },
  {
    id: "12346",
    name: "Maria Santos",
    age: 20,
    sex: "Female",
    email: "maria@example.com",
    lastMeasurement: "2026-02-13",
    totalRecords: 8,
    currentBMI: 21.2,
    status: "active",
  },
  {
    id: "12347",
    name: "Pedro Garcia",
    age: 22,
    sex: "Male",
    email: "pedro@example.com",
    lastMeasurement: "2026-02-12",
    totalRecords: 3,
    currentBMI: 26.8,
    status: "active",
  },
  {
    id: "12348",
    name: "Ana Reyes",
    age: 19,
    sex: "Female",
    email: "ana@example.com",
    lastMeasurement: "2026-02-10",
    totalRecords: 12,
    currentBMI: 19.5,
    status: "active",
  },
  {
    id: "12349",
    name: "Carlos Martinez",
    age: 23,
    sex: "Male",
    email: "carlos@example.com",
    lastMeasurement: "2026-01-28",
    totalRecords: 2,
    currentBMI: 28.3,
    status: "inactive",
  },
];

export function UserManagement({ users: incomingUsers }: { users?: User[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const users = incomingUsers && incomingUsers.length ? incomingUsers : mockUsers;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#54acbf" };
    if (bmi < 25) return { label: "Normal", color: "#26658c" };
    if (bmi < 30) return { label: "Overweight", color: "#023859" };
    return { label: "Obese", color: "#d4183d" };
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-[#54acbf]/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#023859]">User Management</h2>
            <p className="text-sm text-[#026658c]/70 mt-1">
              Manage all registered users and their BMI records
            </p>
          </div>
          <Button className="bg-[#54acbf] hover:bg-[#26658c] text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#026658c]/50" />
          <Input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#f0f9fa] border-[#54acbf]/30"
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70">Total Users</p>
            <p className="text-2xl font-bold text-[#023859]">{users.length}</p>
          </div>
          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70">Active</p>
            <p className="text-2xl font-bold text-[#26658c]">
              {users.filter((u) => u.status === "active").length}
            </p>
          </div>
          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70">Inactive</p>
            <p className="text-2xl font-bold text-[#026658c]/60">
              {users.filter((u) => u.status === "inactive").length}
            </p>
          </div>
          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70">Total Records</p>
            <p className="text-2xl font-bold text-[#023859]">
              {users.reduce((sum, u) => sum + u.totalRecords, 0)}
            </p>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#54acbf]/20">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  User ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Age/Sex
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Current BMI
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Records
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Last Check
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const category = getBMICategory(user.currentBMI);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#54acbf]/10 hover:bg-[#a7ebf2]/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-[#023859]">
                        {user.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-[#023859]">{user.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#026658c]">
                        {user.age} / {user.sex}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#026658c]/70">{user.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#023859]">
                          {user.currentBMI}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {category.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#026658c]">
                        {user.totalRecords}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#026658c]">
                        {user.lastMeasurement
                          ? new Date(user.lastMeasurement).toLocaleDateString()
                          : "-"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-[#26658c]/20 text-[#26658c]"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#54acbf] hover:text-[#26658c] hover:bg-[#a7ebf2]/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#026658c] hover:text-[#023859] hover:bg-[#a7ebf2]/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#d4183d] hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#026658c]/70">No users found matching your search.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
