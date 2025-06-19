window.onload = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      document.getElementById("lat").value = position.coords.latitude;
      document.getElementById("lng").value = position.coords.longitude;
    },
    (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  );
};


document.getElementById("reporteForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const nombre = form.nombre.value;
  const descripcion = form.descripcion.value;
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;
  const fotoInput = document.getElementById("foto");

  const file = fotoInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async function () {
    const fotoBase64 = reader.result;

    const data = new URLSearchParams();
    data.append("nombre", nombre);
    data.append("descripcion", descripcion);
    data.append("lat", lat);
    data.append("lng", lng);
    data.append("foto", fotoBase64);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyWMzBSNgtRPS9_PoAkdiIgkXrfnsmD_RzyhboETZE6ZMqp64Ozav7tuPPXjtBWK2b83w/exec", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire("¡Éxito!", result.message, "success");
        form.reset();
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo enviar el reporte", "error");
      console.error(err);
    }
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    Swal.fire("Error", "Debes seleccionar una imagen", "error");
  }
});
