import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', recipients: '' });

  const fetchNotifications = async () => {
    const res = await api.get('/notifications');
    setNotifications(res.data);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleOpen = () => {
    setForm({ title: '', message: '', recipients: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    // recipients يمكن تركها فارغة لإرسال للجميع أو تحويلها لمصفوفة من IDs
    await api.post('/notifications', form);
    fetchNotifications();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف الإشعار؟')) {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>الإشعارات</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>إنشاء إشعار جديد</Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العنوان</TableCell>
              <TableCell>الرسالة</TableCell>
              <TableCell>تاريخ الإنشاء</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map(n => (
              <TableRow key={n._id}>
                <TableCell>{n.title}</TableCell>
                <TableCell>{n.message}</TableCell>
                <TableCell>{new Date(n.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(n._id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>إنشاء إشعار جديد</DialogTitle>
        <DialogContent>
          <TextField label="العنوان" fullWidth margin="dense"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="الرسالة" fullWidth margin="dense" multiline
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <TextField label="المستلمين (اختياري)" fullWidth margin="dense"
            value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSubmit} color="primary">إرسال</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationsPage;
