function create_new_element (element_tag, innerhtml_value) {
	let element = document.createElement(element_tag);
	element.innerHTML = innerhtml_value;
	return element;
}

function add_header_item (pic_url, text) {
	let header_item = document.createElement("div");
	header_item.setAttribute("class", "header_item");
	
	//icon
	let icon = create_new_element("img", null);
	icon.setAttribute("src", pic_url);
	header_item.appendChild(icon);
						
	//value
	let text_element = create_new_element("span", text);
	header_item.appendChild(text_element);
	
	return header_item;
}

window.onload = function() {
	//define header block and secton block
	var body_block = document.querySelector('body');
	var header_block = document.createElement("header");
	var section_block = document.createElement("section");
	
	//add header and section block to body
	body_block.appendChild(header_block);
	body_block.appendChild(section_block);
	
	//add header div for everything except last update time and reload button
	var header_div = document.createElement("div");
	header_div.setAttribute("id", "header_div");
	header_block.appendChild(header_div);
		
	//add title on header block
	var header_title = create_new_element("h1", "Weather in Hong Kong");
	header_title.setAttribute("id", "header_title");
	header_div.appendChild(header_title);
	
	//add options bar on section
	var options_bar = document.createElement("div");
	options_bar.setAttribute("id", "options_bar");
	section_block.appendChild(options_bar);
	
	var temp_btn = document.createElement("span");
	temp_btn.setAttribute("id", "temp_btn");
	temp_btn.style.backgroundColor = "lightblue"; //default selected
	temp_btn.innerHTML = "Temperature";
	options_bar.appendChild(temp_btn);
	
	var forecast_btn = document.createElement("span");
	forecast_btn.setAttribute("id", "forecast_btn");
	forecast_btn.innerHTML = "Forecast";
	options_bar.appendChild(forecast_btn);
	
	//add temperature div
	var temp_div = document.createElement("div");
	temp_div.setAttribute("id", "temp_div");
	temp_div.style.backgroundColor = "lightblue"; 
	temp_div.style.display = "flex"; //default selected
	section_block.appendChild(temp_div);
	
	//add forecast div
	var forecast_div = document.createElement("div");
	forecast_div.setAttribute("id", "forecast_div");
	forecast_div.style.backgroundColor = "lightblue";
	forecast_div.style.display = "none"; //default hidden
	section_block.appendChild(forecast_div);
	
	// Part 1: populate header div
	// [1] Add weather icon
	var weather_icon = document.createElement("div");
	weather_icon.setAttribute("class", "header_item");
	
	let weather_icon_img = document.createElement("img");
	weather_icon.appendChild(weather_icon_img);
	
	header_div.appendChild(weather_icon);
	
	// [2] Add temperature
	var temperature = add_header_item("images/thermometer.png", "error in loading from HKO");
	header_div.appendChild(temperature);
	
	// [3] Add humidity
	var humidity = add_header_item("images/drop.png", "error in loading from HKO");
	header_div.appendChild(humidity);
	
	// [4] Add rainfall
	var rainfall = add_header_item("images/rain.png", "error in loading from HKO")
	header_div.appendChild(rainfall);
	
	// [5] Add UV index
	var UV_index_item = add_header_item("images/UVindex.png", "filler");
	header_div.appendChild(UV_index_item);

	// [6] Add warning
	var warning_div = document.createElement("div");
	warning_div.setAttribute("id", "warning");
	header_div.appendChild(warning_div);
	
	// [7a] Warning button
	var warning_button_div = document.createElement("div");
	warning_button_div.setAttribute("id", "warning_btn");
	warning_div.appendChild(warning_button_div);
							
	var warning_button_text = document.createElement("span");
	warning_button_text.innerHTML = "Warning";
	warning_button_div.appendChild(warning_button_text);
							
	var warning_text_img = document.createElement("img");
	warning_text_img.setAttribute("src", "images/arrow.png");
	warning_button_div.appendChild(warning_text_img);
							
	// [7b] Warning text
	var warning_text_element = document.createElement("span");
	warning_text_element.setAttribute("id", "warning_text");
	warning_text_element.style.display = "none"; //default no display
	warning_div.appendChild(warning_text_element);
			
	// [8] Add last update time
	var last_update_div = document.createElement("div");
	last_update_div.setAttribute("id", "last_update");
	header_block.appendChild(last_update_div);
						
	var last_update_text = document.createElement("span");
	last_update_text.innerHTML = "Last update: error in loading from HKO";
	last_update_div.appendChild(last_update_text);
			
	// Add event listener for warning button
	warning_button_div.addEventListener('mouseover', () => {warning_text_element.style.display = "block";}); //mouse moved to the element
	warning_button_div.addEventListener('mouseout', () => {warning_text_element.style.display = "none";}); //mouse moved out of the element
		
	//Add event handling for buttons on options bar
	function options_bar_temp_btn() {
		temp_div.style.display = "flex";
		forecast_div.style.display = "none";
		temp_btn.style.backgroundColor = "lightblue";
		forecast_btn.style.backgroundColor = "white";
	}
					
	function options_bar_forecast_btn() {
		temp_div.style.display = "none";
		forecast_div.style.display = "flex";
		temp_btn.style.backgroundColor = "white";
		forecast_btn.style.backgroundColor = "lightblue";
	}
					
	temp_btn.addEventListener('click', options_bar_temp_btn);
	forecast_btn.addEventListener('click', options_bar_forecast_btn);
						
	function populate_temp_div(json_file) {
		for (let district of json_file.temperature.data) {
			let dist_div = document.createElement("div");
			dist_div.setAttribute("class", "dist_temp");
			
			//append district name
			let dist_temp_name = document.createElement("span");
			dist_temp_name.innerHTML = district.place;
			dist_div.appendChild(dist_temp_name);
						
			//append district temperature
			let dist_temp_reading = document.createElement("span");
			dist_temp_reading.innerHTML = district.value + "°" + district.unit;
			dist_div.appendChild(dist_temp_reading);
						
			//append close button
			let close_img = document.createElement("img");
			close_img.setAttribute("src", "images/cancel.ico");
			close_img.setAttribute("class", "dist_temp_cancel");
			dist_div.appendChild(close_img);
			
			//add event listener to close button
			close_img.addEventListener('click', () => {dist_div.style.display = "none";});
			
			temp_div.appendChild(dist_div);
		}
	}
	/*
	//testing
	var counter = 0;
	var url = "";
	var url2 = "";
	*/
	function refresh_live_weather() {
		/*
		//testing
		url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
		url2 = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en";
		if (counter == 0) {
			url = "data/weather-202009291132.json";
			url2 = "data/Forecast-202009291227.json";
		} else if (counter == 1) {
			url = "data/weather-202009301330.json";
		} else if (counter == 2) {
			url = "data/weather-202009291549.json";
		} else if (counter == 3) {
			url = "data/weather-202009302112.json";
		}
		counter++;
		*/
		fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en") //real-data
		.then( response => {
			if (response.status == 200) {
				response.json().then( new_wea_json => {
					//Update all the information
					weather_icon.children[0].setAttribute("src", "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + new_wea_json.icon[0] + ".png");
					temperature.children[1].innerHTML = new_wea_json.temperature.data[1].value + "°" + new_wea_json.temperature.data[1].unit;
					humidity.children[1].innerHTML = new_wea_json.humidity.data[0].value + "%";
					rainfall.children[1].innerHTML = new_wea_json.rainfall.data[13].max + new_wea_json.rainfall.data[13].unit;
											
					try {
						let new_uv_text = new_wea_json.uvindex.data[0].value;
						UV_index_item.style.display = "inline"; //shows the UV index
						UV_index_item.children[1].innerHTML = new_uv_text;
					} catch (error) { //if data does not exist
						UV_index_item.style.display = "none"; //hides the UV div
					}
									
					let new_warning_text = new_wea_json.warningMessage[0];
					if (new_warning_text == undefined) { //no warning
						warning_div.style.display = "none"; //hides the warning div
					} else { //has warning
						warning_text_element.innerHTML = new_warning_text;
						warning_div.style.display = "block"; //shows the warning
					}
											
					last_update_text.innerHTML = "Last update: " + new_wea_json.updateTime.substr(11,5);
					
					//Re-render district temperature
					while (temp_div.firstChild) //Remove all child node on temp_div in case new child are added in the JSON file
						temp_div.removeChild(temp_div.firstChild);
					populate_temp_div(new_wea_json); //Re-add all the children
				});
			}
			//ignore error in response for refresh
		});
		
		//Re-render forecasting
		while (forecast_div.firstChild) //Remove all child node on forecast_div in case new child are added in the JSON file
			forecast_div.removeChild(forecast_div.firstChild);
		
		//Re-render forecast temperature
		fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en") //real-data
		.then( resp_fore => {
			if (resp_fore.status == 200) {
				resp_fore.json().then( new_fore_json => {
					for(let day of new_fore_json.weatherForecast) {
						//container
						let fore_day_div = document.createElement("div");
						fore_day_div.setAttribute("class", "fore_day_div");
						forecast_div.appendChild(fore_day_div);
						
						//weather icon
						let fore_weather_img = document.createElement("img");
						fore_weather_img.setAttribute("src", "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + day.ForecastIcon +".png");
						fore_day_div.appendChild(fore_weather_img);
						
						//date
						let fore_date = document.createElement("span");
						fore_date.setAttribute("class", "fore_date");
						fore_date.innerHTML = day.forecastDate.substr(6,2) + "/" + day.forecastDate.substr(4,2);
						fore_day_div.appendChild(fore_date);
						
						//day
						let fore_day = document.createElement("span");
						fore_day.innerHTML = day.week;
						fore_day_div.appendChild(fore_day);
						
						//temperature
						let fore_temp = document.createElement("span");
						fore_temp.innerHTML = day.forecastMintemp.value + "°" + day.forecastMintemp.unit + " | " + day.forecastMaxtemp.value + "°" + day.forecastMaxtemp.unit;
						fore_day_div.appendChild(fore_temp);
						
						//humidity range
						let fore_humidity = document.createElement("span");
						fore_humidity.innerHTML = day.forecastMinrh.value + "% - " + day.forecastMaxrh.value + "%";
						fore_day_div.appendChild(fore_humidity);
					}
				});
			}
			//ignore error in response for refresh
		});	
	}
	
	refresh_live_weather();
	
	//Add refresh button
	var refresh_div = document.createElement("div");
	refresh_div.setAttribute("id", "refresh");
	header_block.appendChild(refresh_div);
					
	var refresh_img = document.createElement("img");
	refresh_img.setAttribute("src", "images/reload.png");
	refresh_div.appendChild(refresh_img);
						
	//Add event listener for warning button
	refresh_div.addEventListener('click', refresh_live_weather);
	refresh_div.addEventListener('mousedown', () => {refresh_img.setAttribute("src", "images/reload_click.png");}); //change icon
	refresh_div.addEventListener('mouseup', () => {refresh_img.setAttribute("src", "images/reload.png");}); //change back original icon	
}