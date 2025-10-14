import { useNavigate } from "react-router";
import { useBreakpoints } from "../../../context/ProviderBreakpoints";

function CardNav() {
  const menuItems = [
    {
      title: "Satelital",
      icon: "/svg/inicio/navHome/Satelital.svg",
      url: "/satelital",
    },
    // {
    //   title: "Drones",
    //   icon: "svg/inicio/navHome/Drone.svg",
    // },
    {
      title: "RoIP",
      icon: "svg/inicio/navHome/cell_tower.svg",
      url: "/roip",
    },
    // {
    //   title: "Network IP",
    //   icon: "svg/inicio/navHome/Network.svg",
    // },
    {
      title: "Wisensor",
      icon: "svg/inicio/navHome/Wisensor.svg",
      url: "/wisensor",
    },
    {
      title: "Seguridad",
      icon: "svg/inicio/navHome/Seguridad.svg",
      url: "/seguridad",
    },
    {
      title: "Datacenter",
      icon: "svg/inicio/navHome/Data center.svg",
      url: "/datacenter",
    },
    // {
    //   title: "Energía Renovable",
    //   icon: "svg/inicio/navHome/renovable.svg",
    // },
    {
      title: "Wisensor IA",
      icon: "svg/inicio/navHome/Wisensor.svg",
      url: "/wisensor-ia",
    },
    {
      title: "Software",
      icon: "svg/inicio/navHome/code_blocks.svg",
      url: "/software",
    },
    {
      title: "IoT",
      icon: "svg/inicio/navHome/captive_portal.svg",
      url: "/iot",
    },
  ];

  const { isSmallDevice } = useBreakpoints();
  const navigate = useNavigate();
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
            onClick={() => navigate(item.url)}
            className={`relative group
                cursor-pointer flex flex-col gap-5 justify-center items-center hover:scale-105 transition-all duration-300
                ${!isSmallDevice ? "" : ""}
                `}
          >
            <div
              className={`group bg-primary-100 border-t border-t-transparent font-bold transition-colors duration-300 
                text-white group-hover:bg-gradient-to-bl group-hover:from-primary-100 group-hover:to-orange-500 group-hover:border-t-orange-300
                group-hover:shadow-xl group-hover:shadow-orange-500/20
                 ${
                   !isSmallDevice
                     ? "relative w-25 h-25 rounded-2xl flex justify-center items-center p-3 "
                     : " w-full h-40"
                 }
                `}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-85 transition-all duration-500"
              />
            </div>
            <p className="text-nowrap font-bold">{item.title}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CardNav;
