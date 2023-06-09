import UI from "./modules/UI";
import Weather from "./modules/weather";

const userInterface = UI();
const weather = Weather();

const defaultCity = "Tokyo";
let selectedMode = "metric";

document.addEventListener("DOMContentLoaded", () => {
  userInterface.loadHomePage();
  loadDefaultData();
});

window.addEventListener("load", async () => {
  switchToMetric();
  switchToImperial();
  onFormSubmit();
});

const loadDefaultData = async () => {
  const defaultWeatherData = await weather.getRequiredWeatherData(
    defaultCity,
    selectedMode
  );

  userInterface.renderFetchedData(defaultWeatherData, selectedMode);
};

const switchToMetric = () => {
  const metricButton = document.querySelector(".metric");
  const imperialButton = document.querySelector(".imperial");

  metricButton.addEventListener("click", async () => {
    selectedMode = "metric";
    imperialButton.className = "imperial";
    metricButton.className = "metric active-mode";

    await fetchWeatherData();
  });
};

const switchToImperial = () => {
  const imperialButton = document.querySelector(".imperial");
  const metricButton = document.querySelector(".metric");

  imperialButton.addEventListener("click", async () => {
    selectedMode = "imperial";
    metricButton.className = "metric";
    imperialButton.className = "imperial active-mode";

    await fetchWeatherData();
  });
};

const onFormSubmit = () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetchWeatherData();
  });
};

const fetchWeatherData = async () => {
  try {
    await userInterface.loading();

    const city = document.querySelector("#city");
    const cityError = document.querySelector(".error");

    const weatherData = await weather.getRequiredWeatherData(
      city.value,
      selectedMode
    );

    if (!weatherData) {
      cityError.className = "error active";
      cityError.textContent = "Invalid location";
    } else {
      userInterface.renderFetchedData(weatherData, selectedMode);

      cityError.className = "error";
      cityError.textContent = "";
    }

    userInterface.removeLoading();
  } catch (err) {
    userInterface.removeLoading();
    console.log(err);
  }
};
