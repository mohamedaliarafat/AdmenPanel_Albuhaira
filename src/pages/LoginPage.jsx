import React, { useState } from 'react';
import api from '../services/api';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  InputAdornment,
  Alert,
  IconButton,
  Fab,
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LanguageIcon from '@mui/icons-material/Language';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// 💡 لا حاجة لاستيراد الشعار من ملف محلي الآن
// import LogoImage from '../assets/al_buhaira_logo.png';

// 💡 رابط وهمي للشعار (قم بتغييره إلى رابط شعار شركتك الحقيقي)
const LOGO_URL = 'https://example.com/your-al-buhaira-logo.png';

const themes = {
    light: {
      primaryColor: '#3498db',
      darkTextColor: '#2c3e50',
      subtleBackground: '#f9f7f7',
      cardBackground: 'white',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 5px rgba(0, 0, 0, 0.05)',
    },
    dark: {
      primaryColor: '#8e44ad',
      darkTextColor: '#ecf0f1',
      subtleBackground: '#1c1c1c',
      cardBackground: '#2c3e50',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.2)',
    },
  };
  
  const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('ar');
    const countryCode = '+966'; 
  
    const currentTheme = isDarkMode ? themes.dark : themes.light;
    const { primaryColor, darkTextColor, subtleBackground, cardBackground, boxShadow } = currentTheme;
  
    const toggleTheme = () => setIsDarkMode(prev => !prev);
    const toggleLanguage = () => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  
    const texts = {
      ar: {
        title1: 'تسجيل دخول لوحة التحكم',
        title2: 'إتمام عملية الدخول',
        phoneLabel: 'رقم الجوال',
        phonePlaceholder: '5xxxxxxxx',
        sendButton: 'إرسال رمز التحقق',
        otpLabel: 'الرمز السري (OTP)',
        otpSent: (code, num) => `تم إرسال رمز التحقق إلى **${code} ${num}**.`,
        verifyButton: 'تحقق وادخل',
        changePhone: 'تغيير رقم الجوال',
        errorPhone: 'الرجاء إدخال رقم جوال صحيح.',
        errorOtp: 'الرجاء إدخال رمز تحقق صحيح.',
        errorFail: 'فشل العملية. يرجى المحاولة لاحقاً.',
      },
      en: {
        title1: 'Admin Panel Login',
        title2: 'Complete Login Process',
        phoneLabel: 'Phone Number',
        phonePlaceholder: '5xxxxxxxxx',
        sendButton: 'Send OTP Code',
        otpLabel: 'Secret Code (OTP)',
        otpSent: (code, num) => `OTP code sent to **${code} ${num}**.`,
        verifyButton: 'Verify & Enter',
        changePhone: 'Change Phone Number',
        errorPhone: 'Please enter a valid phone number.',
        errorOtp: 'Please enter a valid verification code.',
        errorFail: 'Operation failed. Please try again later.',
      },
    };
    const T = texts[language];
  
    const sendOTP = async () => {
      if (!phone || phone.length < 8) {
        setError(T.errorPhone);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fullPhone = countryCode + phone;
        await api.post('/auth/send-otp', { phone: fullPhone }); 
        setStep(2);
      } catch (err) {
        setError(err.response?.data?.message || T.errorFail);
      } finally {
        setLoading(false);
      }
    };
  
    const verifyOTP = async () => {
      if (!otp || otp.length < 6) {
        setError(T.errorOtp);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fullPhone = countryCode + phone;
        const res = await api.post('/auth/verify-otp', { phone: fullPhone, code: otp });
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.response?.data?.message || T.errorFail);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: subtleBackground,
        p: 3,
        direction: language === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {/* -------------------- مُحولات اللغة والمظهر في الزاوية العلوية -------------------- */}
      <Box sx={{ position: 'absolute', top: 16, [language === 'ar' ? 'left' : 'right']: 16 }}>
        <IconButton onClick={toggleLanguage} sx={{ color: darkTextColor }}>
          <LanguageIcon />
        </IconButton>
        <IconButton onClick={toggleTheme} sx={{ color: darkTextColor, ml: 1 }}>
          {isDarkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      {/* -------------------- مكان الشعار -------------------- */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        {/* 💡 الصورة كشعار باستخدام مسار الإنترنت */}
        <img 
          src={"https://www2.0zz0.com/2025/10/29/12/948587246.png"}
          alt="Al-Buhaira Al-Arabia Logo" 
          style={{ 
            width: "65%",        // تجعل الصورة تأخذ عرض الحاوية بالكامل
            height: "100",        // تحافظ على التناسب بين العرض والارتفاع
            maxWidth: "400px",     // أقصى عرض (يمكنك تغييره لما يناسبك)
            display: "block",      // يمنع الفراغات أسفل الصورة
            margin: "0 auto", 
            marginBottom: 30     // يوسّط الصورة أفقيًا
          }}
        />

        {/* 💡 النص تحت الشعار */}
        <Typography 
            variant="h4"
            sx={{ fontWeight: 800, color: darkTextColor, letterSpacing: 2 }}
        >
            <span style={{ color: primaryColor }}>Al-Buhaira</span> Al-Arabia
        </Typography>
      </Box>

      {/* -------------------- بطاقة الدخول -------------------- */}
      <Card
        sx={{
          maxWidth: 450,
          width: '90%',
          padding: { xs: 2, md: 4 },
          boxShadow: boxShadow, 
          borderRadius: 4,
          backgroundColor: cardBackground,
        }}
      >
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: darkTextColor, mb: 3 }}
          >
            {step === 1 ? T.title1 : T.title2}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
          )}

          {/* -------------------- الخطوة 1: إدخال رقم الجوال -------------------- */}
          {step === 1 && (
            <Box>
              <TextField
                label={T.phoneLabel}
                fullWidth
                margin="normal"
                variant="outlined"
                type="tel"
                placeholder={T.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                sx={{ mb: 3, input: { color: darkTextColor }, label: { color: darkTextColor } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneIcon sx={{ color: primaryColor }} />
                      <Typography sx={{ ml: 1, fontWeight: 'medium', color: darkTextColor }}>
                        {countryCode}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button 
                variant="contained" 
                onClick={sendOTP} 
                fullWidth
                disabled={loading || !phone}
                sx={{ 
                  mt: 1, 
                  py: 1.5, 
                  fontSize: '1rem', 
                  backgroundColor: primaryColor,
                  '&:hover': { backgroundColor: primaryColor, opacity: 0.9 },
                  borderRadius: 2,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : T.sendButton}
              </Button>
            </Box>
          )}

          {/* -------------------- الخطوة 2: إدخال رمز التحقق -------------------- */}
          {step === 2 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: T.otpSent(countryCode, phone) }} />
              
              <TextField
                label={T.otpLabel}
                fullWidth
                margin="normal"
                variant="outlined"
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                sx={{ mb: 2, input: { color: darkTextColor }, label: { color: darkTextColor } }}
                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px' } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockOpenIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                    ),
                }}
              />
              
              <Button 
                variant="contained" 
                onClick={verifyOTP} 
                fullWidth
                disabled={loading || otp.length < 6} 
                sx={{ 
                    mt: 1, 
                    py: 1.5, 
                    fontSize: '1rem',
                    backgroundColor: primaryColor,
                    '&:hover': { backgroundColor: primaryColor, opacity: 0.9 },
                    borderRadius: 2,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : T.verifyButton}
              </Button>
              
              <Button 
                variant="text" 
                onClick={() => setStep(1)} 
                sx={{ mt: 2, color: darkTextColor }}
                fullWidth
              >
                {T.changePhone}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* -------------------- زر المحادثة العائم -------------------- */}
      <Fab
        color="secondary"
        aria-label="chat"
        sx={{
          position: 'absolute',
          bottom: 24,
          [language === 'ar' ? 'right' : 'left']: 24,
          backgroundColor: primaryColor,
          '&:hover': { backgroundColor: primaryColor, opacity: 0.8 },
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
        }}
      >
        <ChatBubbleOutlineIcon />
      </Fab>

    </Box>
  );
};

export default LoginPage;