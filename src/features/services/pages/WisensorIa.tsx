import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";

function WisensorIa() {
  return (
    <div className="w-full min-h-screen">
      <section className="relative h-screen">
      <img src="" alt="" />
      </section>

      <section className="relative h-130">
        <div
          className="absolute left-0 -top-0  w-full h-130  bg-primary-100 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center text-white px-5">
          <h1 className="text-center text-5xl font-bold mt-20">
            ¿Tienes dudas? Contáctanos{" "}
          </h1>
          <div className="grid grid-cols-2 gap-10 w-full py-10 text-black">
            <article className=" bg-white rounded-2xl h-80  border border-dashed border-bg-300/10  mb-4 flex flex-col justify-center items-center gap-5">
              <TbPhoneFilled className="text-8xl text-primary-100" />

              <p className="text-center text-xl max-w-lg">
                Llámenos al{" "}
                <span className="text-primary-100 font-semibold">
                  +56 2 3366 3478
                </span>{" "}
                ||{" "}
                <span className="text-primary-100 font-semibold">
                  +56 2 3366 3478
                </span>{" "}
                . Nuestros expertos están a su disposición 09:30 - 19:30 de
                lunes a viernes.
              </p>
            </article>
            <article className=" bg-white rounded-2xl h-80 border border-dashed border-bg-300/10 rounded-2lg mb-4 flex flex-col justify-center items-center gap-5">
              <TbMailFilled className="text-8xl text-primary-100" />
              <p className="text-center text-xl max-w-xl">
                Puede contactarse con nosotros en nuestro email{" "}
                <span className="text-primary-100 font-semibold">
                  ventas@ast.cl.
                </span>
                Nuestros expertos están a su disposición 09:30 - 19:30 de lunes
                a viernes.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WisensorIa;
