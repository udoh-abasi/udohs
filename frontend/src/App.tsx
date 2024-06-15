import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Pages/Header";
import HomePage from "./Pages/HomePage";
import Footer from "./Pages/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
