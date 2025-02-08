import Image from "next/image";
import Header from "./Components/Header";
import Products from "./Components/Products";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Products />
      <Footer />
    </div>
  );
}
