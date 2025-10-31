import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
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

  const handleSubmit = async () => {
    if (editingProduct) {
      await api.put(`/products/${editingProduct._id}`, form);
    } else {
      await api.post('/products', form);
    }
    fetchProducts();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف المنتج؟')) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>إدارة المنتجات</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>إضافة منتج جديد</Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>السعر</TableCell>
              <TableCell>المخزون</TableCell>
              <TableCell>الفئة</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(p)}>تعديل</Button>
                  <Button color="error" onClick={() => handleDelete(p._id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج'}</DialogTitle>
        <DialogContent>
          <TextField label="الاسم" fullWidth margin="dense"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="الوصف" fullWidth margin="dense"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="السعر" fullWidth margin="dense" type="number"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextField label="المخزون" fullWidth margin="dense" type="number"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <TextField label="الفئة" fullWidth margin="dense"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSubmit} color="primary">{editingProduct ? 'تحديث' : 'إضافة'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
