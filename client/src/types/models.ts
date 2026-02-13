// Backend'deki PostDto
export interface Post {
    id: number;
    title: string;
    content: string;
    urlHandle: string;
    featuredImageUrl: string;
    isVisible: boolean;
    publishedDate: string;
    categoryName: string;
    categoryId: number;
    authorName: string;
}

export interface CreatePost {
    title: string;
    content: string;
    urlHandle: string;
    featuredImageUrl: string;
    isVisible: boolean;
    categoryId: number;
    publishedDate: string;
}

export interface UpdatePost {
    title: string;
    content: string;
    urlHandle: string;
    featuredImageUrl: string;
    isVisible: boolean;
    categoryId: number;
    publishedDate: string;
}

// Backend'deki CategoryDto
export interface Category {
    id: number;
    name: string;
    description: string;
}

// Backend'deki User (Login cevabı vb. için)
export interface User {
    email: string;
    token: string;
}

export interface UserLogin {
    email: string;
    password?: string;
}

export interface UserRegister {
    email: string;
    password?: string;
    username: string; // Backend'de Identity kullanıyorsak UserName önemlidir
}