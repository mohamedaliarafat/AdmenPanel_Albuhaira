import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem
} from '@mui/material';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [status, setStatus] = useState('pending');

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleOpen = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setStatus(order.status);
    } else {
      setEditingOrder(null);
      setStatus('pending');
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleUpdate = async () => {
    if (!editingOrder) return;
    await api.put(`/orders/${editingOrder._id}`, { status });
    fetchOrders();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف الطلب؟')) {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>إدارة الطلبات</Typography>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>رقم الطلب</TableCell>
              <TableCell>المستخدم</TableCell>
              <TableCell>المنتجات</TableCell>
              <TableCell>الإجمالي</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.userId?.name || 'مستخدم غير معروف'}</TableCell>
                <TableCell>
                  {order.products.map(p => `${p.productId?.name || ''} x${p.quantity}`).join(', ')}
                </TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(order)}>تعديل الحالة</Button>
                  <Button color="error" onClick={() => handleDelete(order._id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>تحديث حالة الطلب</DialogTitle>
        <DialogContent>
          <TextField
            select label="الحالة" fullWidth value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">معلق</MenuItem>
            <MenuItem value="shipped">تم الشحن</MenuItem>
            <MenuItem value="completed">مكتمل</MenuItem>
            <MenuItem value="cancelled">ملغى</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleUpdate} color="primary">تحديث</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
