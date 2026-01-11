// ===== GLOBAL STATE =====
let originalTemp = null;
let currentUnit = "C";

// ===== DOM ELEMENTS =====
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const resultDiv = document.getElementById("weather-result");
const toggleBtn = document.getElementById("unit-toggle");

// ===== FORM SUBMIT =====
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) return;

    resultDiv.innerHTML = "Loading... ⏳";

    try {
        const data = await fetchWeather(city);

        originalTemp = data.currentConditions.temp;
        currentUnit = "C";

        renderWeather(data, originalTemp, currentUnit);
        setBackground(data.currentConditions.conditions);

    } catch (error) {
        resultDiv.innerHTML = "❌ City not found or API error";
        console.error(error.message);
    }
});

// ===== FETCH WEATHER =====
async function fetchWeather(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=VGL67SUNKH6CTA94WGVYLWQ2N`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Weather fetch failed");
    }

    return await response.json();
}

// ===== RENDER WEATHER =====
function renderWeather(data, temp, unit) {
    resultDiv.innerHTML = `
        <strong>${data.resolvedAddress}</strong><br>
        🌡️ ${temp.toFixed(1)} °${unit}<br>
        ☁️ ${data.currentConditions.conditions}
    `;
}

// ===== UNIT TOGGLE =====
toggleBtn.addEventListener("click", function () {
    if (originalTemp === null) return;

    let displayTemp;

    if (currentUnit === "C") {
        displayTemp = (originalTemp * 9) / 5 + 32;
        currentUnit = "F";
    } else {
        displayTemp = originalTemp;
        currentUnit = "C";
    }

    resultDiv.innerHTML = `
        🌡️ ${displayTemp.toFixed(1)} °${currentUnit}
    `;
});

// ===== BACKGROUND (NO IMAGES) =====
function setBackground(condition) {
    const c = condition.toLowerCase();

    if (c.includes("rain")) {
        document.body.style.background =
            "linear-gradient(135deg, #667db6, #0082c8)";
    } else if (c.includes("cloud")) {
        document.body.style.background =
            "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    } else if (c.includes("clear")) {
        document.body.style.background =
            "linear-gradient(135deg, #56ccf2, #2f80ed)";
    } else if (c.includes("snow")) {
        document.body.style.background =
            "linear-gradient(135deg, #e6dada, #274046)";
    } else {
        document.body.style.background =
            "linear-gradient(135deg, #74ebd5, #9face6)";
    }
}
