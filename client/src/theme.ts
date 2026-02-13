import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e", // Deep Indigo - Premium ve Kurumsal
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e91e63", // Pink - Enerjik ve Dikkat Çekici
      light: "#ff6090",
      dark: "#b0003a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa", // Çok hafif gri (Göz yormayan arka plan)
      paper: "#ffffff",
    },
    text: {
      primary: "#2b2b2b", // Tam siyah değil, yumuşak koyu gri
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // Buton metinlerini hepsi büyük harf yapma
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Modern yuvarlak köşeler
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)", // Hover'da yukarı kalkma efekti
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 24px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(26, 35, 126, 0.4)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default theme;
