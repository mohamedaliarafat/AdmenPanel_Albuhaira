import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Typography, Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', status: 'active' });

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setForm({ name: user.name, phone: user.phone, email: user.email, status: user.status });
    } else {
      setEditingUser(null);
      setForm({ name: '', phone: '', email: '', status: 'active' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, form);
      } else {
        await api.post('/users', form);
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف المستخدم؟')) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>إدارة المستخدمين</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>إضافة مستخدم جديد</Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>رقم الجوال</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)}>تعديل</Button>
                  <Button color="error" onClick={() => handleDelete(user._id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog لإضافة / تعديل مستخدم */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense" label="الاسم" fullWidth value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField
            margin="dense" label="رقم الجوال" fullWidth value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField
            margin="dense" label="البريد الإلكتروني" fullWidth value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField
            margin="dense" label="الحالة" fullWidth value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSubmit} color="primary">{editingUser ? 'تحديث' : 'إضافة'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
