import IconoComida from "../assets/images/cat_comida.svg?react";
import IconoCompras from "../assets/images/cat_compras.svg?react";
import IconoCuentasYPagos from "../assets/images/cat_cuentas-y-pagos.svg?react";
import IconoDiversion from "../assets/images/cat_diversion.svg?react";
import IconoHogar from "../assets/images/cat_hogar.svg?react";
import IconoRopa from "../assets/images/cat_ropa.svg?react";
import IconoSaludEHigiene from "../assets/images/cat_salud-e-higiene.svg?react";
import IconoTransporte from "../assets/images/cat_transporte.svg?react";

const CategoryICon = ({ id }: { id: string }) => {
  switch (id) {
    case "food":
      return <IconoComida />;
    case "shopping":
      return <IconoCompras />;
    case "debt":
      return <IconoCuentasYPagos />;
    case "fun":
      return <IconoDiversion />;
    case "home":
      return <IconoHogar />;
    case "clothes":
      return <IconoRopa />;
    case "health":
      return <IconoSaludEHigiene />;
    case "transport":
      return <IconoTransporte />;
    default:
      return <IconoCompras />;
  }
};

export default CategoryICon;
