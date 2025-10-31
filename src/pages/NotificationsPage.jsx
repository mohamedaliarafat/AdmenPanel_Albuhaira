import React, { useEffect, useState } from 'react';
import api from '../services/api'; // تأكد من أن المسار صحيح
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box, useTheme, IconButton, CircularProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon, Send as SendIcon, Delete as DeleteIcon,
  DateRange as DateIcon
} from '@mui/icons-material';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', recipients: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme(); // للوصول إلى نظام الألوان الكحلي المخصص

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/notifications', config);
      setNotifications(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل جلب الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleOpen = () => {
    setForm({ title: '', message: '', recipients: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.post('/notifications', form, config);
      fetchNotifications();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل إرسال الإشعار');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف الإشعار؟')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.delete(`/notifications/${id}`, config);
        fetchNotifications();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'فشل حذف الإشعار');
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
      {/* العنوان وزر الإضافة */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
          إدارة الإشعارات
        </Typography>
        <Button
          variant="contained"
          color="secondary" // استخدام اللون الثانوي المميز
          startIcon={<SendIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: '8px', minWidth: '180px' }}
        >
          إنشاء إشعار جديد
        </Button>
      </Box>

      {/* شريط الأخطاء */}
      {error && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: theme.palette.error.dark, color: 'white', borderRadius: '8px' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* جدول عرض الإشعارات */}
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '12px', overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Table stickyHeader aria-label="الإشعارات">
            {/* رأس الجدول المنسَّق */}
            <TableHead sx={tableHeadStyle}>
              <TableRow>
                <TableCell sx={{ width: '20%' }}>العنوان</TableCell>
                <TableCell sx={{ width: '40%' }}>الرسالة</TableCell>
                <TableCell>المستلمين</TableCell>
                <TableCell sx={{ width: '15%' }}>تاريخ الإرسال</TableCell>
                <TableCell sx={{ width: '10%', textAlign: 'center' }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            {/* جسم الجدول */}
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5 }}>لا توجد إشعارات سابقة.</TableCell>
                </TableRow>
              ) : (
                notifications.map(n => (
                  <TableRow key={n._id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.light }}>{n.title}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>{n.message}</TableCell>
                    {/* نفترض أن recipients قد يكون مصفوفة أو سلسلة نصية */}
                    <TableCell>
                      {Array.isArray(n.recipients) && n.recipients.length > 0
                        ? `${n.recipients.length} مستلم`
                        : n.recipients || 'الجميع'
                      }
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon sx={{ fontSize: '1rem', mr: 1, color: theme.palette.text.secondary }} />
                        {new Date(n.createdAt).toLocaleDateString()}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton color="error" onClick={() => handleDelete(n._id)} size="small">
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

      {/* نموذج الحوار (Dialog) لإنشاء إشعار */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '15px', minWidth: { xs: '90%', sm: '500px' } } }}>
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          إرسال إشعار فوري
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="العنوان" fullWidth margin="normal" variant="outlined" name="title"
            value={form.title} onChange={handleChange} required />
          <TextField label="الرسالة التفصيلية" fullWidth margin="normal" variant="outlined" multiline rows={4} name="message"
            value={form.message} onChange={handleChange} required />
          <TextField label="المستلمين (مثل IDs مفصولة بفاصلة، اترك فارغًا للجميع)" fullWidth margin="normal" variant="outlined" name="recipients"
            value={form.recipients} onChange={handleChange} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, backgroundColor: theme.palette.background.default }}>
          <Button onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>إلغاء</Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained" startIcon={<SendIcon />} sx={{ minWidth: '100px', borderRadius: '8px' }}>
            إرسال الإشعار
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;