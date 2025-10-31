import React, { useEffect, useState } from 'react';
import api from '../services/api'; // تأكد من أن المسار صحيح
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box, CircularProgress, useTheme
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // استخدام نظام المظهر المخصص (الكحلي)
  const theme = useTheme();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/products', config);
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category
      });
    } else {
      setEditingProduct(null);
      setForm({ name: '', description: '', price: '', stock: '', category: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, form, config);
      } else {
        await api.post('/products', form, config);
      }
      fetchProducts();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل حفظ المنتج');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.delete(`/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'فشل حذف المنتج');
      }
    }
  };

  // ---------------------------------------------
  // جزء التصميم (الاحترافي)
  // ---------------------------------------------
  
  // أنماط لخلايا الرأس لضمان التناسق مع الوضع الكحلي الداكن
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
          <InventoryIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
          إدارة المنتجات
        </Typography>
        <Button
          variant="contained"
          color="secondary" // استخدام اللون الثانوي المميز (الأزرق/الأخضر)
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '8px', minWidth: '150px' }}
        >
          إضافة منتج جديد
        </Button>
      </Box>

      {/* شريط الإشعارات/الأخطاء */}
      {error && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: theme.palette.error.dark, color: 'white', borderRadius: '8px' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* جدول عرض المنتجات */}
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '12px', overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Table stickyHeader aria-label="منتجات">
            {/* رأس الجدول المنسَّق */}
            <TableHead sx={tableHeadStyle}>
              <TableRow>
                <TableCell sx={{ width: '20%' }}>الاسم</TableCell>
                <TableCell sx={{ width: '30%' }}>الوصف</TableCell>
                <TableCell>السعر (ر.س)</TableCell>
                <TableCell>المخزون</TableCell>
                <TableCell>الفئة</TableCell>
                <TableCell sx={{ width: '15%', textAlign: 'center' }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            {/* جسم الجدول */}
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>لا توجد منتجات لعرضها.</TableCell>
                </TableRow>
              ) : (
                products.map(p => (
                  <TableRow key={p._id} sx={{ 
                      '&:hover': { 
                          backgroundColor: theme.palette.action.hover, // تظليل عند المرور بالفأرة
                          cursor: 'pointer' 
                      } 
                  }}>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.light }}>{p.name}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>{p.description.substring(0, 50)}...</TableCell>
                    <TableCell sx={{ color: theme.palette.success.main }}>{p.price}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                          fontWeight: 'bold', 
                          color: p.stock < 10 ? theme.palette.warning.main : theme.palette.text.primary 
                      }}>
                          {p.stock}
                      </Box>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton onClick={() => handleOpen(p)} color="primary" size="small" sx={{ ml: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(p._id)} size="small">
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

      {/* نموذج الحوار (Dialog) للإضافة/التعديل */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '15px', minWidth: { xs: '90%', sm: '500px' } } }}>
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="اسم المنتج" fullWidth margin="normal" variant="outlined" name="name"
            value={form.name} onChange={handleChange} required />
          <TextField label="الوصف التفصيلي" fullWidth margin="normal" variant="outlined" multiline rows={3} name="description"
            value={form.description} onChange={handleChange} required />
          <TextField label="السعر (ر.س)" fullWidth margin="normal" variant="outlined" type="number" name="price"
            value={form.price} onChange={handleChange} inputProps={{ step: "0.01" }} required />
          <TextField label="الكمية في المخزون" fullWidth margin="normal" variant="outlined" type="number" name="stock"
            value={form.stock} onChange={handleChange} required />
          <TextField label="فئة المنتج" fullWidth margin="normal" variant="outlined" name="category"
            value={form.category} onChange={handleChange} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, backgroundColor: theme.palette.background.default }}>
          <Button onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>إلغاء</Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained" sx={{ minWidth: '100px', borderRadius: '8px' }}>
            {editingProduct ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;