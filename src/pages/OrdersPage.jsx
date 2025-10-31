import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, MenuItem, Box, useTheme, IconButton, CircularProgress
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon, Edit as EditIcon, Delete as DeleteIcon,
  LocalShipping as ShippingIcon, CheckCircle as CompletedIcon, AccessTime as PendingIcon,
  Cancel as CancelledIcon, Person as UserIcon
} from '@mui/icons-material';

// دالة مساعدة لتحديد لون الشارة بناءً على حالة الطلب
const getStatusChip = (status, theme) => {
  let color;
  let label;
  let icon;

  switch (status) {
    case 'pending':
      color = theme.palette.warning.main; // أصفر
      label = 'معلق';
      icon = <PendingIcon sx={{ fontSize: '1rem' }} />;
      break;
    case 'shipped':
      color = theme.palette.info.main; // أزرق
      label = 'تم الشحن';
      icon = <ShippingIcon sx={{ fontSize: '1rem' }} />;
      break;
    case 'completed':
      color = theme.palette.success.main; // أخضر
      label = 'مكتمل';
      icon = <CompletedIcon sx={{ fontSize: '1rem' }} />;
      break;
    case 'cancelled':
      color = theme.palette.error.main; // أحمر
      label = 'ملغى';
      icon = <CancelledIcon sx={{ fontSize: '1rem' }} />;
      break;
    default:
      color = theme.palette.grey[500];
      label = status;
      icon = null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color + '30', // لون شفاف خفيف
        color: color,
        borderRadius: '16px',
        padding: '4px 10px',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        minWidth: '100px',
      }}
    >
      {icon}
      <Typography variant="body2" sx={{ mr: 0.5, fontWeight: 700 }}>
        {label}
      </Typography>
    </Box>
  );
};


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme(); // للوصول إلى نظام الألوان الكحلي

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // نفترض أن API يقوم بعمل populate لـ userId و products.productId
      const res = await api.get('/orders', config);
      setOrders(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل جلب الطلبات');
    } finally {
      setLoading(false);
    }
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
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/orders/${editingOrder._id}`, { status }, config);
      fetchOrders();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل تحديث حالة الطلب');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف الطلب؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.delete(`/orders/${id}`, config);
        fetchOrders();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'فشل حذف الطلب');
      }
    }
  };

  // ---------------------------------------------
  // جزء التصميم (الاحترافي)
  // ---------------------------------------------
  const tableHeadStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
    '& > th': {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.95rem',
    },
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* العنوان الرئيسي */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
          إدارة الطلبات
        </Typography>
      </Box>

      {/* شريط الأخطاء */}
      {error && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: theme.palette.error.dark, color: 'white', borderRadius: '8px' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* جدول عرض الطلبات */}
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '12px', overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Table stickyHeader aria-label="الطلبات">
            {/* رأس الجدول المنسَّق */}
            <TableHead sx={tableHeadStyle}>
              <TableRow>
                <TableCell>رقم الطلب</TableCell>
                <TableCell>المستخدم</TableCell>
                <TableCell>المنتجات (العدد)</TableCell>
                <TableCell>الإجمالي (ر.س)</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell sx={{ width: '15%', textAlign: 'center' }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            {/* جسم الجدول */}
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>لا توجد طلبات لعرضها.</TableCell>
                </TableRow>
              ) : (
                orders.map(order => (
                  <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                    {/* رقم الطلب */}
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.light }}>
                      #{order._id ? String(order._id).substring(18) : 'N/A'}
                    </TableCell>
                    {/* المستخدم */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UserIcon sx={{ mr: 1, fontSize: '1rem', color: theme.palette.secondary.main }} />
                        {order.userId?.name || 'مستخدم غير معروف'}
                      </Box>
                    </TableCell>
                    {/* المنتجات */}
                    <TableCell>
                      {/* عرض أول منتج وعدد المنتجات المتبقية */}
                      {order.products.length > 0 ? (
                        <>
                          {order.products[0].productId?.name || 'منتج'} x{order.products[0].quantity}
                          {order.products.length > 1 && (
                            <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary }}>
                              و {order.products.length - 1} منتجات أخرى
                            </Typography>
                          )}
                        </>
                      ) : 'لا توجد منتجات'}
                    </TableCell>
                    {/* الإجمالي */}
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      {order.total ? order.total.toFixed(2) : '0.00'}
                    </TableCell>
                    {/* الحالة (الشارة الملونة) */}
                    <TableCell>
                      {getStatusChip(order.status, theme)}
                    </TableCell>
                    {/* الإجراءات */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton onClick={() => handleOpen(order)} color="primary" size="small" sx={{ ml: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(order._id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* نموذج الحوار (Dialog) لتعديل الحالة */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '15px', minWidth: { xs: '90%', sm: '400px' } } }}>
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          تحديث حالة الطلب #{editingOrder?._id ? String(editingOrder._id).substring(18) : '...'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            select label="الحالة الجديدة" fullWidth variant="outlined" margin="normal"
            value={status} name="status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">معلق</MenuItem>
            <MenuItem value="shipped">تم الشحن</MenuItem>
            <MenuItem value="completed">مكتمل</MenuItem>
            <MenuItem value="cancelled">ملغى</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, backgroundColor: theme.palette.background.default }}>
          <Button onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>إلغاء</Button>
          <Button onClick={handleUpdate} color="secondary" variant="contained" sx={{ minWidth: '100px', borderRadius: '8px' }}>
            تحديث
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;