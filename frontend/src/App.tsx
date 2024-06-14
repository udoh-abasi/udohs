import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Pages/Header";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
