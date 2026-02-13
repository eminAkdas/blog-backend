import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Container } from "@mui/material";

function App() {
  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

export default App;