import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./utils/Header";
import HomePage from "./Pages/HomePage";
import Footer from "./utils/Footer";
import AllItems from "./Pages/AllItems";
import ItemDisplay from "./Pages/ItemDisplay";
import Chat from "./Pages/Chat";
import ChatScreen from "./Pages/ChatScreen";
import UserProfile from "./Pages/UserProfile";
import Sell from "./Pages/Sell";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/items" element={<AllItems />} />

          <Route path="/item" element={<ItemDisplay />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/chat/1" element={<ChatScreen />} />

          <Route path="/user" element={<UserProfile />} />

          <Route path="/sell" element={<Sell />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
