import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Switch,
  FormControlLabel,
  useTheme,
  // 🆕 المكونات الجديدة
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Language as LanguageIcon,
  Menu as MenuIcon, // 🆕 أيقونة الهمبرغر
  Home as HomeIcon, // أيقونات للشريط الجانبي
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { ColorModeContext } from "../App";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 📊 بيانات تجريبية للشارت
const chartData = [
  { name: "يناير", users: 400, orders: 240 },
  { name: "فبراير", users: 300, orders: 139 },
  { name: "مارس", users: 200, orders: 980 },
  { name: "أبريل", users: 278, orders: 390 },
  { name: "مايو", users: 189, orders: 480 },
  { name: "يونيو", users: 239, orders: 380 },
];

// 📋 عناصر قائمة الشريط الجانبي
const sidebarItems = [
  { text: "نظرة عامة", icon: <HomeIcon />, path: "/dashboard" },
  { text: "المستخدمون", icon: <PeopleIcon />, path: "/users" },
  { text: "الطلبات", icon: <ShoppingCartIcon />, path: "/orders" },
  { text: "المنتجات", icon: <InventoryIcon />, path: "/products" },
];

const DashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [language, setLanguage] = useState("ar");
  const [openDrawer, setOpenDrawer] = useState(false); // 🆕 حالة الشريط الجانبي

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  // 🔄 مؤقتًا: استخدام بيانات ثابتة بدون API
  useEffect(() => {
    setStats({ users: 120, orders: 75, products: 50 });
  }, []);

  // 📌 دوال التحكم في القوائم
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenLangMenu = (event) => setAnchorElLang(event.currentTarget);
  const handleCloseLangMenu = () => setAnchorElLang(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    handleCloseLangMenu();
  };

  // 🆕 دالة فتح وإغلاق الشريط الجانبي
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(open);
  };

  // 🆕 محتوى الشريط الجانبي
  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" color="primary" fontWeight="bold">لوحة التحكم</Typography>
      </Box>
      <List>
        {sidebarItems.map((item) => (
          <ListItem button key={item.text} 
            // مثال لتحديد العنصر الحالي
            selected={item.text === "نظرة عامة"} 
          >
            <ListItemIcon sx={{ minWidth: '40px', color: theme.palette.secondary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 🔹 الشريط العلوي */}
      <AppBar
        position="static"
        sx={{
          // تصميم عصري للشريط
          background: `linear-gradient(to right, #1976D2, #2196F3)`, // ألوان أزرق زاهية
        }}
      >
        <Toolbar>
          {/* 🆕 زر فتح الشريط الجانبي (ثلاث شرط) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            لوحة التحكم السعودية 🇸🇦
          </Typography>

          {/* 🌙 زر تبديل الوضع (محافظة على نفس التصميم) */}
          <FormControlLabel
            control={
              <Switch
                checked={theme.palette.mode === "dark"}
                onChange={colorMode.toggleColorMode}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#66bb6a" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#66bb6a" },
                }}
              />
            }
            labelPlacement="start"
            label={
              <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                {theme.palette.mode === "dark" ? "داكن" : "فاتح"}
              </Typography>
            }
          />

          {/* 🌐 اختيار اللغة */}
          <IconButton color="inherit" onClick={handleOpenLangMenu}>
            <LanguageIcon />
          </IconButton>
          <Menu anchorEl={anchorElLang} open={Boolean(anchorElLang)} onClose={handleCloseLangMenu}>
            <MenuItem onClick={() => handleLanguageChange("ar")} selected={language === "ar"}>العربية</MenuItem>
            <MenuItem onClick={() => handleLanguageChange("en")} selected={language === "en"}>English</MenuItem>
          </Menu>

          {/* 👤 بروفايل المستخدم */}
          <IconButton color="inherit" onClick={handleOpenUserMenu} sx={{ ml: 2 }}>
            <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
          </IconButton>
          <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
            <MenuItem onClick={handleCloseUserMenu}>الملف الشخصي</MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>الإعدادات</MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>تسجيل الخروج</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* 🆕 الشريط الجانبي (Drawer) */}
      <Drawer
        anchor="right" // تم تحديد مكانه على اليمين بما يتناسب مع اللغة العربية
        open={openDrawer}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>

      {/* 🧾 محتوى الصفحة */}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: theme.palette.text.primary }}>
          نظرة عامة على الأداء
        </Typography>

        {/* 🔸 بطاقات الإحصائيات (لم يتم تغييرها) */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* ... (باقي الكود كما هو) */}
          {[
            { title: "إجمالي المستخدمين", value: stats.users, color: "#FFD700" },
            { title: "الطلبات المنجزة", value: stats.orders, color: "#66bb6a" },
            { title: "المنتجات المتوفرة", value: stats.products, color: "#ef5350" },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", backgroundColor: theme.palette.background.paper, borderTop: `4px solid ${card.color}` }}>
                <Typography variant="h6" color="text.secondary">{card.title}</Typography>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: "bold", mt: 1 }}>{card.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* 📈 رسم بياني (لم يتم تغييره) */}
        <Paper elevation={3} sx={{ p: 3, height: 450, backgroundColor: theme.palette.background.paper }}>
          {/* ... (باقي كود الشارت كما هو) */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
            مقارنة أداء المستخدمين والطلبات
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip contentStyle={{
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.background.paper,
                border: `1px solid ${theme.palette.secondary.main}`,
                borderRadius: 8,
              }} itemStyle={{ color: theme.palette.text.primary }} />
              <Line type="monotone" dataKey="users" stroke={theme.palette.secondary.main} strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="orders" stroke="#FFD700" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
