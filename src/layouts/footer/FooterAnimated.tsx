import { useMenuNavItems } from "../hooks/useMenuNavItems";
import { StaggerContainer, StaggerItem, FadeInSection } from "../../components/animations";

function Footer() {
  const { menuItems } = useMenuNavItems();
  return (
    <footer className="relative bottom-0 w-full min-h-110 bg-bg-200 flex flex-col justify-between items-center">
      <StaggerContainer className="max-w-7xl mx-auto w-full h-full grid grid-cols-4 gap-20 py-10 text-white-100">
        <StaggerItem className="flex flex-col gap-5">
          <div className="w-full border-b border-white-100">
            <h4 className="text-base font-bold py-5">
              AST Technology Networks
            </h4>
          </div>
          <p className="leading-6 text-sm font-light">
            Diseñamos e implementamos soluciones de comunicación, conectividad y
            software para sectores exigentes, combinando innovación constante
            con un profundo conocimiento técnico.
          </p>
        </StaggerItem>
        <StaggerItem className="flex flex-col gap-5">
          <div className="w-full border-b border-white-100">
            <h4 className="text-base font-bold py-5">Nuestros Servicios</h4>
          </div>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="py-1">
                <a
                  href={item.path}
                  className="text-sm font-light text-white-100 hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </StaggerItem>
        <StaggerItem className="flex flex-col gap-5">
          <div className="w-full border-b border-white-100">
            <h4 className="text-base font-bold py-5">Productos</h4>
          </div>
          <ul>
            {[
              "Monocular Termal S243W",
              "Monocular Termal S253",
              "Radar Spotterrf C40",
            ].map((item, index) => (
              <li key={index} className="py-1">
                <a
                  href="#"
                  className="text-sm font-light text-white-100 hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </StaggerItem>
        <StaggerItem className="flex flex-col gap-5">
          <div className="w-full border-b border-white-100">
            <h4 className="text-base font-bold py-5">Contáctanos</h4>
          </div>
          <div className="flex flex-col gap-1">
            <p className="leading-6 text-sm font-light">
              <span className="font-semibold">Dirección:</span> Camino El Tepual
              Km 1 Puerto Monttm, Chile
            </p>
            <p className="leading-6 text-sm font-light">
              <span className="font-semibold">Teléfono:</span> +56 2 3366 3478
            </p>
            <p className="leading-6 text-sm font-light">
              <span className="font-semibold">Correo:</span> ventas@ast.cl
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>
      <FadeInSection className="w-full py-4 bg-bg-100">
        <div className="max-w-7xl mx-auto flex justify-start items-center">
          <p className="text-sm text-white-100">
            Copyright &copy; 2025 AST Technology Networks.
          </p>
        </div>
      </FadeInSection>
    </footer>
  );
}

export default Footer;