var station_IDs = {
	KT: ["57A0D4D6D4D57497", "8FAF102A11AB6C80", "84F4FB113301C3B6", "92AA28BBE48D6B2E", "215D99B3E2A5F8DD", "736E84A8060D2AB9", "001713"],
	YTLT: ["F85916921D80C45A", "F60CC440E22B0BD9", "5309D748976029CB"],
	TC: ["86FD7EFBB651F5CE", "001860"],
	CX: ["18CA599721E67265", "001844", "001845", "AAC64BCDD5B55A86"]
};

window.onload = function() {
	//define header block and secton block
	var body_block = document.querySelector("body");
	var header_block = document.querySelector("header");
	var section_block = document.querySelector("section");
	var main_bar_block = document.getElementById("main_bar");
		
	//get all the elements
	var last_update_div = document.getElementById("last_update_div");
	var KT_btn = document.getElementById("KT_btn");
	var KT_div = document.getElementById("KT_div");
	var refresh_div = document.getElementById("refresh_div");
	
	function remove_all_child_nodes_from(target_parent_node) {
		while (target_parent_node.firstChild)
			target_parent_node.removeChild(target_parent_node.firstChild);
	}

	function refresh_ETA_KMB(div_name, route, stop_ID) {
		console.log(div_name.id + " " + route + " " + stop_ID)
		let url = "https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/" + stop_ID
		fetch(url)
		.then( response => {
			if (response.status == 200) {
				response.json().then( ETA_json => {
					//Populate div
					//Create ETA block devs
					
					let ETA_block = document.createElement("div");
					ETA_block.setAttribute("class", route);
					div_name.appendChild(ETA_block);
					
					let ETA_block_text = document.createElement("span");
					ETA_block_text.innerHTML = route;
					ETA_block.appendChild(ETA_block_text);
					
					//Create ETA item devs
					let ETA_to_show = ETA_json.data.length;
					if(ETA_json.data.length > 3)
						ETA_to_show = 3;
					
					let ETA_shown = 0;
					
					let ETA_total_number = 0;
					for(let i = 0; i < (ETA_json.data.length); i++) {
						if(ETA_json.data[i].route == route) {
							if(stop_ID == "84F4FB113301C3B6" || stop_ID == "92AA28BBE48D6B2E" || stop_ID == "215D99B3E2A5F8DD") {
								if(ETA_json.data[i].seq != 1) {
									continue;
								}
							}
							ETA_total_number += 1;
						}
					}
					
					if(route == '215X') {
						ETA_total_number /= 2;
					}
					
					if(ETA_total_number < ETA_to_show) {
						ETA_to_show = ETA_total_number;
					}
					
					//find out all the ETAs
					if(ETA_json.data.length != 0) {
						for(let i = 0; i < ETA_json.data.length && ETA_shown < ETA_to_show; i++) {
							// skip not matching route
							if(ETA_json.data[i].route == route) {
								//special case for Kwong Tin Terminus
								if(stop_ID == "84F4FB113301C3B6" || stop_ID == "92AA28BBE48D6B2E" || stop_ID == "215D99B3E2A5F8DD") {
									if(ETA_json.data[i].seq != 1) {
										continue;
									}
								}
								
								let ETA_item = document.createElement("div");
								ETA_item.setAttribute("class", "ETA_item");
								ETA_block.appendChild(ETA_item);
									
								let ETA_text = document.createElement("span");
								ETA_text.setAttribute("class", "ETA_text");
								ETA_item.appendChild(ETA_text);
									
								let ms_diff = Date.parse(ETA_json.data[i].eta) - Date.now()
								//console.log(ms_diff)
								let min_diff = Math.round(ms_diff/1000/60)
								
								let text = "";
								if(min_diff <= 0) {
									if(ETA_json.data[i].seq == 1)
										text = "就開";
									else
										text = "就到";
								} else {
									text = min_diff + " 分鐘";
									//if(min_diff != 1)
									//	text += "s";
								}
								
								if(ETA_json.data[i].rmk_en != "") {
									if(ETA_json.data[i].rmk_en == "Scheduled Bus") {
										text += " (預)";
									} else if (ETA_json.data[i].rmk_en == "Final Bus") {
										text += " (尾)";
									} else if (ETA_json.data[i].rmk_en == "The final bus has departed from this stop"){
										//text = "Final bus departed";
										text = "最後班次已開出";
									} else if (ETA_json.data[i].rmk_en == "Moving slowly") {
										text += " (慢)";
									} else {
										text += " (" + ETA_json.data[i].rmk_tc + ")";
									}
								}
								
								ETA_text.innerHTML = text;
								
								ETA_shown++;
							}
						}
					}

					//if there are no record
					if(ETA_shown == 0 || ETA_json.data.length == 0) {
						let ETA_item = document.createElement("div");
						ETA_item.setAttribute("class", "ETA_item");
						ETA_block.appendChild(ETA_item);
						
						let ETA_text = document.createElement("span");
						ETA_text.setAttribute("class", "ETA_text");
						ETA_text.innerHTML = "No data";
						ETA_item.appendChild(ETA_text);
					}
				});
			}
		});
	}
	
	function refresh_ETA_CTB(div_name, route, stop_ID, seq_number) {
		console.log(div_name.id + " " + route + " " + stop_ID)
		let url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/CTB/" + stop_ID + "/" + route
		fetch(url)
		.then( response => {
			if (response.status == 200) {
				response.json().then( ETA_json => {
					//Populate div
					//Create ETA block devs
					
					let ETA_block = document.createElement("div");
					ETA_block.setAttribute("class", route);
					div_name.appendChild(ETA_block);
					
					let ETA_block_text = document.createElement("span");
					ETA_block_text.innerHTML = route;
					ETA_block.appendChild(ETA_block_text);
					
					//Create ETA item devs
					let ETA_to_show = ETA_json.data.length;
					if(ETA_json.data.length > 3)
						ETA_to_show = 3;
					
					let ETA_shown = 0;
					
					//find out all the ETAs
					if(ETA_json.data.length != 0) {
						for(let i = 0; i < (ETA_json.data.length || ETA_shown == ETA_to_show); i++) {
							// skip not matching route
							if(ETA_json.data[i].route == route && ETA_json.data[i].seq == seq_number) {
								
								let ETA_item = document.createElement("div");
								ETA_item.setAttribute("class", "ETA_item");
								ETA_block.appendChild(ETA_item);
									
								let ETA_text = document.createElement("span");
								ETA_text.setAttribute("class", "ETA_text");
								ETA_item.appendChild(ETA_text);
									
								let ms_diff = Date.parse(ETA_json.data[i].eta) - Date.now()
								//console.log(ms_diff)
								let min_diff = Math.round(ms_diff/1000/60)
								
								let text = "";
								if(min_diff <= 0)
									text = "就到";
								else {
									text = min_diff + " 分鐘";
									//if(min_diff != 1)
									//	text += "s";
								}
								
								if(ETA_json.data[i].rmk_en != "") {
									text += " (" + ETA_json.data[i].rmk_en + ")";
								}
								
								ETA_text.innerHTML = text;
								
								ETA_shown++;
							}
						}
					}

					//if there are no record
					if(ETA_shown == 0 || ETA_json.data.length == 0) {
						let ETA_item = document.createElement("div");
						ETA_item.setAttribute("class", "ETA_item");
						ETA_block.appendChild(ETA_item);
						
						let ETA_text = document.createElement("span");
						ETA_text.setAttribute("class", "ETA_text");
						ETA_text.innerHTML = "No data";
						ETA_item.appendChild(ETA_text);
					}
				});
			}
		});
	}
	
	function refresh_last_update() {
		let target_div = document.getElementById("last_update_div");
		let time_now = new Date();
		let final_time = "Last update ";
		if(time_now.getHours() >= 0 && time_now.getHours() <= 9)
			final_time += '0';
		final_time += time_now.getHours() + ":";
		if(time_now.getMinutes() >= 0 && time_now.getMinutes() <= 9)
			final_time += '0';
		final_time += time_now.getMinutes();
		target_div.firstElementChild.innerHTML = final_time;
	}
	
	function refresh_KT_div() {
		let target_div = document.getElementById("Kwong Tin Shopping Mall");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.KT[0]);
		refresh_ETA_KMB(target_div, "214", station_IDs.KT[0]);
		refresh_ETA_KMB(target_div, "14H", station_IDs.KT[0]);
		
		target_div = document.getElementById("Kwong Tin Estate Terminus");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.KT[1]);
		refresh_ETA_KMB(target_div, "14B", station_IDs.KT[2]);
		refresh_ETA_KMB(target_div, "16", station_IDs.KT[3]);
		refresh_ETA_KMB(target_div, "215X", station_IDs.KT[4]);
		
		target_div = document.getElementById("Lung Pak House");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.KT[5]);
		refresh_ETA_CTB(target_div, "E22X", station_IDs.KT[6], 5);
		refresh_ETA_CTB(target_div, "E22P", station_IDs.KT[6], 5);
		
		refresh_last_update();
	}
	
	//Add event handling for buttons on options bar
	function options_bar_KT_btn() {
		KT_div.style.display = "flex";
		YTLT_div.style.display = "none";
		TC_div.style.display = "none";
		CX_div.style.display = "none";
		
		KT_btn.style.backgroundColor = "lightblue";
		YTLT_btn.style.backgroundColor = "white";
		TC_btn.style.backgroundColor = "white";
		CX_btn.style.backgroundColor = "white";
		
		main_bar_block.style.borderRadius = "0 0.75rem 0.75rem 0.75rem";
		
		refresh_div.onclick = refresh_KT_div;
		refresh_KT_div();
	}

	refresh_div.onclick = refresh_KT_div;

	refresh_KT_div();
}