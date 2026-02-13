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
    type SelectChangeEvent
} from '@mui/material';
import agent from '../api/agent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Category } from '../types/models';

export default function CreatePostPage() {
    // HOOK: Sayfalar arası programatik geçiş (örn: işlem bitince anasayfaya gitme)
    const navigate = useNavigate();

    // STATE: Kategorileri API'den çekip burada saklayacağız.
    // Başlangıç değeri boş dizi [] çünkü map fonksiyonu null/undefined üzerinde çalışmaz.
    const [categories, setCategories] = useState<Category[]>([]);

    // STATE: Formdaki tüm alanları tek bir obje içinde yönetiyoruz.
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        imageUrl: '',
        urlHandle: ''
    });

    // EFFECT: "Component Did Mount" mantığı.
    // Sayfa ilk kez ekrana geldiğinde çalışır (Dependency array [] boş olduğu için).
    // Burada drop-down için kategorileri API'den çekiyoruz.
    useEffect(() => {
        agent.Categories.list()
            .then(data => setCategories(data))
            .catch(error => {
                console.error("Kategoriler çekilemedi:", error);
                toast.error("Kategori listesi yüklenemedi!");
            });
    }, []);

    // HANDLER: TextField (Input) değişikliklerini yakalar.
    // "Computed Property Name" [e.target.name] kullanarak hangi field'ın değiştiğini dinamik anlarız.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // HANDLER: Material UI Select bileşeni için özel handler.
    // Select bileşeni HTML input'tan biraz farklı event fırlatır, bu yüzden tipini ayırdık.
    const handleSelectChange = (e: SelectChangeEvent) => {
        setFormData({ ...formData, categoryId: e.target.value });
    };

    // HANDLER: Form gönderme işlemi.
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Sayfa yenilenmesini engelle (SPA Prensibi)

        // Basit Validasyon: Kullanıcı boş alan bırakmış mı?
        if (!formData.title || !formData.content || !formData.categoryId) {
            toast.error("Lütfen başlık, içerik ve kategori alanlarını doldurun.");
            return;
        }

        try {
            // DTO (Data Transfer Object) Hazırlığı:
            // API'nin beklediği format ile formdaki format farklı olabilir (örn: string -> int dönüşümü).
            const postToCreate = {
                title: formData.title,
                content: formData.content,
                categoryId: parseInt(formData.categoryId), // Formda string duruyordu, API int istiyor.
                featuredImageUrl: formData.imageUrl,
                // URL Handle'ı başlıktan otomatik üretiyoruz (örn: "Merhaba Dünya" -> "merhaba-dunya")
                urlHandle: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                isVisible: true,
                publishedDate: new Date().toISOString(),
                authorName: "Admin"
            };

            // API İsteği (Create işlemi)
            await agent.Posts.create(postToCreate);

            // Başarılı senaryo:
            toast.success("Yazı başarıyla oluşturuldu!");
            navigate('/'); // Anasayfaya gönder
        } catch (error) {
            // Hata senaryosu:
            console.error("Yazı oluşturma hatası:", error);
            toast.error("Yazı oluşturulurken bir hata oluştu.");
        }
    };

    return (
        <Container maxWidth="md">
            {/* Paper: Kağıt benzeri beyaz arka plan ve gölge efekti sağlar */}
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Yeni Yazı Ekle
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>

                    {/* BAŞLIK ALANI */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Yazı Başlığı"
                        name="title"
                        autoFocus
                        value={formData.title}     // Two-way binding
                        onChange={handleChange}    // State güncelleme
                    />

                    {/* KATEGORİ SEÇİMİ (DROPDOWN) */}
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="category-label">Kategori</InputLabel>
                        <Select
                            labelId="category-label"
                            id="categoryId"
                            value={formData.categoryId}
                            label="Kategori"
                            onChange={handleSelectChange} // Özel handler kullandık
                        >
                            {/* API'den gelen kategorileri map ile dönerek listeliyoruz */}
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* RESİM URL ALANI */}
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

                    {/* İÇERİK ALANI (MULTILINE) */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="content"
                        label="İçerik"
                        id="content"
                        multiline // Çok satırlı olacağını belirtir
                        rows={6}  // Başlangıçta 6 satır yükseklik
                        value={formData.content}
                        onChange={handleChange}
                    />

                    {/* KAYDET BUTONU */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Yazıyı Kaydet
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
