import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CardMedia, Box, Button, Divider, CircularProgress, Chip, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import agent from '../api/agent';
import { type Post } from '../types/models';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PostDetailPage() {
    // HOOK: URL'deki parametreleri okumak için kullanılır.
    // Router'da "/post/:id" dediğimiz için burada "id" key'i ile yakalarız.
    const { id } = useParams<{ id: string }>();

    // HOOK: Sayfalar arası geçiş için
    const navigate = useNavigate();

    // STATE: Post verisini tutacak. Veri gelene kadar null olabilir.
    const [post, setPost] = useState<Post | null>(null);

    // STATE: Yükleniyor durumunu kontrol etmek için.
    const [loading, setLoading] = useState(true);

    // EFFECT: Sayfa açıldığında veya ID değiştiğinde çalışır.
    useEffect(() => {
        if (id) {
            // API'den tekil post verisini çek
            agent.Posts.details(id)
                .then(gelenPost => {
                    setPost(gelenPost);
                    setLoading(false); // Yükleme bitti
                })
                .catch(error => {
                    console.error('Yazı getirilemedi:', error);
                    setLoading(false); // Hata olsa da yüklemeyi bitir
                });
        }
    }, [id]); // Dependency Array: "id" değişirse effect tekrar çalışsın.

    // HANDLER: Silme İşlemi
    const handleDelete = () => {
        if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
            if (id) {
                agent.Posts.delete(id)
                    .then(() => {
                        toast.success("Yazı başarıyla silindi.");
                        navigate('/'); // Anasayfaya yönlendir
                    })
                    .catch(error => {
                        console.error("Silme hatası:", error);
                        toast.error("Yazı silinemedi.");
                    });
            }
        }
    };

    // Yükleniyor Durumu: Veri henüz gelmediyse kullanıcıya bilgi ver.
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Yazı Yükleniyor...</Typography>
            </Box>
        );
    }

    // Hata Durumu: Yükleme bitti ama post boşsa (örn: hatalı ID).
    if (!post) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography variant="h4">Yazı bulunamadı!</Typography>
                <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    Anasayfaya Dön
                </Button>
            </Container>
        );
    }

    // Başarılı Durum: Post verisiyle sayfayı çiz.
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
            {/* Navigasyon */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 4, color: 'text.secondary' }}
            >
                Tüm Yazılara Dön
            </Button>

            <article>
                {/* 1. Başlık Alanı */}
                <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
                    {post.title}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, mt: 3 }}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {post.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(post.publishedDate).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                    </Box>
                    <Chip label={post.categoryName} color="primary" variant="outlined" size='small' />
                </Stack>

                {/* 2. Kapak Resmi */}
                <CardMedia
                    component="img"
                    image={post.featuredImageUrl || "https://source.unsplash.com/random?technology"}
                    alt={post.title}
                    sx={{
                        borderRadius: 4,
                        mb: 6,
                        maxHeight: '500px',
                        objectFit: 'cover',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                    }}
                />

                {/* 3. İçerik */}
                <Typography variant="body1" sx={{ fontSize: '1.25rem', lineHeight: 2, color: '#2b2b2b', mb: 8 }}>
                    {post.content}
                </Typography>
            </article>

            <Divider />

            {/* Buton Grubu: Düzenle ve Sil */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/post/edit/${post.id}`)}
                >
                    Düzenle
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                >
                    Yazıyı Sil
                </Button>
            </Box>
        </Container>
    );
}
