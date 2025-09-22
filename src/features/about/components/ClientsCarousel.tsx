function ClientsCarousel() {
  const partners = [
    {
      name: "AquaChile",
      logo: "img/inicio/clientes/aqua-chile.jpg",
    },
    {
      name: "Caleta Bay",
      logo: "img/inicio/clientes/caleta-bay.jpg",
    },
    {
      name: "Cermaq",
      logo: "img/inicio/clientes/cermaq.jpg",
    },
    {
      name: "Corfo",
      logo: "img/inicio/clientes/corfo.png",
    },
    {
      name: "Cultivos Yadran",
      logo: "img/inicio/clientes/cultivos-yadran.jpg",
    },
    {
      name: "Marine Farm",
      logo: "img/inicio/clientes/marine-farm.jpg",
    },
    {
      name: "Marine Harvest",
      logo: "img/inicio/clientes/marine-harvest.jpg",
    },
    {
      name: "Mowi",
      logo: "img/inicio/clientes/mowi.png",
    },
    {
      name: "MultiExports",
      logo: "img/inicio/clientes/multiexports.jpg",
    },
    {
      name: "Salmones Austral",
      logo: "img/inicio/clientes/salmones-austral.jpg",
    },
    {
      name: "Salmones Aysén",
      logo: "img/inicio/clientes/salmones-aysen.jpg",
    },
    {
      name: "Salmones Humboldt",
      logo: "img/inicio/clientes/salmones-humboldt.jpg",
    },
    {
      name: "Super Salmon",
      logo: "img/inicio/clientes/supersalmon.jpg",
    },
    {
      name: "Trusal",
      logo: "img/inicio/clientes/trusal.jpg",
    },
  ];

  return (
    <section id="partner" className="relative overflow-hidden max-w-screen ">
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white  to-transparent  pointer-events-none"></div>
      <div className="relative mx-auto py-10 flex flex-col justify-center items-center gap-10">
        <h2 className="text-5xl font-bold text-primary-100 mb-5 border-b-4 border-primary-100">
          Nuestros Clientes
        </h2>
        <div className="w-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-100 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-100 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-infinite-scroll-seamless gap-10">
            {partners.map((item) => (
              <div
                key={`copy1-${item.name}`}
                className="flex justify-center items-center  h-50 w-50 rounded-2xl flex-shrink-0 hover:scale-90 transition-transform duration-300"
              >
                <img
                  src={item.logo}
                  alt={`Partner ${item.name}`}
                  className="h-20 object-contain mix-blend-multiply"
                />
              </div>
            ))}

            {partners.map((item) => (
              <div
                key={`copy2-${item.name}`}
                className="flex justify-center items-center  h-50 w-50 rounded-2xl flex-shrink-0 hover:scale-90 transition-transform duration-300"
              >
                <img
                  src={item.logo}
                  alt={`Partner ${item.name}`}
                  className="h-20 object-contain mix-blend-multiply"
                />
              </div>
            ))}

            {partners.map((item) => (
              <div
                key={`copy3-${item.name}`}
                className="flex justify-center items-center  h-50 w-50 rounded-2xl flex-shrink-0 hover:scale-90 transition-transform duration-300"
              >
                <img
                  src={item.logo}
                  alt={`Partner ${item.name}`}
                  className="h-20 object-contain mix-blend-multiply"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientsCarousel;
