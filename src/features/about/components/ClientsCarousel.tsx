function ClientsCarousel() {
  const partners = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <section id="partner" className="overflow-hidden max-w-screen">
      <div className="mx-auto py-10 flex flex-col justify-center items-center gap-10">
        <h2 className="text-5xl font-bold text-primary-100 mb-5 border-b-4 border-primary-100">
          Nuestros Clientes
        </h2>
        <div className="w-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-100 bg-gradient-to-r from-white-100 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-100 bg-gradient-to-l from-white-100 to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-infinite-scroll-seamless gap-10">
            {partners.map((item) => (
              <div
                key={`copy1-${item}`}
                className="flex justify-center items-center bg-bg-100 h-50 w-50 rounded-2xl flex-shrink-0 hover:scale-90 transition-transform duration-300"
              >
                <img
                  src={`partners/partner0${item}.png`}
                  alt={`Partner ${item}`}
                  className="h-20 object-contain"
                />
              </div>
            ))}

            {partners.map((item) => (
              <div
                key={`copy2-${item}`}
                className="flex justify-center items-center bg-bg-100 h-50 w-50 rounded-2xl flex-shrink-0 hover:scale-90 transition-transform duration-300"
              >
                <img
                  src={`partners/partner0${item}.png`}
                  alt={`Partner ${item}`}
                  className="h-20 object-contain"
                />
              </div>
            ))}

            {partners.map((item) => (
              <div
                key={`copy3-${item}`}
                className="flex justify-center items-center bg-bg-100 h-50 w-50 rounded-2xl flex-shrink-0 hover:scale-90 transition-transform duration-300"
              >
                <img
                  src={`partners/partner0${item}.png`}
                  alt={`Partner ${item}`}
                  className="h-20 object-contain"
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
