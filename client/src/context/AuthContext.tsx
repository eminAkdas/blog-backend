import { createContext, useContext, useState, type ReactNode } from 'react';
import { type User } from '../types/models';

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT'nin içindeki verileri (Payload) okumak için yardımcı fonksiyon
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // Uygulama açıldığında localStorage'a bak (Lazy Initialization)
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken) {
                return {
                    email: decodedToken.email || decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                    token: token
                };
            } else {
                localStorage.removeItem('token');
            }
        }
        return null;
    });

    const login = (token: string) => {
        console.log("AuthContext: Login called with token:", token);
        localStorage.setItem('token', token);
        const decodedToken = parseJwt(token);
        console.log("AuthContext: Decoded Token:", decodedToken);

        if (decodedToken) {
            const userObj = {
                email: decodedToken.email || decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decodedToken["email"],
                token: token
            };
            console.log("AuthContext: Setting user:", userObj);
            setUser(userObj);
        } else {
            console.error("AuthContext: Token decoding failed!");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook olarak dışarı açıyoruz, kullanımı kolay olsun
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
