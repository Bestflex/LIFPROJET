var feu = [];
var insee = [];
var commune = [];
var date = [];
var heure = [];
var surfaceb = [];
var posx = [];
var posy = [];
var loc = [];
var mesMarkers=[];

$.getJSON('src/json/feu.json', function (data) {

    for(var i=0; i<data.feu.length; i++){
		insee.push(data.feu[i].insee);
        commune.push(data.feu[i].commune);
		date.push(data.feu[i].daterapport);
		heure.push(data.feu[i].heure);
		surfaceb.push(data.feu[i].surfacebrulee);
		posx.push(data.feu[i].posx);
		posy.push(data.feu[i].posy);
    }
	init(data.feu);
    
	

  });
  function init(feuchoisie){
	//console.log("displayDOT", restochoisi );
	for(var i=0; i<100; i++){
	  if(feuchoisie[i]!=null){
		//console.log(resto.length);
		//console.log(map);
		//console.log("resto[i] :",resto[i]);
		var details = {
		  "insee": feuchoisie[i].insee,
		  "commune": feuchoisie[i].commune,
		  "date":feuchoisie[i].daterapport,
		  "heure": feuchoisie[i].heure,
		  "surfaceB": feuchoisie[i].surfacebrulee,
		};
	  loc.push(details);

		var infos = 'Insee: '+ feuchoisie[i].insee + '<br> Commune: '+ feuchoisie[i].commune + '<br> Date: '+ feuchoisie[i].daterapport + '<br> Heure: '+ feuchoisie[i].heure + '<br> Surface Brulée: '+ feuchoisie[i].surfacebrulee + ' m²';
		var coordinates = {lat: feuchoisie[i].posx, lng: feuchoisie[i].posy};

		 //création des markers de chaque restaurant
		 mesMarkers[i] = new L.marker(coordinates,loc[i]).bindPopup(infos);

		 //ajout d'un champ info dans chaque marker
		 mesMarkers[i].infos=details;
		 layerGroup.addLayer(mesMarkers[i]);


		   //console.log(marker[i]);
	  }
	}
				//console.log("loc :",loc);
  }

  //fonction qui nous supprime tout les marker de la carte en cas de selection d'un nouveau critère
  function supprimer(){
	//console.log("avant sdhzegv");
	layerGroup.eachLayer(function(layer){
	map.removeLayer(layer);
	});

		   //permet de décocher un bouton radio quand on sélectionne une nouvelle catégorie
		   // if(btnRadio_selectionne==true){
		   //      var arrondissement = tab_radio[0];
		   //    //document.getElementById(arrondissement).checked = false;
		   //        btnRadio_selectionne = false;
		   //      tab_radio = [];
		   //  }
  }

  //fonction d'autocomplétion dans le cas d'une recherche
  $(function(){
	$("#txtSearch").autocomplete({
	  source: baseName,
	  minLength: 2 // l'autocomplétion débutera au bout de 2 caractères
	}).keyup(function(e){
		  toucheEntree(e);// gère l'évènement sur la touche entrée lorsque l'utilisateur à sélectionner une adresse dans la liste proposée par l'autocomplétion
	  });
  });

  

/*$(document).ready(function() {
	$.ajax ({
		url:"/src/json/feu.json",
		dataType:"json",
		success: function(data)
			{
				console.log("ca plante",data);
				parseJSON(data);
			},
		error:function(err)
			{
				console.log("ca plante",err);
			},
	});

	var parseJSON=function(data)
		{
			$(data).each(function(i) 
			{
				createHTML(this);
			});
		}
	var createHTML = function(element)
	{
		for (var i = 0; i < 1000; i++)
		{
			var marker = L.marker([element.feu[i].posx,element.feu[i].posy]).addTo(map);
			map.addLayer(marker);
		};
	}

	function pSearch() {
		var saisieR = document.querySelector("#sch").value;
		console.log(saisieR)
	}

	document.querySelector("#btsch").addEventListener("click", pSearch);
})*/


var map = L.map('map').setView([47.64427, 1.59113], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
var layerGroup = L.layerGroup().addTo(map);
