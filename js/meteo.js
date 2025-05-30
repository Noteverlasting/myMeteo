const meteoForm = document.forms['meteoForm'];

// Función para actualizar el tiempo
function actualizarTiempo(city, lang) {
    const units = 'metric';
    const appid = "bc5c4db4465795f95c6113041a40d3bb";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${appid}`;

    fetch(URL)
        .then(data => data.json())
        .then(data => {
            const description = `${data['weather'][0]['description']}`;
            const icon = `${data['weather'][0]['icon']}`;
            document.getElementById('iconNow').innerHTML = `<img src="https://www.imelcf.gob.pa/wp-content/plugins/location-weather/assets/images/icons/weather-icons/${icon}.svg" alt="${description}">`;
            document.getElementById('description').textContent = description;
            
            // Guardar los valores numéricos
            document.getElementById('temp').dataset.value = ` ${data['main']['temp']}ºC`;
            document.getElementById('feels_like').dataset.value = ` ${data['main']['feels_like']}ºC`;
            document.getElementById('temp_min').dataset.value = ` ${data['main']['temp_min']}ºC`;
            document.getElementById('temp_max').dataset.value = ` ${data['main']['temp_max']}ºC`;
            document.getElementById('humidity').dataset.value = ` ${data['main']['humidity']}%`;
            document.getElementById('speed').dataset.value = ` ${data['wind']['speed']} km/h`;
            document.getElementById('humidity').dataset.value = ` ${data['main']['humidity']}%`;
            document.getElementById('speed').dataset.value = ` ${data['wind']['speed']} km/h`;
            
            // Convertir timestamps Unix a hora local
            const sunriseTime = new Date(data['sys']['sunrise'] * 1000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const sunsetTime = new Date(data['sys']['sunset'] * 1000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            document.getElementById('sunrise').dataset.value = ` ${sunriseTime}`;
            document.getElementById('sunset').dataset.value = ` ${sunsetTime}`;

            // Actualizar el contenido
            actualizarContenido();
        })
        .catch(error => console.log(error));
}

// Función para actualizar el contenido
function actualizarContenido() {
    const elementos = ['temp', 'feels_like', 'temp_min', 'temp_max', 'humidity', 'speed', 'sunrise', 'sunset'];
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento && elemento.dataset.value) {
            elemento.textContent = elemento.textContent + elemento.dataset.value;
        }
    });
}

// Event listener para el formulario
meteoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let city = meteoForm['city'].value.trim();
    let lang = meteoForm['lang'].value;
    actualizarTiempo(city, lang);
    actualizarPrevisiones(city, lang); // Añadir esta línea
});

// Función para actualizar las previsiones
function actualizarPrevisiones(city, lang) {
    const units = 'metric';
    const appid = "bc5c4db4465795f95c6113041a40d3bb";
    const URLP = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&lang=${lang}&appid=${appid}`;

    fetch(URLP)
        .then(data => data.json())
        .then(data => {
            // PARA LA PREVISION DE LOS SIGUIENTES DIAS
            for(let i = 1; i <= 4; i++) {
                const index = i * 8 - 1; // Para obtener datos cada 24h (8 mediciones por día)
                const icon = data['list'][index]['weather'][0]['icon'];
                const description = data['list'][index]['weather'][0]['description'];
                document.getElementById(`iconDia${i}`).innerHTML = 
                    `<img src="https://www.imelcf.gob.pa/wp-content/plugins/location-weather/assets/images/icons/weather-icons/${icon}.svg" alt="${description}">
                     <p id="day${i}">${description}</p>`;
            }
        })
        .catch(error => console.log(error));
}