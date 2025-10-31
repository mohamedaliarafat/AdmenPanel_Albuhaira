import React, { useEffect, useState, useContext } from "react";
import api from "../services/api"; // ✅ تصحيح المسار الصحيح
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
} from "@mui/material";
import {
  Language as LanguageIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { ColorModeContext } from "../App"; // ✅ تأكد أن App.jsx فيه ColorModeContext
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 📊 بيانات الشارت التجريبية
const chartData = [
  { name: "يناير", users: 400, orders: 240 },
  { name: "فبراير", users: 300, orders: 139 },
  { name: "مارس", users: 200, orders: 980 },
  { name: "أبريل", users: 278, orders: 390 },
  { name: "مايو", users: 189, orders: 480 },
  { name: "يونيو", users: 239, orders: 380 },
];

const DashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
  const [error, setError] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [language, setLanguage] = useState("ar");

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  // 🔄 جلب الإحصائيات من API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("يرجى تسجيل الدخول أولاً.");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [usersRes, ordersRes, productsRes] = await Promise.all([
          api.get("/users", config),
          api.get("/orders", config),
          api.get("/products", config),
        ]);

        setStats({
          users: usersRes.data.length || 0,
          orders: ordersRes.data.length || 0,
          products: productsRes.data.length || 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "حدث خطأ أثناء جلب البيانات 😢"
        );
      }
    };

    fetchStats();
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 🔹 الشريط العلوي */}
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            لوحة التحكم السعودية 🇸🇦
          </Typography>

          {/* 🌙 زر تبديل الوضع */}
          <FormControlLabel
            control={
              <Switch
                checked={theme.palette.mode === "dark"}
                onChange={colorMode.toggleColorMode}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#66bb6a",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#66bb6a",
                  },
                }}
              />
            }
            labelPlacement="start"
            label={
              <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                {theme.palette.mode === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
              </Typography>
            }
          />

          {/* 🌐 اختيار اللغة */}
          <IconButton color="inherit" onClick={handleOpenLangMenu}>
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElLang}
            open={Boolean(anchorElLang)}
            onClose={handleCloseLangMenu}
          >
            <MenuItem
              onClick={() => handleLanguageChange("ar")}
              selected={language === "ar"}
            >
              العربية
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange("en")}
              selected={language === "en"}
            >
              English
            </MenuItem>
          </Menu>

          {/* 👤 بروفايل المستخدم */}
          <IconButton color="inherit" onClick={handleOpenUserMenu} sx={{ ml: 2 }}>
            <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
          </IconButton>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>الملف الشخصي</MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>الإعدادات</MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>تسجيل الخروج</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* 🧾 محتوى الصفحة */}
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold", color: theme.palette.text.primary }}
        >
          نظرة عامة على الأداء
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {/* 🔸 بطاقات الإحصائيات */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {[
            { title: "إجمالي المستخدمين", value: stats.users, color: "#FFD700" },
            { title: "الطلبات المنجزة", value: stats.orders, color: "#66bb6a" },
            { title: "المنتجات المتوفرة", value: stats.products, color: "#ef5350" },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: theme.palette.background.paper,
                  borderTop: `4px solid ${card.color}`,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography
                  variant="h3"
                  color="primary.main"
                  sx={{ fontWeight: "bold", mt: 1 }}
                >
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* 📈 رسم بياني */}
        <Paper
          elevation={3}
          sx={{ p: 3, height: 450, backgroundColor: theme.palette.background.paper }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            مقارنة أداء المستخدمين والطلبات
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.dark
                      : theme.palette.background.paper,
                  border: `1px solid ${theme.palette.secondary.main}`,
                  borderRadius: 8,
                }}
                itemStyle={{ color: theme.palette.text.primary }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#FFD700"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
