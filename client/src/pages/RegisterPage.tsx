import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from '../api/agent';
import { type UserRegister } from '../types/models';
import { isAxiosError } from 'axios';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserRegister>({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            // API'ye kayıt isteği atıyoruz
            await agent.Auth.register(formData);
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            navigate('/login');
        } catch (err: unknown) {
            // Hata mesajını kullanıcıya göster
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Bir hata oluştu');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Beklenmedik bir hata oluştu');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Kayıt Ol</h2>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Kullanıcı Adı:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>E-posta:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Şifre:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Kayıt Ol
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Zaten hesabınız var mı? <a href="/login">Giriş Yap</a>
            </p>
        </div>
    );
}
