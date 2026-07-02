"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type AdminUser,
} from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Users } from "lucide-react";
import { statusStyles } from "@/lib/admin-status-styles";

type UserFormState = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

function roleBadge(role: AdminUser["role"]) {
  return role === "admin"
    ? cn(statusStyles.warning.bg, statusStyles.warning.text)
    : cn(statusStyles.neutral.bg, statusStyles.neutral.text);
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useGetUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { toast } = useToast();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);

  const resetForm = () => setForm(emptyForm);

  const openAdd = () => {
    resetForm();
    setAddOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditTarget(user);
  };

  const closeDialogs = () => {
    setAddOpen(false);
    setEditTarget(null);
    setDeleteTarget(null);
    resetForm();
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Name, email, and password are required.",
      });
      return;
    }
    try {
      await createUser.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      closeDialogs();
      toast({ title: "User created", description: `${form.name} can now sign in.` });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description: error instanceof Error ? error.message : "Could not create user",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    if (!form.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter a name.",
      });
      return;
    }
    try {
      await updateUser.mutateAsync({
        id: editTarget.id,
        data: {
          name: form.name.trim(),
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        },
      });
      closeDialogs();
      toast({ title: "User updated", description: `${form.name} has been saved.` });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update user",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync({ id: deleteTarget.id });
      setDeleteTarget(null);
      toast({
        title: "User deleted",
        description: `${deleteTarget.name} has been removed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete user",
      });
    }
  };

  const isSaving = createUser.isPending || updateUser.isPending;

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 border-b border-border/50 pb-6 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">
            System
          </p>
          <h1 className="font-serif text-4xl text-foreground">Users</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Registered accounts that can sign in to the website. Manage guest and admin access
            from here.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="h-12 rounded-xl bg-primary px-8 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add user
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-admin-grid" />
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-14 text-[10px] font-bold uppercase tracking-widest">
                Name
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Email
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Role
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Joined
              </TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-bold uppercase tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-48 animate-pulse text-center text-muted-foreground"
                >
                  Loading users…
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 h-8 w-8 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No users yet</p>
                  <Button variant="link" className="mt-2" onClick={openAdd}>
                    Add the first user
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow
                  key={user.id}
                  className="group border-border transition-colors hover:bg-secondary/10"
                >
                  <TableCell className="py-6">
                    <p className="font-serif text-lg">{user.name}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-lg border-none text-[9px] font-bold uppercase tracking-widest",
                        roleBadge(user.role)
                      )}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => openEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={(open) => !open && closeDialogs()}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Add user</DialogTitle>
            <DialogDescription>
              Create a new account. The user can sign in immediately with these credentials.
            </DialogDescription>
          </DialogHeader>
          <UserFormFields form={form} setForm={setForm} showEmail passwordRequired />
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={closeDialogs}>
              Cancel
            </Button>
            <Button className="rounded-xl" disabled={isSaving} onClick={() => void handleCreate()}>
              {createUser.isPending ? "Creating…" : "Create user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editTarget != null}
        onOpenChange={(open) => !open && closeDialogs()}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit user</DialogTitle>
            <DialogDescription>
              Update name or role. Leave password blank to keep the current one.
            </DialogDescription>
          </DialogHeader>
          <UserFormFields form={form} setForm={setForm} emailReadOnly />
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={closeDialogs}>
              Cancel
            </Button>
            <Button className="rounded-xl" disabled={isSaving} onClick={() => void handleUpdate()}>
              {updateUser.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Remove ${deleteTarget.name} (${deleteTarget.email})? This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUser.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleteUser.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserFormFields({
  form,
  setForm,
  showEmail,
  emailReadOnly,
  passwordRequired,
}: {
  form: UserFormState;
  setForm: (form: UserFormState) => void;
  showEmail?: boolean;
  emailReadOnly?: boolean;
  passwordRequired?: boolean;
}) {
  return (
    <div className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="user-name">Name</Label>
        <Input
          id="user-name"
          className="h-11 rounded-xl"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      {(showEmail || emailReadOnly) && (
        <div className="space-y-2">
          <Label htmlFor="user-email">Email</Label>
          <Input
            id="user-email"
            type="email"
            className="h-11 rounded-xl"
            value={form.email}
            readOnly={emailReadOnly}
            disabled={emailReadOnly}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="user-password">
          Password{passwordRequired ? "" : " (optional)"}
        </Label>
        <Input
          id="user-password"
          type="password"
          className="h-11 rounded-xl"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={passwordRequired ? "" : "Leave blank to keep current"}
        />
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Select
          value={form.role}
          onValueChange={(value: "admin" | "user") => setForm({ ...form, role: value })}
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Guest (user)</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
