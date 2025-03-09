import Header from "./Components/Header";
import Products from "./Components/Products";
import Footer from "./Components/Footer";
import Buscador from "./Components/Buscador";

export default function Home() {
  return (
    <div>
      <Header />
      <Buscador />
      <Products />
      <Footer />
    </div>
  );
}
