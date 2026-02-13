import { AppBar, Toolbar, Typography, Container, Button, Box } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import { useAuth } from "../context/AuthContext"; // Context'i içeri al
import { useNavigate, Link } from "react-router-dom"; // Link ve Yönlendirme için
import { toast } from "react-toastify";


export default function NavBar() {
    const { user, logout } = useAuth(); // Yayın kulesinden bilgileri çek
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
        toast.success("Çıkış yapıldı!");
    }

    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* LOGO */}
                    <BookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link} // Tıklanınca anasayfaya git
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        🤣😂😅😆🤪😜😝
                    </Typography>

                    {/* SAĞ TARAF BUTONLAR */}
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>

                        {/* 1. Herkesin Göreceği Buton */}
                        <Button color="inherit" component={Link} to="/">
                            Anasayfa
                        </Button>

                        {/* 2. ŞARTLI GÖSTERİM (Sihir Burada) */}
                        {user ? (
                            // EĞER KULLANICI VARSA BUNLARI GÖSTER:
                            <>
                                <Button color="inherit" component={Link} to="/create-post">
                                    Yazı Ekle (+New)
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    Çıkış ({user.email.split('@')[0]})
                                </Button>
                            </>
                        ) : (
                            // EĞER KULLANICI YOKSA BUNLARI GÖSTER:
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Giriş Yap
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Kayıt Ol
                                </Button>
                            </>
                        )}

                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}