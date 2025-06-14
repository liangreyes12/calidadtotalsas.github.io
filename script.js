document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reporteForm");

  // Obtener ubicación
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById("lat").value = pos.coords.latitude;
        document.getElementById("lng").value = pos.coords.longitude;
      },
      () => {
        Swal.fire({
          icon: "warning",
          title: "Ubicación",
          text: "No se pudo obtener la ubicación.",
        });
      }
    );
  } else {
    Swal.fire({
      icon: "warning",
      title: "Ubicación no soportada",
      text: "Tu navegador no admite geolocalización.",
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Enviando...",
      text: "Por favor espera",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData(form);
    const file = form.foto.files[0];

    const enviarFormulario = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzOd_elKuvqcBhYAxwc3-gAduLLpoGi4QeXHeHcXvw_LddJeNd0NCmqamw24CIk8g8L0w/exec",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.text();

        Swal.fire({
          icon: result.includes("✅") ? "success" : "error",
          title: result.includes("✅") ? "¡Éxito!" : "Error",
          text: result,
        });

        if (result.includes("✅")) form.reset();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo enviar el formulario.",
        });
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formData.set("foto", reader.result);
        enviarFormulario();
      };
      reader.readAsDataURL(file);
    } else {
      enviarFormulario();
    }
  });
});
