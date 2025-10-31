import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Typography, Grid, Paper } from '@mui/material';

const DashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const users = await api.get('/users');
      const orders = await api.get('/orders');
      const products = await api.get('/products');
      setStats({ users: users.data.length, orders: orders.data.length, products: products.data.length });
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">لوحة التحكم</Typography>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">المستخدمين</Typography>
            <Typography variant="h4">{stats.users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">الطلبات</Typography>
            <Typography variant="h4">{stats.orders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">المنتجات</Typography>
            <Typography variant="h4">{stats.products}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardPage;
