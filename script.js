const weatherInput = document.getElementById('search-input');
const weatherButton = document.getElementById('search-button');
const weatherContainer = document.getElementById('weather');

async function getWeather(city) {
	return await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=2Y9T3ZLZ6JDM3BTH344FCVUBW&contentType=json`, {
		"method": "GET",
	})
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			console.log(data);
			return data;
		})
		.catch(err => {
			console.error(err);
		});

}

function prepareWeather(data) {
	const city = data.resolvedAddress;
	const temperature = data.currentConditions.temp;
	const temperatureLike = data.currentConditions.feelslike;
	const windSpeed = data.currentConditions.windspeed;
	const likelihoodOfRain = data.currentConditions.precip;
	const likelihoodOfSnow = data.currentConditions.snow;

	if (data.days.lenght < 2) {
		console.err("not enough days have got from API");
		return;
	}
	const nowDay = data.days[0];
	const temperatureDescription = nowDay.conditions;
	const nextDay = data.days[1];

	const temperatureByHoursNowDay = nowDay.hours.map(hour => {
		return {
			time: hour.datetime,
			temp: hour.temp
		}
	});
	const temperatureByHoursNextDay = nextDay.hours.map(hour => {
		return {
			time: hour.datetime,
			temp: hour.temp
		}
	});

	return {
		city,
		temperature,
		temperatureLike,
		windSpeed,
		likelihoodOfRain,
		likelihoodOfSnow,
		temperatureDescription,
		temperatureByHoursNowDay,
		temperatureByHoursNextDay
	};
}

function fillWeather(data) {
	const cityElement = document.createElement('h2');
	cityElement.setAttribute('id', 'city');
	cityElement.textContent = data.city;

	const temperatureElement = document.createElement('p');
	temperatureElement.setAttribute('id', 'temperature');
	temperatureElement.textContent = data.temperature + "°C";

	const temperatureLikeElement = document.createElement('p');
	temperatureLikeElement.setAttribute('id', 'temperature-like');
	temperatureLikeElement.textContent = data.temperatureLike + "°C";

	const windSpeedElement = document.createElement('p');
	windSpeedElement.setAttribute('id', 'wind-speed');
	windSpeedElement.textContent = data.windSpeed + " km/h";

	const likelihoodElement = document.createElement('p');
	likelihoodElement.setAttribute('id', 'likelihood');
	likelihoodElement.textContent = `Rain ${data.likelihoodOfRain == null ? 0 : data.likelihoodOfRain}%, Snow ${data.likelihoodOfSnow == null ? 0 : data.likelihoodOfSnow}%`;

	const temperatureDescriptionElement = document.createElement('p');
	temperatureDescriptionElement.setAttribute('id', 'temperature-description');
	temperatureDescriptionElement.textContent = data.temperatureDescription;

	const temperatureByHoursNowDayElement = document.createElement('ul');
	const temperatureByHoursNowDayElementText = document.createElement('p');
	temperatureByHoursNowDayElementText.setAttribute('id', 'temperature-by-hours-now-day-text');
	temperatureByHoursNowDayElementText.textContent = "Temperature by hours now day";
	temperatureByHoursNowDayElement.appendChild(temperatureByHoursNowDayElementText);
	temperatureByHoursNowDayElement.setAttribute('id', 'temperature-by-hours-now-day');
	data.temperatureByHoursNowDay.forEach(hour => {
		const hourElement = document.createElement('li');
		hourElement.setAttribute('class', 'hour');
		hourElement.textContent = hour.time + " " + hour.temp + "°C";
		temperatureByHoursNowDayElement.appendChild(hourElement);
	})

	const temperatureByHoursNextDayElement = document.createElement('ul');
	const temperatureByHoursNextDayElementText = document.createElement('p');
	temperatureByHoursNextDayElementText.setAttribute('id', 'temperature-by-hours-next-day-text');
	temperatureByHoursNextDayElementText.textContent = "Temperature by hours next day";
	temperatureByHoursNextDayElement.appendChild(temperatureByHoursNextDayElementText);
	temperatureByHoursNextDayElement.setAttribute('id', 'temperature-by-hours-next-day');
	data.temperatureByHoursNextDay.forEach(hour => {
		const hourElement = document.createElement('li');
		hourElement.setAttribute('class', 'hour');
		hourElement.textContent = hour.time + " " + hour.temp + "°C";
		temperatureByHoursNextDayElement.appendChild(hourElement);
	})

	weatherContainer.innerHTML = "";

	weatherContainer.appendChild(cityElement);
	weatherContainer.appendChild(temperatureElement);
	weatherContainer.appendChild(temperatureLikeElement);
	weatherContainer.appendChild(windSpeedElement);
	weatherContainer.appendChild(likelihoodElement);
	weatherContainer.appendChild(temperatureDescriptionElement);
	weatherContainer.appendChild(temperatureByHoursNowDayElement);
	weatherContainer.appendChild(temperatureByHoursNextDayElement);
}

weatherButton.addEventListener("click", async () => {
	const city = weatherInput.value;
	if (!city) {
		alert("Please enter a city");
		return;
	}
	console.log(city);
	const data = await getWeather(city);
	const preparedData = prepareWeather(data);
	fillWeather(preparedData);
})
