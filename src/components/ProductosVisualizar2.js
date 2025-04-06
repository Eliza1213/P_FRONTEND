import ProductosList from "./ProductosList";
import FooterUser from "./FooterUser";

const ProductosVisualizar2 = () => {
  const isUserAuthenticated = !!localStorage.getItem("token");

  return (
    <>
      <ProductosList isUserAuthenticated={isUserAuthenticated} modo="publico" />
      <FooterUser />
    </>
  );
};

export default ProductosVisualizar2;