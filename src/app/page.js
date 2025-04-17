import Header from "./Components/Header";
import Products from "./Components/Products";
import Footer from "./Components/Footer";
import Buscador from "./Components/Buscador";
import Categorias from "./Components/Categorias";
import HeaderWithSession from "./Components/HeaderWithSession";

export default function Home() {
  return (
    <div>
      <HeaderWithSession />
      <Buscador />
      <Categorias />
      <Products />
      <Footer />
    </div>
  );
}
