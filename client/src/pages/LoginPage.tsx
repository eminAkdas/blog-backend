import { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import agent from '../api/agent';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
    // HOOKS: React'in özelliklerini fonksiyonel bileşenlerde kullanmamızı sağlar.

    // useNavigate: Sayfalar arası geçiş yapmak için kullanılır (Link'in programatik hali).
    const navigate = useNavigate();

    // Custom Hook: Kendi yazdığımız AuthContext'ten veri çekiyoruz.
    const { login } = useAuth();

    // STATE: Bileşenin hafızasıdır. Buradaki veri değişince React sayfayı (ilgili kısmı) yeniden çizer.
    // formData bir obje olduğu için başlangıç değeri olarak boş stringler verdik.
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Event Handler: Inputlara her harf yazıldığında çalışır.
    // Bu yapıya "Controlled Component" denir; inputun değeri State tarafından yönetilir.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ...formData (Spread Operator): Mevcut diğer verileri koru (örn: password değişirken email kaybolmasın).
        // [e.target.name]: Dinamik key kullanımı. Inputun name'i "email" ise formData.email güncellenir.
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault(): Formun varsayılan davranışını (sayfa yenileme) engeller.
        // Böylece SPA (Single Page Application) mantığını koruruz.
        e.preventDefault();
        try {
            // ASYNC/AWAIT: API'ye istek atarken cevap gelene kadar beklememiz gerekir.
            // await kullanmazsak kod beklemeden alt satıra geçer ve response undefined olur.
            const response = await agent.Auth.login(formData);

            // Başarılıysa Context'i güncelle (Token'ı kaydet)
            // API direkt string (token) döndüğü için response'un kendisini kullanıyoruz.
            console.log("Login Response:", response);
            login(response);
            toast.success("Giriş başarılı!");

            // Kullanıcıyı anasayfaya yönlendir
            navigate('/');
        } catch (error) {
            // Hata varsa kullanıcıya göster (Try-Catch bloğu uygulamanın çökmesini engeller)
            console.error(error);
            toast.error("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Giriş Yap
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-Posta Adresi"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            // Value ve OnChange bağlayarak "Two-way data binding" yapıyoruz.
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Şifre"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Giriş Yap
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
