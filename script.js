document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reporteForm");
  const estado = document.getElementById("estado");

  // Obtener ubicación
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      document.getElementById("lat").value = pos.coords.latitude;
      document.getElementById("lng").value = pos.coords.longitude;
    }, () => {
      estado.textContent = "No se pudo obtener la ubicación.";
    });
  } else {
    estado.textContent = "Geolocalización no soportada.";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    estado.textContent = "Enviando...";

    const formData = new FormData(form);
    const file = form.foto.files[0];

    const reader = new FileReader();
    reader.onloadend = async () => {
      formData.set("foto", reader.result);

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzOd_elKuvqcBhYAxwc3-gAduLLpoGi4QeXHeHcXvw_LddJeNd0NCmqamw24CIk8g8L0w/exec", {
          method: "POST",
          body: formData,
        });

        const result = await response.text();
        estado.textContent = result;
        form.reset();
      } catch (err) {
        console.error(err);
        estado.textContent = "Error al enviar el formulario.";
      }
    };

    reader.readAsDataURL(file);
  });
});