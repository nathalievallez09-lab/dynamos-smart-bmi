import { useEffect, useState } from "react";
import { Search, Edit2, Trash2, UserPlus, Eye, Download } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  adminCreateUser,
  adminDeleteUser,
  getAdminExportRows,
  adminUpdateUser,
} from "../../api/api-integration";

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

type UserFormState = {
  id: string;
  name: string;
  age: string;
  sex: "Male" | "Female" | "";
};

const emptyForm: UserFormState = {
  id: "",
  name: "",
  age: "",
  sex: "",
};

export function UserManagement({
  users: incomingUsers,
  onRefresh,
}: {
  users?: User[];
  onRefresh?: () => Promise<void> | void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [exportScope, setExportScope] = useState<"all" | "specific">("all");
  const [exportSearch, setExportSearch] = useState("");
  const [exportRecordCount, setExportRecordCount] = useState(0);
  const users = incomingUsers || [];

  useEffect(() => {
    const storedScope = localStorage.getItem("adminDefaultExportScope");
    if (storedScope === "all" || storedScope === "specific") {
      setExportScope(storedScope);
    }
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    let isMounted = true;
    const loadExportCount = async () => {
      try {
        const rows = await getAdminExportRows({
          from: exportFrom || undefined,
          to: exportTo || undefined,
          search: exportScope === "specific" ? exportSearch : undefined,
        });
        if (isMounted) {
          setExportRecordCount(rows.length);
        }
      } catch {
        if (isMounted) {
          setExportRecordCount(0);
        }
      }
    };

    loadExportCount();
    return () => {
      isMounted = false;
    };
  }, [exportFrom, exportTo, exportScope, exportSearch, users.length]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#54acbf" };
    if (bmi < 25) return { label: "Normal", color: "#26658c" };
    if (bmi < 30) return { label: "Overweight", color: "#023859" };
    return { label: "Obese", color: "#d4183d" };
  };

  const resetForm = () => {
    setForm(emptyForm);
    setError("");
  };

  const validateForm = (needsId: boolean) => {
    if (needsId && !/^\d{5}$/.test(form.id)) {
      return "User ID must be a 5-digit number.";
    }
    if (!form.name.trim()) {
      return "Name is required.";
    }
    const age = Number(form.age);
    if (!Number.isInteger(age) || age <= 0) {
      return "Age must be a valid number.";
    }
    return "";
  };

  const handleCreate = async () => {
    const validationError = validateForm(true);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await adminCreateUser({
        id: form.id,
        name: form.name.trim(),
        age: Number(form.age),
        sex: form.sex,
      });
      setIsCreateOpen(false);
      resetForm();
      await onRefresh?.();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    const validationError = validateForm(false);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await adminUpdateUser(editingUser.id, {
        name: form.name.trim(),
        age: Number(form.age),
        sex: form.sex,
      });
      setEditingUser(null);
      resetForm();
      await onRefresh?.();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    setIsSaving(true);
    setError("");
    try {
      await adminDeleteUser(deletingUser.id);
      setDeletingUser(null);
      await onRefresh?.();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete user.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setForm({
      id: user.id,
      name: user.name,
      age: String(user.age || ""),
      sex: (user.sex as "Male" | "Female" | "") || "",
    });
    setError("");
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const downloadCsv = async () => {
    setIsExporting(true);
    setError("");
    try {
      const rows = await getAdminExportRows({
        from: exportFrom || undefined,
        to: exportTo || undefined,
        search: exportScope === "specific" ? exportSearch : undefined,
      });

      const header = [
        "User ID",
        "Full Name",
        "Age",
        "Sex",
        "BMI",
        "Category",
        "Weight (kg)",
        "Height (cm)",
        "Captured At",
        "Captured Date",
        "Captured Time",
        "Timezone",
      ];
      const csvRows = rows.map((row) => [
        row.user_id,
        row.full_name,
        row.age,
        row.sex,
        row.bmi,
        row.category,
        row.weight_kg,
        row.height_cm,
        row.captured_at,
        row.captured_date,
        row.captured_time,
        row.timezone,
      ]);

      const escapeCell = (value: string | number) => `"${String(value).replace(/"/g, "\"\"")}"`;
      const metaRows = [
        ["Export Generated At", new Date().toLocaleString()],
        ["From Date", exportFrom || "All"],
        ["To Date", exportTo || "All"],
        ["Export Scope", exportScope === "all" ? "All Users" : `Search: ${exportSearch || "-"}`],
        ["Total Records", rows.length],
        [],
      ];
      const content = [...metaRows, header, ...csvRows]
        .map((line) => line.map((cell) => escapeCell(cell ?? "")).join(","))
        .join("\n");

      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `smart-bmi-export-${exportFrom || "all"}-to-${exportTo || "all"}-${rows.length}-rows.csv`;
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#023859]">User Management</h2>
            <p className="text-sm text-[#026658c]/70 mt-1">
              Manage all registered users and their BMI records
            </p>
          </div>
          <Button onClick={openCreateDialog} className="bg-[#54acbf] hover:bg-[#26658c] text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

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

        <div className="mb-6 rounded-lg border border-[#54acbf]/20 bg-[#a7ebf2]/10 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Export Scope</Label>
                <select
                  value={exportScope}
                  onChange={(e) => setExportScope(e.target.value as "all" | "specific")}
                  className="mt-2 flex h-10 w-full rounded-md border border-[#54acbf]/30 bg-white px-3 py-2 text-sm"
                >
                  <option value="all">All Users</option>
                  <option value="specific">Search by Name or ID</option>
                </select>
              </div>
              {exportScope === "specific" && (
                <div>
                  <Label>User Search</Label>
                  <Input
                    value={exportSearch}
                    onChange={(e) => setExportSearch(e.target.value)}
                    placeholder="Enter name or user ID"
                    className="mt-2 bg-white"
                  />
                </div>
              )}
              <div>
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={exportFrom}
                  onChange={(e) => setExportFrom(e.target.value)}
                  className="mt-2 bg-white"
                />
              </div>
              <div>
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={exportTo}
                  onChange={(e) => setExportTo(e.target.value)}
                  className="mt-2 bg-white"
                />
              </div>
              <div className="rounded-md bg-white/70 px-4 py-3">
                <p className="text-sm text-[#026658c]/70">Records To Download</p>
                <p className="text-2xl font-bold text-[#023859]">{exportRecordCount}</p>
              </div>
            </div>
            <Button
              onClick={downloadCsv}
              disabled={isExporting}
              className="bg-[#023859] hover:bg-[#26658c] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Preparing CSV..." : "Download Excel CSV"}
            </Button>
          </div>
          <p className="mt-3 text-sm text-[#026658c]/70">
            Export includes measurement date, time, timezone, BMI, height, and weight. You can export all users or only records matching a user name or ID.
          </p>
        </div>

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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#54acbf]/20">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">User ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Age/Sex</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Current BMI</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Records</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Last Check</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#023859]">Actions</th>
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
                      <span className="font-mono text-sm text-[#023859]">{user.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-[#023859]">{user.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#026658c]">
                        {user.age} / {user.sex || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#026658c]/70">{user.email || "-"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#023859]">{user.currentBMI}</span>
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
                      <span className="text-sm text-[#026658c]">{user.totalRecords}</span>
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
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#026658c] hover:text-[#023859] hover:bg-[#a7ebf2]/20"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#d4183d] hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setDeletingUser(user);
                            setError("");
                          }}
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

      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new user record in Firebase.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User ID</Label>
              <Input
                value={form.id}
                onChange={(e) => setForm((current) => ({ ...current, id: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
                placeholder="5-digit ID"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Age</Label>
              <Input
                value={form.age}
                onChange={(e) => setForm((current) => ({ ...current, age: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Sex</Label>
              <select
                value={form.sex}
                onChange={(e) => setForm((current) => ({ ...current, sex: e.target.value as UserFormState["sex"] }))}
                className="mt-2 flex h-10 w-full rounded-md border border-[#54acbf]/30 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSaving} className="bg-[#54acbf] hover:bg-[#26658c] text-white">
              {isSaving ? "Saving..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => { if (!open) { setEditingUser(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update this user's profile information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User ID</Label>
              <Input value={form.id} disabled className="mt-2" />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Age</Label>
              <Input
                value={form.age}
                onChange={(e) => setForm((current) => ({ ...current, age: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Sex</Label>
              <select
                value={form.sex}
                onChange={(e) => setForm((current) => ({ ...current, sex: e.target.value as UserFormState["sex"] }))}
                className="mt-2 flex h-10 w-full rounded-md border border-[#54acbf]/30 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingUser(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={isSaving} className="bg-[#54acbf] hover:bg-[#26658c] text-white">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewingUser)} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Read-only summary of the selected user.</DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-3 text-sm text-[#023859]">
              <p><span className="font-semibold">User ID:</span> {viewingUser.id}</p>
              <p><span className="font-semibold">Name:</span> {viewingUser.name}</p>
              <p><span className="font-semibold">Age:</span> {viewingUser.age}</p>
              <p><span className="font-semibold">Sex:</span> {viewingUser.sex || "-"}</p>
              <p><span className="font-semibold">Current BMI:</span> {viewingUser.currentBMI}</p>
              <p><span className="font-semibold">Records:</span> {viewingUser.totalRecords}</p>
              <p><span className="font-semibold">Last Check:</span> {viewingUser.lastMeasurement ? new Date(viewingUser.lastMeasurement).toLocaleString() : "-"}</p>
              <p><span className="font-semibold">Status:</span> {viewingUser.status}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This removes the user and all stored measurements from Firebase.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-[#023859]">
              Delete user <span className="font-semibold">{deletingUser?.name}</span> ({deletingUser?.id})?
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button onClick={handleDelete} disabled={isSaving} className="bg-[#d4183d] hover:bg-red-700 text-white">
              {isSaving ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
