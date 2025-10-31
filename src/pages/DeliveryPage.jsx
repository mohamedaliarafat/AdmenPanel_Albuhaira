import React, { useEffect, useState } from 'react';
import api from '../services/api'; // تأكد من أن المسار صحيح
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, MenuItem, Box, useTheme, IconButton, CircularProgress
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Phone as PhoneIcon, DirectionsCar as CarIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// أيقونة Marker خاصة بالسائقين (تم تعديل المسار ليكون محليًا إذا أمكن أو استخدام أيقونة FontAwesome CDN)
// لتجنب مشاكل الصور الخارجية، سنعيد تعريف الأيقونة بطريقة Leaflet المعتادة إذا لم تكن موجودة محليًا.
const driverIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


// دالة مساعدة لتحديد لون الشارة بناءً على حالة السائق
const getStatusChip = (status, theme) => {
  let color;
  let label;

  switch (status) {
    case 'available':
      color = theme.palette.success.main; // أخضر
      label = 'متاح';
      break;
    case 'busy':
      color = theme.palette.warning.main; // أصفر تحذيري
      label = 'مشغول (في مهمة)';
      break;
    case 'off':
      color = theme.palette.error.main; // أحمر
      label = 'غير متوفر';
      break;
    default:
      color = theme.palette.grey[500];
      label = status;
  }

  return (
    <Box
      sx={{
        backgroundColor: color + '30',
        color: color,
        borderRadius: '16px',
        padding: '4px 10px',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        textAlign: 'center',
        display: 'inline-flex',
        minWidth: '120px',
        justifyContent: 'center',
      }}
    >
      {label}
    </Box>
  );
};


const DeliveryPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', status: 'available', lat: '', lng: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme(); // للوصول إلى نظام الألوان الكحلي المخصص

  // جلب السائقين
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');
      const res = await api.get('/delivery', { headers: { Authorization: `Bearer ${token}` } });
      setDrivers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل جلب بيانات السائقين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // يمكن إضافة setInterval هنا لتحديث موقع السائقين كل فترة
    const interval = setInterval(fetchDrivers, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setForm({
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle || '',
        status: driver.status || 'available',
        lat: driver.location?.lat || '',
        lng: driver.location?.lng || ''
      });
    } else {
      setEditingDriver(null);
      setForm({ name: '', phone: '', vehicle: '', status: 'available', lat: '', lng: '' });
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
      const payload = {
        ...form,
        location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) }
      };

      // التحقق من أن حقول الموقع أرقام صالحة إذا تم إدخالها
      if ((form.lat && isNaN(payload.location.lat)) || (form.lng && isNaN(payload.location.lng))) {
        throw new Error('يرجى إدخال أرقام صحيحة لخطوط الطول والعرض.');
      }

      if (editingDriver) {
        await api.put(`/delivery/${editingDriver._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post('/delivery', payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchDrivers();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل حفظ بيانات السائق');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف السائق؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/delivery/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchDrivers();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'فشل حذف السائق');
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

  // مركز الخريطة الافتراضي: الرياض
  const mapCenter = [24.7136, 46.6753]; 

  return (
    <Box sx={{ p: 0 }}>
      {/* العنوان وزر الإضافة */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, display: 'flex', alignItems: 'center' }}>
          <DeliveryIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
          إدارة السائقين وتتبعهم
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '8px', minWidth: '180px' }}
        >
          إضافة سائق جديد
        </Button>
      </Box>

      {/* شريط الأخطاء */}
      {error && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: theme.palette.error.dark, color: 'white', borderRadius: '8px' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* 1. خريطة العرض والتتبع (أعلى الجدول لجذب الانتباه) */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        📍 تتبع السائقين في الوقت الفعلي
      </Typography>
      <Paper elevation={5} sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ height: 450 }}>
          <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {drivers.map(d => d.location?.lat && d.location?.lng && (
              <Marker key={d._id} position={[d.location.lat, d.location.lng]} icon={driverIcon}>
                <Popup>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{d.name}</Typography>
                  <Typography variant="body2">{d.vehicle}</Typography>
                  {getStatusChip(d.status, theme)}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Paper>


      {/* 2. جدول السائقين */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        📝 بيانات السائقين المسجلين
      </Typography>
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '12px', overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Table stickyHeader aria-label="السائقين">
            <TableHead sx={tableHeadStyle}>
              <TableRow>
                <TableCell>الاسم</TableCell>
                <TableCell>الجوال</TableCell>
                <TableCell>المركبة</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>الموقع الحالي</TableCell>
                <TableCell sx={{ width: '15%', textAlign: 'center' }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>لا يوجد سائقون مسجلون.</TableCell>
                </TableRow>
              ) : (
                drivers.map(d => (
                  <TableRow key={d._id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.light }}>{d.name}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.secondary.main }} />
                        {d.phone}
                    </TableCell>
                    <TableCell>
                        <CarIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        {d.vehicle || 'غير محدد'}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(d.status, theme)}
                    </TableCell>
                    <TableCell>
                      {d.location?.lat && d.location?.lng ? `${d.location.lat.toFixed(4)}, ${d.location.lng.toFixed(4)}` : 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton onClick={() => handleOpen(d)} color="primary" size="small" sx={{ ml: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(d._id)} size="small">
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

      {/* Dialog إضافة / تعديل سائق */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '15px', minWidth: { xs: '90%', sm: '500px' } } }}>
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          {editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="الاسم الكامل" fullWidth margin="normal" variant="outlined" name="name"
            value={form.name} onChange={handleChange} required />
          <TextField label="رقم الجوال" fullWidth margin="normal" variant="outlined" name="phone"
            value={form.phone} onChange={handleChange} required />
          <TextField label="المركبة (النوع واللوحة)" fullWidth margin="normal" variant="outlined" name="vehicle"
            value={form.vehicle} onChange={handleChange} />
          <TextField select label="الحالة الأولية" fullWidth margin="normal" variant="outlined" name="status"
            value={form.status} onChange={handleChange}>
            <MenuItem value="available">متاح</MenuItem>
            <MenuItem value="busy">مشغول</MenuItem>
            <MenuItem value="off">غير متوفر</MenuItem>
          </TextField>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>موقع التتبع (اختياري)</Typography>
          <TextField label="خط العرض (Latitude)" fullWidth margin="dense" variant="outlined" type="number" name="lat"
            value={form.lat} onChange={handleChange} inputProps={{ step: "any" }} />
          <TextField label="خط الطول (Longitude)" fullWidth margin="dense" variant="outlined" type="number" name="lng"
            value={form.lng} onChange={handleChange} inputProps={{ step: "any" }} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, backgroundColor: theme.palette.background.default }}>
          <Button onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>إلغاء</Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained" sx={{ minWidth: '100px', borderRadius: '8px' }}>
            {editingDriver ? 'تحديث البيانات' : 'إضافة السائق'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryPage;