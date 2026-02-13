import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    CircularProgress
} from '@mui/material';
import agent from '../api/agent';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Category } from '../types/models';

export default function EditPostPage() {
    // HOOK: URL'den ID'yi al
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // STATE: Kategoriler
    const [categories, setCategories] = useState<Category[]>([]);

    // STATE: Form Verileri
    // publishedDate ve urlHandle'ı da saklıyoruz ki güncellerken kaybolmasınlar.
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        imageUrl: '',
        urlHandle: '',
        publishedDate: '' // Tarihi korumak için
    });

    // STATE: Yükleniyor durumu
    const [loading, setLoading] = useState(true);

    // EFFECT: Verileri (Kategoriler + Post Detayı) Çek
    useEffect(() => {
        // Promise.all ile ikisini paralel çekebiliriz veya ardışık yapabiliriz.
        // Hata yönetimi kolay olsun diye ayrı ayrı bloklarda yapıyorum.

        const fetchData = async () => {
            if (!id) return;

            try {
                // 1. Kategorileri çek
                const categoryData = await agent.Categories.list();
                setCategories(categoryData);

                // 2. Post detayını çek
                const postData = await agent.Posts.details(id);

                // Formu doldur (State'i güncelle -> Pre-fill)
                setFormData({
                    title: postData.title,
                    content: postData.content,
                    categoryId: postData.categoryId.toString(), // Select value string bekler
                    imageUrl: postData.featuredImageUrl || '',
                    urlHandle: postData.urlHandle,
                    publishedDate: postData.publishedDate
                });

                setLoading(false);
            } catch (error) {
                console.error("Veri yükleme hatası:", error);
                toast.error("Sayfa yüklenirken hata oluştu.");
                navigate('/'); // Hata varsa anasayfaya at
            }
        };

        fetchData();
    }, [id, navigate]);

    // HANDLER: Input değişimi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // HANDLER: Select değişimi
    const handleSelectChange = (e: SelectChangeEvent) => {
        setFormData({ ...formData, categoryId: e.target.value });
    };

    // HANDLER: Form Submit (Update)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validasyon
        if (!formData.title || !formData.content || !formData.categoryId) {
            toast.error("Başlık, içerik ve kategori zorunludur.");
            return;
        }

        try {
            // Update için DTO hazırlığı
            const postToUpdate = {
                id: id, // ID opsiyonel olabilir ama garanti olsun
                title: formData.title,
                content: formData.content,
                categoryId: parseInt(formData.categoryId),
                featuredImageUrl: formData.imageUrl,
                urlHandle: formData.urlHandle, // Handle'ı değiştirmeden (veya kullanıcıdan istemeden) eski haliyle yolluyoruz
                isVisible: true,
                publishedDate: formData.publishedDate || new Date().toISOString(), // Eski tarih varsa koru
                authorName: "Admin" // TODO: Auth gelince kullanıcıdan alınacak
            };

            // API Update Çağrısı
            if (id) {
                await agent.Posts.update(id, postToUpdate);
                toast.success("Yazı başarıyla güncellendi!");
                navigate(`/post/${id}`); // Detay sayfasına geri dön
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            toast.error("Güncelleme sırasında hata oluştu.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Veriler Yükleniyor...</Typography>
            </Box>
        );
    }

    // Tasarım CreatePostPage ile neredeyse aynı
    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Yazıyı Düzenle
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>

                    {/* BAŞLIK */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Yazı Başlığı"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    {/* KATEGORİ */}
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="category-label">Kategori</InputLabel>
                        <Select
                            labelId="category-label"
                            id="categoryId"
                            value={formData.categoryId}
                            label="Kategori"
                            onChange={handleSelectChange} // Form verisi string, Select string bekler
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* RESİM URL */}
                    <TextField
                        margin="normal"
                        fullWidth
                        id="imageUrl"
                        label="Görsel URL"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        helperText="Örn: https://source.unsplash.com/random"
                    />

                    {/* İÇERİK */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="content"
                        label="İçerik"
                        id="content"
                        multiline
                        rows={10}
                        value={formData.content}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Değişiklikleri Kaydet
                    </Button>

                    {/* Vazgeç Butonu */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(`/post/${id}`)}
                    >
                        İptal
                    </Button>

                </Box>
            </Paper>
        </Container>
    );
}
