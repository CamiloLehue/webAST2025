import { useBreakpoints } from "../../../context/ProviderBreakpoints";

function CardNav() {
  const menuItems = [
    {
      title: "Satelital",
      icon: "🛰️",
    },
    {
      title: "Drones",
      icon: "🛸",
    },
    {
      title: "RoIP",
      icon: "📡",
    },
    {
      title: "Network IP",
      icon: "🌐",
    },
    {
      title: "Wisensor",
      icon: "WISENSOR",
    },
    {
      title: "Seguridad",
      icon: "📶",
    },
    {
      title: "Datacenter",
      icon: "🖥️",
    },
    {
      title: "Energía Renovable",
      icon: "🌱",
    },
    {
      title: "Wisensor IA",
      icon: "🤖",
    },
    {
      title: "Software",
      icon: "💻",
    },
    {
      title: "IoT",
      icon: "📶",
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
            : "flex justify-center items-center  gap-10"
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
                     ? "relative w-25 h-25 rounded-2xl flex justify-center items-center "
                     : " w-full h-40"
                 }
                `}
            >
              {item.icon}
            </div>
            <p className="text-nowrap font-bold">{item.title}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CardNav;
