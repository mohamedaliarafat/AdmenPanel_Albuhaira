import React, { useState } from 'react';
import api from '../services/api';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Box,
    Alert,
    IconButton,
    Fab,
    keyframes,
    // 🎯 المكونات الجديدة للنافذة الحوارية والخطوات
    Dialog, 
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Link,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info'; // أيقونة للخطوات التعريفية
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // أيقونة للمساعدة

// 1. تعريف الحركة (Keyframe) للخلفية المائلة
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 2. تحديث نظام الألوان ليتناسب مع المظهر الكحلي/الداكن
const themes = {
    light: {
        primaryColor: '#0d47a1', // كحلي عميق
        secondaryColor: '#1e88e5', // أزرق متوسط
        darkTextColor: '#2c3e50',
        subtleBackground: '#e3f2fd',
        cardBackground: 'white',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)',
    },
    dark: {
        primaryColor: '#1976d2', // أزرق كحلي متوسط (للزخرفة)
        secondaryColor: '#4fc3f7', // أزرق فاتح (Accent Color)
        darkTextColor: '#e0e0e0',
        subtleBackground: '#0a1929', // كحلي داكن جداً للخلفية
        cardBackground: '#162b46', // كحلي متوسط للبطاقة
        boxShadow: '0 15px 40px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.1)',
    },
};

// ------------------------------------------------
// 🎯 مكون النافذة الحوارية التعريفية الجديدة
// ------------------------------------------------
const IntroDialog = ({ open, handleClose, theme, language }) => {
    const [activeStep, setActiveStep] = useState(0);

    const T = (language === 'ar' ? {
        title: 'مرحباً بك! هل تحتاج إلى مساعدة؟',
        steps: [
            { label: 'ما هي خدماتنا؟', content: 'نحن نقدم منصة متكاملة لإدارة كشوف المرتبات والموارد البشرية في المملكة، مع تركيز على الدقة والامتثال للأنظمة المحلية.' },
            { label: 'كيف يتم التسجيل؟', content: 'يتم التسجيل عن طريق إدخال رقم الجوال المعتمد، وستتلقى رمز تحقق (OTP) في رسالة نصية، ثم قم بإدخاله لإكمال الدخول.' },
            { label: 'فريق الدعم الفني', content: (
                <Box>
                    <Typography>إذا واجهت أي مشكلة، يرجى التواصل معنا:</Typography>
                    <Link href="mailto:support@albuhaira.com" color={theme.secondaryColor} sx={{ display: 'block', mt: 1 }}>support@albuhaira.com</Link>
                    <Link href="tel:+96650000000" color={theme.secondaryColor} sx={{ display: 'block' }}>+966 50 000 000</Link>
                </Box>
            ) },
        ],
        next: 'التالي',
        back: 'السابق',
        finish: 'إنهاء',
    } : {
        title: 'Welcome! Do you need any assistance?',
        steps: [
            { label: 'What are our services?', content: 'We offer a complete platform for managing payroll and HR resources in the Kingdom, focusing on accuracy and compliance with local regulations.' },
            { label: 'How to register/login?', content: 'Login is done by entering your approved phone number, you will receive an OTP code via SMS, then enter it to complete the login.' },
            { label: 'Technical Support Team', content: (
                <Box>
                    <Typography>If you encounter any issues, please contact us:</Typography>
                    <Link href="mailto:support@albuhaira.com" color={theme.secondaryColor} sx={{ display: 'block', mt: 1 }}>support@albuhaira.com</Link>
                    <Link href="tel:+96650000000" color={theme.secondaryColor} sx={{ display: 'block' }}>+966 50 000 000</Link>
                </Box>
            ) },
        ],
        next: 'Next',
        back: 'Back',
        finish: 'Finish',
    });

    const steps = T.steps.map(step => step.label);
    const maxSteps = steps.length;

    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const handleFinish = () => {
        setActiveStep(0);
        handleClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleFinish} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ 
                sx: { 
                    backgroundColor: theme.cardBackground, 
                    color: theme.darkTextColor,
                    direction: language === 'ar' ? 'rtl' : 'ltr',
                    borderRadius: 3,
                }
            }}
        >
            <DialogTitle sx={{ color: theme.secondaryColor, fontWeight: 'bold' }}>
                <HelpOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                {T.title}
            </DialogTitle>
            <DialogContent dividers>
                <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 3 }}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel sx={{ '& .MuiStepIcon-root': { color: theme.primaryColor, '&.Mui-active': { color: theme.secondaryColor } } }}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Paper elevation={0} sx={{ p: 3, backgroundColor: theme.subtleBackground, borderRadius: 2 }}>
                    <Typography sx={{ color: theme.darkTextColor }}>
                        {T.steps[activeStep].content}
                    </Typography>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ color: theme.darkTextColor, '&:hover': { backgroundColor: theme.darkTextColor + '10' } }}
                >
                    {T.back}
                </Button>
                {activeStep === maxSteps - 1 ? (
                    <Button onClick={handleFinish} variant="contained" sx={{ backgroundColor: theme.primaryColor, '&:hover': { backgroundColor: theme.primaryColor, opacity: 0.9 } }}>
                        {T.finish}
                    </Button>
                ) : (
                    <Button onClick={handleNext} variant="contained" sx={{ backgroundColor: theme.secondaryColor, '&:hover': { backgroundColor: theme.secondaryColor, opacity: 0.9 } }}>
                        {T.next}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

// ------------------------------------------------
// 🎯 مكون LoginPage
// ------------------------------------------------
const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [language, setLanguage] = useState('en'); 
    // 🎯 حالة النافذة الحوارية الجديدة
    const [openIntro, setOpenIntro] = useState(false);

    const theme = isDarkMode ? themes.dark : themes.light;
    const { primaryColor, secondaryColor, darkTextColor, subtleBackground, cardBackground, boxShadow } = theme;

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    const toggleLanguage = () => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
    const handleOpenIntro = () => setOpenIntro(true);
    const handleCloseIntro = () => setOpenIntro(false);

    // نصوص التوطين (كما هي)
    const texts = { /* ... النصوص كما هي ... */
        ar: {
            title1: 'تسجيل دخول لوحة التحكم',
            title2: 'إتمام عملية الدخول',
            phoneLabel: 'رقم الجوال',
            sendButton: 'إرسال رمز التحقق',
            otpLabel: 'الرمز السري (OTP)',
            otpSent: (num) => `تم إرسال رمز التحقق إلى ${num}.`,
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
            sendButton: 'Send OTP Code',
            otpLabel: 'Secret Code (OTP)',
            otpSent: (num) => `OTP code sent to ${num}.`,
            verifyButton: 'Verify & Enter',
            changePhone: 'Change Phone Number',
            errorPhone: 'Please enter a valid phone number.',
            errorOtp: 'Please enter a valid verification code.',
            errorFail: 'Operation failed. Please try again later.',
        },
    };
    const T = texts[language];

    // (دوال API كما هي)
    const handleSendOTP = async () => {
      if (!phone || phone.length < 8) {
        setError(T.errorPhone);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await api.post('/auth/send-otp', { phone: `+${phone}` });
        setStep(2);
      } catch (err) {
        setError(err.response?.data?.message || T.errorFail);
      } finally {
        setLoading(false);
      }
    };

    const handleVerifyOTP = async () => {
      if (!otp || otp.length !== 6) {
        setError(T.errorOtp);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await api.post('/auth/verify-otp', { phone: `+${phone}`, code: otp });
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.response?.data?.message || T.errorFail);
      } finally {
        setLoading(false);
      }
    };

    // ------------------------------------------------
    // Styles for PhoneInput customization (تنسيق RTL)
    // ------------------------------------------------
    const phoneInputStyles = {
        inputStyle: {
            width: '100%',
            height: 55,
            fontSize: '1rem',
            backgroundColor: cardBackground,
            color: darkTextColor,
            borderColor: darkTextColor + '30',
            transition: 'border-color 0.3s',
            borderRadius: '8px',
            direction: language === 'ar' ? 'ltr' : 'ltr',
        },
        buttonStyle: {
            backgroundColor: cardBackground,
            border: `1px solid ${darkTextColor}30`,
            borderRadius: language === 'ar' ? '0 8px 8px 0' : '8px 0 0 8px',
            marginRight: language === 'ar' ? '0' : '0', 
            marginLeft: language === 'ar' ? '5px' : '0', 
        },
        dropdownStyle: {
            backgroundColor: cardBackground, 
            color: darkTextColor,
            border: `1px solid ${primaryColor}`,
            borderRadius: '8px',
            boxShadow: boxShadow,
            direction: language === 'ar' ? 'rtl' : 'ltr',
        },
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                direction: language === 'ar' ? 'rtl' : 'ltr',

                // تطبيق الخلفية المتحركة المبهجة
                background: `linear-gradient(270deg, ${subtleBackground} 0%, ${isDarkMode ? '#0d1620' : '#bbdefb'} 50%, ${secondaryColor}15 100%)`,
                backgroundSize: '400% 400%',
                animation: `${gradientAnimation} 15s ease infinite`,
                color: darkTextColor,

                // تأثير الإشعاع الخفيف حول المركز
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at center, ${primaryColor}05 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }
            }}
        >
            {/* Toggle Language & Theme */}
            <Box sx={{ position: 'absolute', top: 16, [language === 'ar' ? 'left' : 'right']: 16 }}>
                <IconButton onClick={toggleLanguage} sx={{ color: darkTextColor }}>
                    <LanguageIcon />
                </IconButton>
                <IconButton onClick={toggleTheme} sx={{ color: darkTextColor, ml: 1 }}>
                    {isDarkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
                </IconButton>
            </Box>

            {/* Logo and Title */}
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <img
                    src="https://www2.0zz0.com/2025/10/29/12/948587246.png"
                    alt="Al-Buhaira Logo"
                    style={{ width: '65%', height: 210, maxWidth: 400, display: 'block', margin: '0 auto', marginBottom: 20 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 800, color: darkTextColor, letterSpacing: 2 }}>
                    <span style={{ color: secondaryColor }}>Al-Buhaira</span> Al-Arabia
                </Typography>
            </Box>

            {/* Login Card */}
            <Card
                sx={{
                    maxWidth: 450,
                    width: '90%',
                    padding: { xs: 2, md: 4 },
                    boxShadow: boxShadow,
                    borderRadius: 4,
                    backgroundColor: cardBackground,
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: 10,
                    '&:hover': {
                        transform: 'translateY(-5px)',
                    }
                }}
            >
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: darkTextColor, mb: 4, borderBottom: `2px solid ${primaryColor}`, pb: 1 }}>
                        {step === 1 ? T.title1 : T.title2}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    {/* Step 1: Phone */}
                    {step === 1 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ mb: 1, color: darkTextColor, fontWeight: 'medium' }}>{T.phoneLabel}</Typography>
                            <Box className={language === 'ar' ? 'phone-input-rtl-fix' : ''}> 
                                <PhoneInput
                                    country={'sa'}
                                    value={phone}
                                    onChange={setPhone}
                                    enableSearch
                                    inputStyle={{...phoneInputStyles.inputStyle, direction: 'ltr'}}
                                    buttonStyle={phoneInputStyles.buttonStyle}
                                    dropdownStyle={phoneInputStyles.dropdownStyle}
                                    containerStyle={{ marginBottom: 16 }}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                onClick={handleSendOTP}
                                fullWidth
                                disabled={loading || !phone}
                                endIcon={!loading && <LoginIcon />}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    backgroundColor: secondaryColor, 
                                    '&:hover': { backgroundColor: secondaryColor, opacity: 0.9, boxShadow: `0 5px 15px ${secondaryColor}30` },
                                    borderRadius: 2,
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : T.sendButton}
                            </Button>
                        </Box>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, color: darkTextColor, backgroundColor: darkTextColor + '10' }}>
                                {T.otpSent(`+${phone}`)}
                            </Alert>
                            <TextField
                                label={T.otpLabel}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type="number"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: 8, color: primaryColor, direction: 'ltr' } }}
                                InputProps={{
                                    startAdornment: <VpnKeyIcon sx={{ mr: 1, color: primaryColor }} />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderColor: primaryColor,
                                        '&.Mui-focused fieldset': {
                                            borderColor: primaryColor,
                                        },
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleVerifyOTP}
                                fullWidth
                                disabled={loading || otp.length !== 6}
                                endIcon={!loading && <LockOpenIcon />}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    backgroundColor: secondaryColor,
                                    '&:hover': { backgroundColor: secondaryColor, opacity: 0.9, boxShadow: `0 5px 15px ${secondaryColor}30` },
                                    borderRadius: 2,
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : T.verifyButton}
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setStep(1)}
                                sx={{ mt: 3, color: darkTextColor, opacity: 0.7 }}
                                fullWidth
                            >
                                {T.changePhone}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Floating Chat Button - تم ربط الزر بالنافذة الجديدة */}
            <Fab
                color="secondary"
                aria-label="chat"
                onClick={handleOpenIntro} // 🎯 ربط الدالة الجديدة هنا
                sx={{
                    position: 'absolute',
                    bottom: 24,
                    [language === 'ar' ? 'right' : 'left']: 24,
                    backgroundColor: secondaryColor,
                    '&:hover': { backgroundColor: secondaryColor, opacity: 0.8 },
                    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                }}
            >
                <ChatBubbleOutlineIcon />
            </Fab>

            {/* 🎯 إضافة مكون النافذة الحوارية هنا */}
            <IntroDialog 
                open={openIntro} 
                handleClose={handleCloseIntro} 
                theme={theme} 
                language={language} 
            />
        </Box>
    );
};

export default LoginPage;