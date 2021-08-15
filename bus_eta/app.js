var station_IDs = {
	KT: ["57A0D4D6D4D57497", "8FAF102A11AB6C80", "84F4FB113301C3B6", "92AA28BBE48D6B2E", "215D99B3E2A5F8DD"],
	YTLT: ["F85916921D80C45A", "57A0D4D6D4D57497", "F60CC440E22B0BD9"],
	TC: [],
	CX: []
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
	var YTLT_btn = document.getElementById("YTLT_btn");
	var TC_btn = document.getElementById("TC_btn");
	var CX_btn = document.getElementById("CX_btn");
	var KT_div = document.getElementById("KT_div");
	var YTLT_div = document.getElementById("YTLT_div");
	var TC_div = document.getElementById("TC_div");
	var CX_div = document.getElementById("CX_div");
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
					
					//find out all the ETAs
					if(ETA_json.data.length != 0) {
						for(let i = 0; i < (ETA_json.data.length || ETA_shown == ETA_to_show); i++) {
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
								let min_diff = Math.floor(ms_diff/1000/60)
								
								let text = "";
								if(min_diff <= 0)
									text = "Soon";
								else {
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
										text += " (" + ETA_json.data[i].rmk_en + ")";
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
		
		refresh_last_update();
	}
	
	function refresh_YTLT_div() {
		let target_div = document.getElementById("Kai Tin Shopping Mall");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "215X", station_IDs.YTLT[0]);
		refresh_ETA_KMB(target_div, "216M", station_IDs.YTLT[0]);
		
		target_div = document.getElementById("Yau Tong Shopping Mall");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.YTLT[1]);
		
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
	
	function options_bar_YTLT_btn() {
		KT_div.style.display = "none";
		YTLT_div.style.display = "flex";
		TC_div.style.display = "none";
		CX_div.style.display = "none";
		
		KT_btn.style.backgroundColor = "white";
		YTLT_btn.style.backgroundColor = "lightblue";
		TC_btn.style.backgroundColor = "white";
		CX_btn.style.backgroundColor = "white";
		
		main_bar_block.style.borderRadius = "0.75rem";
		
		refresh_div.onclick = refresh_YTLT_div;
		refresh_YTLT_div();
	}
					
	function options_bar_TC_btn() {
		KT_div.style.display = "none";
		YTLT_div.style.display = "none";
		TC_div.style.display = "flex";
		CX_div.style.display = "none";
		
		KT_btn.style.backgroundColor = "white";
		YTLT_btn.style.backgroundColor = "white";
		TC_btn.style.backgroundColor = "lightblue";
		CX_btn.style.backgroundColor = "white";
		
		main_bar_block.style.borderRadius = "0.75rem";
	}
	
	function options_bar_CX_btn() {
		KT_div.style.display = "none";
		YTLT_div.style.display = "none";
		TC_div.style.display = "none";
		CX_div.style.display = "flex";
		
		KT_btn.style.backgroundColor = "white";
		YTLT_btn.style.backgroundColor = "white";
		TC_btn.style.backgroundColor = "white";
		CX_btn.style.backgroundColor = "lightblue";
		
		main_bar_block.style.borderRadius = "0.75rem";
	}

	refresh_div.onclick = refresh_KT_div;
	KT_btn.addEventListener('click', options_bar_KT_btn);
	YTLT_btn.addEventListener('click', options_bar_YTLT_btn);
	TC_btn.addEventListener('click', options_bar_TC_btn);
	CX_btn.addEventListener('click', options_bar_CX_btn);

	refresh_KT_div();
}