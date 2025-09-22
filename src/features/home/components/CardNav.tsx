import { useBreakpoints } from "../../../context/ProviderBreakpoints";

function CardNav() {
  const menuItems = [
    {
      title: "Satelital",
      icon: "/svg/inicio/navHome/Satelital.svg",
    },
    {
      title: "Drones",
      icon: "svg/inicio/navHome/Drone.svg",
    },
    {
      title: "RoIP",
      icon: "svg/inicio/navHome/cell_tower.svg",
    },
    {
      title: "Network IP",
      icon: "svg/inicio/navHome/Network.svg",
    },
    {
      title: "Wisensor",
      icon: "svg/inicio/navHome/Wisensor.svg",
    },
    {
      title: "Seguridad",
      icon: "svg/inicio/navHome/Seguridad.svg",
    },
    {
      title: "Datacenter",
      icon: "svg/inicio/navHome/Data center.svg",
    },
    {
      title: "Energía Renovable",
      icon: "svg/inicio/navHome/renovable.svg",
    },
    {
      title: "Wisensor IA",
      icon: "svg/inicio/navHome/WisensorIA.svg",
    },
    {
      title: "Software",
      icon: "svg/inicio/navHome/code_blocks.svg",
    },
    {
      title: "IoT",
      icon: "svg/inicio/navHome/captive_portal.svg",
    },
  ];

  const { isSmallDevice } = useBreakpoints();
  return (
    <div
      className={`absolute left-[50%] top-0 -translate-x-1/2 
        ${isSmallDevice ? "w-full" : " max-w-7xl  mx-auto"}
    `}
    >
      <div
        className={` ${
          isSmallDevice
            ? "grid grid-cols-3 gap-2"
            : "flex justify-center items-center  gap-9"
        }`}
      >
        {menuItems.map((item, index) => (
          <article
            key={index}
            className={`relative
                cursor-pointer flex flex-col gap-5 justify-center items-center hover:scale-105 transition-all duration-300
                ${!isSmallDevice ? "" : ""}
                `}
          >
            <div
              className={` bg-primary-100  font-bold text-white
                 ${
                   !isSmallDevice
                     ? "relative w-25 h-25 rounded-2xl flex justify-center items-center p-3 "
                     : " w-full h-40"
                 }
                `}
            >
              <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-nowrap font-bold">{item.title}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CardNav;
