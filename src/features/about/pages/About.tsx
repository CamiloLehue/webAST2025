import ClientsCarousel from "../components/ClientsCarousel";

function About() {
  return (
    <div className="relative w-full ">
      <section
        id="hero"
        className="relative w-full h-120 bg-black flex flex-col justify-center items-center gap-5"
      >
        <div className="relative h-full w-full">
          <img
            src="img/about/hero/hero.jpg"
            alt="Hero Image"
            className="object-cover w-full h-full"
          />
          <div>
            <div className="absolute inset-0 bg-gradient-to-t from-black from-1% to-transparent flex flex-col justify-center items-center gap-5"></div>
          </div>
        </div>
        <div className="absolute z-20 w-full max-w-7xl text-white flex flex-col justify-start items-start gap-3">
          <h1 className=" text-4xl  font-bold  text-center ">
            Tecnología que transforma industrias
          </h1>
          <p className="max-w-xl text-lg">
            Diseñamos e implementamos soluciones de comunicación, conectividad y
            software para sectores exigentes, combinando innovación constante
            con un profundo conocimiento técnico.
          </p>
        </div>
      </section>
      <section className="relative h-190 bg-black pt-10">
        <div className="relative w-full max-w-7xl mx-auto text-white">
          <div className="grid grid-cols-2 gap-10">
            <div className="h-90 bg-accent-200 rounded-2xl">
              <img
                src="img/about/ast-network-personal.jpg"
                alt="Nosotros 1"
                className="object-cover w-full h-full rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-3 p-5">
              <h2 className="text-3xl font-bold">AST NETWORKS</h2>
              <p className="text-lg leading-7">
                AST Networks es una empresa con más de 20 años de experiencia en
                Computación e Informática, destacada por su innovación y
                capacidad de adaptación tecnológica. Ha evolucionado de ofrecer
                soporte técnico en redes a proveer soluciones integrales en
                telecomunicaciones, incluyendo Internet satelital, seguridad
                industrial y desarrollo de software. Su enfoque actual es
                entregar servicios personalizados que respondan a las crecientes
                demandas de Tecnologías de la Información y Comunicaciones
                (TIC).
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative h-40 ">
        <div
          className="absolute left-0 -top-25  w-full h-100  bg-white-100 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative w-full max-w-6xl mx-auto  -top-50 grid grid-cols-2 gap-5">
          <article className="relative w-full rounded-4xl h-70 bg-white-100 shadow-lg">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40">
              <img src="svg/about/objetivos.svg" alt="" />
            </div>
            <div className="flex justify-center items-center w-full h-full p-10">
              <p className="leading-6 text-lg">
                “Somos el nexo de innovación tecnológica con nuestros clientes,
                a través de soluciones modernas y en constante desarrollo.
                Generamos valor a sus procesos proporcionándoles diariamente un
                servicio personalizado de excelencia”.
              </p>
            </div>
          </article>
          <article className="relative w-full rounded-4xl h-70 bg-white-100 shadow-lg">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40">
              <img src="svg/about/Vision.svg" alt="" />
            </div>
            <div className="flex justify-center items-center w-full h-full p-10">
              <p className="leading-6 text-lg">
                “Ser reconocidos por nuestros actuales y potenciales clientes
                como líderes en la investigación y desarrollo de nuevas
                tecnologías de la información, por los altos estándares de
                calidad en la entrega de soluciones y el permanente compromiso
                personal con nuestros grupos de interés”.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="relative w-full mb-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center ">
          <div className="w-full h-120 bg-black rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/fI-tzs7NnNE?si=HCiO3OqtZgFZsa4r"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
          <div className=" border-b-2 border-bg-300/10 px-10 py-5 rounded-b-2xl shadow-xl ">
            <h3 className="text-2xl font-bold text-primary-100 text-center px-10">
              Video Corporativo
            </h3>
          </div>
        </div>
      </section>
      <section className="relative w-full mb-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center ">
          <div className="w-full h-100 bg-black rounded-2xl overflow-hidden">
            <img
              src="img/about/infraestructuras.jpg"
              alt="Infraestructuras"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="grid grid-cols-3 w-[90%] shadow-xl rounded-b-2xl">
            <div className="p-10">
              <img src="svg/about/Mapa.svg" alt="Mapa" />
            </div>
            <div className="col-span-2  p-10 flex flex-col gap-5">
              <h3 className="text-3xl font-bold text-primary-100">
                Sede Central, Puerto Montt
              </h3>
              <p className="leading-6 text-lg">
                AST Networks, a montado su base de operaciones en la ciudad de
                Puerto Montt, donde hoy opera la mayoría de sus clientes. Dado
                la antigüedad en la zona y los lazos de confianza que hemos
                logrado, nos da la tranquilidad de poder desarrollar y hacer
                mayores esfuerzos en apoyo tecnológico de la mano con quienes
                nos ha preferido por todos estos años. Nuestras oficinas se
                alojan en un nuevo y moderno edificio ecológico, aplicando
                nuestro conocimiento y tecnología, haciendo de este nuestro
                sello de innovación que por años no ha caracterizado.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative w-full mb-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-12 gap-5 text-white">
          <article className="col-span-4 h-70 rounded-2xl bg-primary-100 p-10 flex flex-col items-start justify-start pt-20  gap-3">
            <h3 className="text-7xl font-black">25 AÑOS</h3>
            <p className="text-xl">
              De experiencia en computación e informática
            </p>
          </article>
          <article className="col-span-4 h-70 rounded-2xl bg-primary-100 p-10 flex flex-col items-start justify-start pt-20  gap-3">
            <h3 className="text-7xl font-black">1000+</h3>
            <p className="text-xl">Sistema y Cámaras activas</p>
          </article>
          <article className="col-span-4 h-70 rounded-2xl bg-primary-100 p-10 flex flex-col items-start justify-start pt-20  gap-3">
            <h3 className="text-7xl font-black">35+</h3>
            <p className="text-xl">Personal por todo Chile</p>
          </article>
          <article className="col-span-5 h-70 rounded-2xl bg-primary-100 p-10 flex flex-col items-start justify-start pt-20  gap-3">
            <h3 className="text-7xl font-black">13 Partners</h3>
            <p className="text-xl">De renombre internacional</p>
          </article>
          <article className="col-span-4 h-70 rounded-2xl bg-primary-100 p-10 flex flex-col items-start justify-start pt-20  gap-3">
            <h3 className="text-7xl font-black">10+</h3>
            <p className="text-xl">
              Proyectos de integración y seguridad en todo Chile
            </p>
          </article>
          <article className="col-span-3 h-70 rounded-2xl bg-gradient-to-tr from-orange-400 from-30% to-purple-500 p-10 pt-20 flex flex-col items-start justify-start gap-3">
            <h3 className="text-7xl font-black">IA</h3>
            <p className="text-xl">Implementación de tecnologías de IA</p>
          </article>
        </div>
      </section>
      <section className="relative w-full mb-30">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center ">
          <div className="w-full">
            <h3 className="text-5xl text-primary-100 font-black text-left uppercase py-10">
              Nuestro Equipo
            </h3>
          </div>
          <div className="w-full h-100 bg-black rounded-2xl overflow-hidden">
            <img
              src="img/about/infraestructuras.jpg"
              alt="Infraestructuras"
              className="w-full h-full object-cover "
            />
          </div>
          <div>
            <p className=" leading-6 text-lg mt-5">
              Dado la integración que ofrecemos en nuestros servicios, hemos
              creado un staff de técnicos con una alto grado de especialización
              en todas las lineas de servicios; energía, telecomunicaciones
              Wifi, satelital, Video seguridad, etc. Hemos decidido tomar todas
              las variables de problemas para entregar una solución integral y
              completa, sin duda esto nos a dado una ventaja frente a nuestros
              competidores. AST en su logística es complementado con una flota
              de vehículos nuevos que están en permanente desplazamiento en la
              región, lo que nos permite llegar mas pronto cuando el cliente nos
              requiere.
            </p>
          </div>
        </div>
      </section>
      <section className="relative h-110 ">
        <div
          className="absolute left-0 -top-0  w-full h-120  bg-primary-100 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative w-full max-w-7xl mx-auto  -top-20 grid grid-cols-5 gap-2">
          <article className="relative bg-slate-800 shadow w-full h-100 rounded-2xl overflow-hidden">
            <div
              className="absolute left-0 -top-10  w-full h-95 bg-white "
              style={{
                clipPath: "ellipse(90% 45% at 50% 45%)",
              }}
            ></div>
            <div className="relative w-full h-full bg-gradient-to-b from-white to-transparent p-5">
              <div className="w-full h-45 ">
                <img
                  src="img/about/infraestructuras.jpg"
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center items-center py-5">
                <h3 className="text-xl font-bold text-primary-100 ">
                  Eduardo Rivera
                </h3>
                <p className="text-lg">Gerente General</p>
              </div>
              <div className="flex flex-col justify-center items-start gap-1 text-white py-5 ps-3 ">
                <p className="leading-6 text-lg flex justify-center items-center gap-1">
                  <span>
                    <img
                      src="svg/base/TELEFONO.svg"
                      alt="telefono"
                      className="w-4"
                    />
                  </span>
                  +56 9 9020 8452
                </p>
                <p className="leading-6 text-lg flex justify-center items-center gap-2">
                  <span>
                    <img
                      src="svg/base/Correo.svg"
                      alt="correo"
                      className="w-4"
                    />
                  </span>
                  erivera@ast.cl
                </p>
              </div>
            </div>
          </article>
          <article className="relative bg-slate-800 shadow w-full h-100 rounded-2xl overflow-hidden">
            <div
              className="absolute left-0 -top-10  w-full h-95 bg-white "
              style={{
                clipPath: "ellipse(90% 45% at 50% 45%)",
              }}
            ></div>
            <div className="relative w-full h-full bg-gradient-to-b from-white to-transparent p-5">
              <div className="w-full h-45 ">
                <img
                  src="img/about/infraestructuras.jpg"
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center items-center py-5">
                <h3 className="text-xl font-bold text-primary-100 ">
                  Eduardo Rivera
                </h3>
                <p className="text-lg">Gerente General</p>
              </div>
              <div className="flex flex-col justify-center items-start gap-1 text-white py-5 ps-3 ">
                <p className="leading-6 text-lg flex justify-center items-center gap-1">
                  <span>
                    <img
                      src="svg/base/TELEFONO.svg"
                      alt="telefono"
                      className="w-4"
                    />
                  </span>
                  +56 9 9020 8452
                </p>
                <p className="leading-6 text-lg flex justify-center items-center gap-2">
                  <span>
                    <img
                      src="svg/base/Correo.svg"
                      alt="correo"
                      className="w-4"
                    />
                  </span>
                  erivera@ast.cl
                </p>
              </div>
            </div>
          </article>
          <article className="relative bg-slate-800 shadow w-full h-100 rounded-2xl overflow-hidden">
            <div
              className="absolute left-0 -top-10  w-full h-95 bg-white "
              style={{
                clipPath: "ellipse(90% 45% at 50% 45%)",
              }}
            ></div>
            <div className="relative w-full h-full bg-gradient-to-b from-white to-transparent p-5">
              <div className="w-full h-45 ">
                <img
                  src="img/about/infraestructuras.jpg"
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center items-center py-5">
                <h3 className="text-xl font-bold text-primary-100 ">
                  Eduardo Rivera
                </h3>
                <p className="text-lg">Gerente General</p>
              </div>
              <div className="flex flex-col justify-center items-start gap-1 text-white py-5 ps-3 ">
                <p className="leading-6 text-lg flex justify-center items-center gap-1">
                  <span>
                    <img
                      src="svg/base/TELEFONO.svg"
                      alt="telefono"
                      className="w-4"
                    />
                  </span>
                  +56 9 9020 8452
                </p>
                <p className="leading-6 text-lg flex justify-center items-center gap-2">
                  <span>
                    <img
                      src="svg/base/Correo.svg"
                      alt="correo"
                      className="w-4"
                    />
                  </span>
                  erivera@ast.cl
                </p>
              </div>
            </div>
          </article>
          <article className="relative bg-slate-800 shadow w-full h-100 rounded-2xl overflow-hidden">
            <div
              className="absolute left-0 -top-10  w-full h-95 bg-white "
              style={{
                clipPath: "ellipse(90% 45% at 50% 45%)",
              }}
            ></div>
            <div className="relative w-full h-full bg-gradient-to-b from-white to-transparent p-5">
              <div className="w-full h-45 ">
                <img
                  src="img/about/infraestructuras.jpg"
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center items-center py-5">
                <h3 className="text-xl font-bold text-primary-100 ">
                  Eduardo Rivera
                </h3>
                <p className="text-lg">Gerente General</p>
              </div>
              <div className="flex flex-col justify-center items-start gap-1 text-white py-5 ps-3 ">
                <p className="leading-6 text-lg flex justify-center items-center gap-1">
                  <span>
                    <img
                      src="svg/base/TELEFONO.svg"
                      alt="telefono"
                      className="w-4"
                    />
                  </span>
                  +56 9 9020 8452
                </p>
                <p className="leading-6 text-lg flex justify-center items-center gap-2">
                  <span>
                    <img
                      src="svg/base/Correo.svg"
                      alt="correo"
                      className="w-4"
                    />
                  </span>
                  erivera@ast.cl
                </p>
              </div>
            </div>
          </article>
          <article className="relative bg-slate-800 shadow w-full h-100 rounded-2xl overflow-hidden">
            <div
              className="absolute left-0 -top-10  w-full h-95 bg-white "
              style={{
                clipPath: "ellipse(90% 45% at 50% 45%)",
              }}
            ></div>
            <div className="relative w-full h-full bg-gradient-to-b from-white to-transparent p-5">
              <div className="w-full h-45 ">
                <img
                  src="img/about/infraestructuras.jpg"
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center items-center py-5">
                <h3 className="text-xl font-bold text-primary-100 ">
                  Eduardo Rivera
                </h3>
                <p className="text-lg">Gerente General</p>
              </div>
              <div className="flex flex-col justify-center items-start gap-1 text-white py-5 ps-3 ">
                <p className="leading-6 text-lg flex justify-center items-center gap-1">
                  <span>
                    <img
                      src="svg/base/TELEFONO.svg"
                      alt="telefono"
                      className="w-4"
                    />
                  </span>
                  +56 9 9020 8452
                </p>
                <p className="leading-6 text-lg flex justify-center items-center gap-2">
                  <span>
                    <img
                      src="svg/base/Correo.svg"
                      alt="correo"
                      className="w-4"
                    />
                  </span>
                  erivera@ast.cl
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section className="relative h-100 ">
        <div
          className="absolute left-0 -top-15  w-full h-100  bg-white-100 "
          style={{
            clipPath: "ellipse(90% 50% at 50% 50%)",
          }}
        ></div>
        <div className="relative w-full max-w-6xl mx-auto  flex flex-col justify-center items-center gap-5">
          <div>
            <ClientsCarousel />
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
