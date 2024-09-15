import Nav from "../components/Nav";
import ProductBuyingPage from "../components/UserProducts";
import Footer from "../components/Footer";
import { UserProvider } from "../hooks/UserContext";

const UserProductsPage = () => {
  return (
    <UserProvider>
      <Nav />
      <ProductBuyingPage />
      <Footer />
    </UserProvider>
  );
};

export default UserProductsPage;
