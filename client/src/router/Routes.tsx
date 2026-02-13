import { createBrowserRouter } from "react-router-dom";
import CreatePostPage from "../pages/CreatePostPage";
import EditPostPage from "../pages/EditPostPage";
import PostDetailPage from "../pages/PostDetailPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import App from "../App";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // Layout (NavBar burada)
        children: [
            {
                path: "", // index route (/)
                element: <HomePage />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register",
                element: <RegisterPage />
            },
            {
                path: "create-post",
                element: <CreatePostPage />
            },
            {
                path: "post/edit/:id", // Düzenleme Rotası
                element: <EditPostPage />
            },
            {
                path: "post/:id", // :id dinamik parametredir
                element: <PostDetailPage />
            }
        ]
    }
])
