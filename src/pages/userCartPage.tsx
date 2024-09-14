import Nav from "../components/Nav";
import UserCart from "../components/UserCart";
import Footer from "../components/Footer";
import { UserProvider } from "../hooks/UserContext";

const UserCartpage = () => {
  return (
    <UserProvider>
      <Nav />
      <UserCart />
      <Footer />
    </UserProvider>
  );
};

export default UserCartpage;
