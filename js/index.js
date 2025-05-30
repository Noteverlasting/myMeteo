document.addEventListener('DOMContentLoaded', () => {
    function getAllCookies() {
        return Object.fromEntries(
            document.cookie.split('; ')
                .filter(cookie => cookie !== '')
                .map(cookie => cookie.split('='))
        );
    }

    const cookies = getAllCookies();
    var idioma = cookies.language || navigator.language.slice(0,2) || "es";
    let jsonIdiomas = null;

    // Función para cambiar el idioma
    function cambiarIdioma(idioma, jsonIdiomas) {
        if (!jsonIdiomas || !jsonIdiomas[idioma]) {
            console.log("No hay datos de idioma disponibles");
            return;
        }
        
        document.querySelector("html").setAttribute("lang", idioma);
        
        const elementos = [
            "previsionHoy",
            "temp",
            "feels_like",
            "temp_min",
            "temp_max",
            "humidity",
            "speed",
            "sunrise",
            "sunset",
            "previsiones"
        ];

        // Traducir elementos con verificación
        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento && jsonIdiomas[idioma] && jsonIdiomas[idioma][id]) {
                elemento.textContent = jsonIdiomas[idioma][id];
            } else {
                console.log(`Elemento no encontrado o traducción no disponible: ${id}`);
            }
        });
    }

    // Cargar el JSON de idiomas
    fetch("data/idiomas.json")
        .then(respuesta => respuesta.json())
        .then(data => {
            jsonIdiomas = data;
            console.log("Datos de idiomas cargados:", jsonIdiomas);
            cambiarIdioma(idioma, jsonIdiomas);
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
        });

    // Configurar el evento change del selector de idioma
    const formIdioma = document.forms["meteoForm"];
    if (formIdioma) {
        const langSelector = formIdioma.querySelector('#lang');
        if (langSelector) {
            langSelector.addEventListener("change", (e) => {
                idioma = e.target.value;
                console.log("Cambiando a idioma:", idioma);
                document.cookie = `language=${idioma}; max-age=${60}; path=/`;
                cambiarIdioma(idioma, jsonIdiomas);

        // Actualizar el tiempo si hay una ciudad ingresada
          const city = formIdioma['city'].value.trim();
          if (city) {
          actualizarTiempo(city, idioma);
          }
        });
        } else {
            console.error("Selector de idioma no encontrado");
        }
    } else {
        console.error("Formulario meteoForm no encontrado");
    }
});