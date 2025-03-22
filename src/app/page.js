import Header from "./Components/Header";
import Products from "./Components/Products";
import Footer from "./Components/Footer";
import Buscador from "./Components/Buscador";
import Categorias from "./Components/Categorias";

export default function Home() {
  return (
    <div>
      <Header />
      <Buscador />
      <Categorias />
      <Products />
      <Footer />
    </div>
  );
}
