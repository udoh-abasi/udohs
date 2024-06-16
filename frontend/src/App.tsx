import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Pages/Header";
import HomePage from "./Pages/HomePage";
import Footer from "./Pages/Footer";
import AllItems from "./Pages/AllItems";
import ItemDisplay from "./Pages/ItemDisplay";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        <Routes>
          <Route path="/items" element={<AllItems />} />
        </Routes>

        <Routes>
          <Route path="/item" element={<ItemDisplay />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
