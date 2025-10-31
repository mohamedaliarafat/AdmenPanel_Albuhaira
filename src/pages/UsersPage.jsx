import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Typography, Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, useTheme, Select, MenuItem, FormControl, InputLabel, Chip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon,
  CheckCircleOutline as ActiveIcon, Block as InactiveIcon
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', status: 'active' });

  // الوصول إلى نظام الألوان والمظهر المخصص (الكحلي الداكن)
  const theme = useTheme(); 
  
  const token = localStorage.getItem('token'); // JWT من تسجيل الدخول

  // إعداد الهيدر لجميع طلبات الـ API
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users', config);
      // افتراض أن كل مستخدم لديه خاصية 'name', 'phone', 'email', 'status', و '_id'
      setUsers(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء جلب المستخدمين');
    }
  };

  useEffect(() => { 
      // استدعاء جلب المستخدمين فقط إذا كان التوكن موجوداً لتجنب الأخطاء
      if (token) fetchUsers(); 
  }, [token]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, form, config);
      } else {
        // غالباً تحتاج API لـ POST إلى كلمة مرور 'password' أيضاً
        await api.post('/users', { ...form, password: 'defaultPassword123' }, config); 
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء العملية');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المستخدم؟')) return;
    try {
      await api.delete(`/users/${id}`, config);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء الحذف');
    }
  };

  // دالة مساعدة لتلوين حالة المستخدم
  const getStatusChip = (status) => {
    const isDarkMode = theme.palette.mode === 'dark';
    const color = status === 'active' ? '#66bb6a' : '#ef5350';
    const backgroundColor = isDarkMode ? `${color}30` : `${color}20`; 
    const icon = status === 'active' ? <ActiveIcon /> : <InactiveIcon />;
    const label = status === 'active' ? 'نشط' : 'غير نشط';
    
    return (
      <Chip 
        label={label} 
        icon={icon}
        sx={{ 
          backgroundColor: backgroundColor, 
          color: color, 
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: color }
        }} 
      />
    );
  };


  return (
    <Box sx={{ p: 0, direction: 'rtl' }}>
      
      {/* العنوان وزر الإضافة */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          <PeopleIcon sx={{ verticalAlign: 'middle', ml: 1, color: theme.palette.primary.main }} />
          إدارة المستخدمين
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" // استخدام اللون الثانوي للتباين
          startIcon={<AddIcon />} 
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2 }}
        >
          إضافة مستخدم جديد
        </Button>
      </Box>

      {/* جدول المستخدمين */}
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ borderRadius: 3, overflow: 'hidden' }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="users table">
          <TableHead 
            sx={{ 
              backgroundColor: theme.palette.primary.dark, // خلفية كحلية داكنة للرأس
              '& th': { color: 'white', fontWeight: 'bold' } 
            }}
          >
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>رقم الجوال</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow 
                key={user._id} 
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 }, 
                  '&:hover': { backgroundColor: theme.palette.action.hover } // تأثير عند المرور
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getStatusChip(user.status)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpen(user)} sx={{ color: theme.palette.secondary.main }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog لإضافة / تعديل مستخدم */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: theme.palette.primary.main, 
            color: 'white', 
            fontWeight: 'bold' 
          }}
        >
          {editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          
          <TextField
            autoFocus
            margin="dense" name="name" label="الاسم" type="text" fullWidth 
            value={form.name} onChange={handleChange} variant="outlined" 
            sx={{ mb: 2 }} />
          
          <TextField
            margin="dense" name="phone" label="رقم الجوال" type="text" fullWidth 
            value={form.phone} onChange={handleChange} variant="outlined" 
            sx={{ mb: 2 }} />
          
          <TextField
            margin="dense" name="email" label="البريد الإلكتروني" type="email" fullWidth 
            value={form.email} onChange={handleChange} variant="outlined" 
            sx={{ mb: 2 }} />
          
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>الحالة</InputLabel>
            <Select
              name="status" label="الحالة" value={form.status} onChange={handleChange}
            >
              <MenuItem value={'active'}>نشط</MenuItem>
              <MenuItem value={'inactive'}>غير نشط</MenuItem>
            </Select>
          </FormControl>
          
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">إلغاء</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="secondary"
            startIcon={editingUser ? <EditIcon /> : <AddIcon />}
          >
            {editingUser ? 'تحديث البيانات' : 'إضافة المستخدم'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;