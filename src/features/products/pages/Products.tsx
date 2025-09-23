function Products() {
  return (
    <div className="w-full h-full relative flex flex-col justify-start items-start">
      <section className="bg-black h-70 w-full flex flex-col justify-start pt-10 items-center text-white gap-5">
        <h1 className="text-3xl font-bold">Productos Disponibles</h1>
        <p className="text-lg leading-6 max-w-2xl text-center font-light">
          Tecnologías de alto rendimiento seleccionadas para potenciar la
          seguridad, eficiencia y sostenibilidad de tu operación.
        </p>
      </section>
      <section id="cardNav" className="relative  w-full pb-20">
        <div
          className="absolute left-0 -top-20  w-full h-100  bg-white-100 "
          style={{
            clipPath: "ellipse(83% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative ">
          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-10 px-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white p-5 rounded-2xl shadow-md ">
                <div className="w-full h-60 mb-4 bg-white-100 rounded-xl flex justify-center items-center">
                  <img src={`/src/`} alt={`Producto ${item}`} />
                </div>
                <small>Marca</small>
                <h2 className="text-xl font-semibold mb-2">Producto {item}</h2>
                <p className="text-bg-200 line-through">
                  ${(item * 120).toFixed(3)}
                </p>
                <h3 className="text-bg-200 text-3xl font-bold">
                  ${(item * 100).toFixed(3)}{" "}
                  <span className="text-xl">+ iva</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
