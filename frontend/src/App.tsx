import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Header from "./utils/Header";
import HomePage from "./Pages/HomePage";
import Footer from "./utils/Footer";
import AllItems from "./Pages/AllItems";
import ItemDisplay from "./Pages/ItemDisplay";
import Chat from "./Pages/Chat";
import ChatScreen from "./Pages/ChatScreen";
import UserProfile from "./Pages/UserProfile";
import Sell from "./Pages/Sell";
import Bag from "./Pages/Bag";
import PageNotFound from "./utils/PageNotFound";
import { useSelector } from "react-redux";
import { userSelector } from "./reduxFiles/selectors";
import Search from "./Pages/Search";

const PrivateRoute = () => {
  const user = useSelector(userSelector);

  // So if we have a user or the user is loading, we return the JSX, else we navigate to the home page
  return user.userData || user.userLoading ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/items" element={<AllItems />} />

          <Route path="/item/:productID" element={<ItemDisplay />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/chat/1" element={<ChatScreen />} />

          <Route path="/user" element={<PrivateRoute />}>
            <Route path="/user" element={<UserProfile />} />
          </Route>

          <Route path="/sell" element={<Sell />} />

          <Route path="/bag" element={<PrivateRoute />}>
            <Route path="/bag" element={<Bag />} />
          </Route>

          <Route path="/search" element={<Search />} />

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
