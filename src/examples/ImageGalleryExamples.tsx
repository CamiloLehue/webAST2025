import ImageGallery from "../components/gallery/ImageGallery";


function ExampleUsage() {
  const handleSolicitar = () => {
    alert("Solicitud enviada!");
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h2 className="text-3xl font-bold mb-10">Ejemplos de uso de ImageGallery</h2>
      
      <section className="mb-20">
        <h3 className="text-2xl font-bold mb-5">Sistema de Seguridad</h3>
        <ImageGallery
          images={[
            "img/services/seguridad/cam3.png",
            "img/services/seguridad/cam.png",
            "img/services/seguridad/cam2.png",
            "img/services/seguridad/hero.png"
          ]}
          title="Sistema de Iluminación IR"
          description="De la serie RAYMAX diseñado específicamente para aplicaciones de larga distancia, ofrecen una excelente imagen de noche con una mejor salida óptica y sobresaliente fiabilidad."
          buttonText="Solicitar"
          altText="Sistema de Iluminación IR"
          onButtonClick={handleSolicitar}
        />
      </section>

      <section className="mb-20">
        <h3 className="text-2xl font-bold mb-5">Productos</h3>
        <ImageGallery
          images={[
            "img/services/wisensor/hero.jpg",
            "img/services/wisensor/aplicaciones.png",
            "img/services/wisensor/wisensor-app.png",
            "img/services/wisensor/Wisensor.png"
          ]}
          title="Wisensor IoT"
          description="Tecnología avanzada de sensores IoT para monitoreo ambiental y control de procesos industriales en tiempo real."
          buttonText="Ver más información"
          altText="Wisensor IoT"
          onButtonClick={() => console.log("Ver más información sobre Wisensor")}
        />
      </section>

      <section className="mb-20">
        <h3 className="text-2xl font-bold mb-5">Personalizado</h3>
        <ImageGallery
          images={[
            "img/about/ast-network-personal.jpg",
            "img/about/infraestructuras.jpg",
            "img/about/hero/hero.jpg",
            "img/inicio/ia-wisensor.jpg"
          ]}
          title="Nuestra Infraestructura"
          description="Contamos con una red robusta de infraestructura tecnológica que nos permite brindar servicios de calidad mundial en cualquier ubicación."
          buttonText="Contactar"
          altText="Infraestructura AST"
          onButtonClick={() => window.location.href = "mailto:contacto@ast.cl"}
        />
      </section>
    </div>
  );
}

export default ExampleUsage;