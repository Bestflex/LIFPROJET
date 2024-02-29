var feu = []; //variable ou on stock la lecture du fichier json
var commune = []; //variable ou on stock les communes
var loc = []; //variable qui sert à l'affichage des markers
var mesMarkers=[]; //variable ou l'on stock les markers
var tableSearch = []; //variable ou l'on stock les feux trouvés grace à la fonction recherche
var tableDate = []; //variable ou l'on stock les feux trouvés grace à la fonction tri par date 
var tableDpt = []; //variable ou l'on stock les feux trouvés grace à la fonction tri par departement
var moysom = []; //variable ou l'on stock la somme des surface brulées par departement
var nombre = []; //variable ou on stock le nombre de feu par departement
var moyparmark = []; //variable ou l'on stock la moyenne des surface brulées par departement

//lecture asynchrone d'un fichier json
$.getJSON('src/json/feu.json', function (data) {

	feu=data.feu;

    for(var i=0; i<feu.length; i++){
        commune.push(feu[i].commune);
    }
	init(data.feu);	
  });

//fonction d'autocomplétion dans le cas d'une recherche
$( function() {
    var availableTags = commune;
    $('#txtrecherche').autocomplete({
      source: availableTags,
	  minLength: 2 // l'autocomplétion débutera au bout de 2 caractères
    });
});

//fonction qui affiche la carte de base avec tous les markers (on en affiche que 100 sinon crash)
function init(feuchoisie){
	
	for(var i=0; i<100; i++){
	  	if(feuchoisie[i]!=null){
		
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

			//création des markers de chaque feu
			mesMarkers[i] = new L.marker(coordinates,loc[i]).bindPopup(infos);

			//ajout d'un champ info dans chaque marker
			mesMarkers[i].infos=details;
			layerGroup.addLayer(mesMarkers[i]);
	 	}
	}
}
//fonction qui affiche le ou les markeurs recherché par l'utilisateur
function initrecherche(){

	for(var i=0; i<feu.length; i++){
		if(tableSearch[i]!=null){
		
			var details = {
		  		"insee": tableSearch[i].insee,
		  		"commune": tableSearch[i].commune,
		  		"date":tableSearch[i].daterapport,
		  		"heure": tableSearch[i].heure,
		  		"surfaceB": tableSearch[i].surfacebrulee,
			};
	  		loc.push(details);

			var infos = 'Insee: '+ tableSearch[i].insee + '<br> Commune: '+ tableSearch[i].commune + '<br> Date: '+ tableSearch[i].daterapport + '<br> Heure: '+ tableSearch[i].heure + '<br> Surface Brulée: '+ tableSearch[i].surfacebrulee + ' m²';
			var coordinates = {lat: tableSearch[i].posx, lng: tableSearch[i].posy};

			//création des markers de chaque feu
			mesMarkers[i] = new L.marker(coordinates,loc[i]).bindPopup(infos);

			//ajout d'un champ info dans chaque marker
			mesMarkers[i].infos=details;
			layerGroup.addLayer(mesMarkers[i]);
	 	}
	}				
}

//fonction qui affiche le ou les markeurs recherché par la fourchette de date
function initdate(){

	for(var i=0; i<100; i++){
		if(tableDate[i]!=null){
		
			var details = {
		  		"insee": tableDate[i].insee,
		  		"commune": tableDate[i].commune,
		  		"date":tableDate[i].daterapport,
		  		"heure": tableDate[i].heure,
		  		"surfaceB": tableDate[i].surfacebrulee,
			};
	  		loc.push(details);

			var infos = 'Insee: '+ tableDate[i].insee + '<br> Commune: '+ tableDate[i].commune + '<br> Date: '+ tableDate[i].daterapport + '<br> Heure: '+ tableDate[i].heure + '<br> Surface Brulée: '+ tableDate[i].surfacebrulee + ' m²';
			var coordinates = {lat: tableDate[i].posx, lng: tableDate[i].posy};

		 	//création des markers de chaque feu
		 	mesMarkers[i] = new L.marker(coordinates,loc[i]).bindPopup(infos);

		 	//ajout d'un champ info dans chaque marker
		 	mesMarkers[i].infos=details;
			layerGroup.addLayer(mesMarkers[i]);

	  	}
	}				
}

//fonction qui affiche le ou les markeurs recherché par departement
function initdpt(){
	
	for(var i=0; i<tableDpt.length; i++){
		if(tableDpt[i]!=null){
		
			var details = {
		  		"insee": tableDpt[i].insee,
		  		"commune": tableDpt[i].commune,
		  		"date":tableDpt[i].daterapport,
		  		"heure": tableDpt[i].heure,
		 	 	"surfaceB": tableDpt[i].surfacebrulee,
			};
	 		loc.push(details);

			var infos = 'Insee: '+ tableDpt[i].insee + '<br> Commune: '+ tableDpt[i].commune + '<br> Date: '+ tableDpt[i].daterapport + '<br> Heure: '+ tableDpt[i].heure + '<br> Surface Brulée: '+ tableDpt[i].surfacebrulee + ' m²';
			var coordinates = {lat: tableDpt[i].posx, lng: tableDpt[i].posy};

		 	//création des markers de chaque feu
			mesMarkers[i] = new L.marker(coordinates,loc[i]).bindPopup(infos);

		 	//ajout d'un champ info dans chaque marker
		 	mesMarkers[i].infos=details;
		 	layerGroup.addLayer(mesMarkers[i]);
	  	}
	}				
}

//fonction qui nous supprime tout les marker de la carte quand elle est appelée
function supprimer(){
	
	for(i=0;i<mesMarkers.length;i++) 
	{
		map.removeLayer(mesMarkers[i]);
	} 
}

//fonction qui s'occupe de la recherche dans le fichier Json
function rechercher(){
	supprimer();
	console.log(feu[0].commune);
	var word = document.getElementById("txtrecherche").value;

	//permet de reafficher la carte de base
	if(word == '*') { init(feu); }
	else {
		var found = false;
		for(var i=0; i<feu.length; i++)
		{
	  		if(word == feu[i].commune)
			{
				//on stock les feu correspondant au mot recherché
		  		tableSearch.push(feu[i]);
		  		found = true;
	  		}
		}
	}
	if(found == false){
		alert('Aucun résultat dans la base de données pour votre recherche');
	}

	document.getElementById("txtrecherche").value = ""; //Vide la barre de recherche
	initrecherche(); //lance la fonction qui s'occupe de l'affichage
}

//fonction qui s'occupe de la recherche entre deux intervalle de jours dans le fichier Json
function tdate(){
	supprimer();
	console.log(feu[0].daterapport);
	var date1 = document.getElementById("start").value;
	var date2 = document.getElementById("end").value;
	console.log(date1,date2);
	var found = false;
	for(var i=0; i<feu.length; i++)
	{
	  	if((date1 <= feu[i].daterapport)&&(date2 >= feu[i].daterapport))
		{
			//on stock les feu correspondant aux dates recherchées
		  	tableDate.push(feu[i]);
		  	found = true;
	  	}
	}

	if(found == false){
		alert('Aucun résultat dans la base de données pour votre selection');
	}

	//reinitialiser les dates
	document.getElementById("start").value = ""; 
	document.getElementById("end").value = "";
	initdate(); //lance la fonction qui s'occupe de l'affichage
}

//fonction qui s'occupe de la recherche en fonction de l'insee qui est transformé en departements dans le fichier Json
function tdpt(){
	supprimer();
	var dpt = document.getElementById("dpt").value;
	var found = false;
	for(var i=0; i<feu.length; i++)
	{
		var dptb = [];
		dptb[i] = recupdpt(feu[i].insee)
	  	if(dpt == dptb[i])
		{
		  	tableDpt.push(feu[i]);
		  	found = true;
	  	}
	}

	if(found == false){
		alert('Aucun résultat dans la base de données pour votre selection');
	}

	document.getElementById("dpt").value = ""; //reinitialiser de la barre departement
	initdpt(); //lance la fonction qui s'occupe de l'affichage
}

//recupere la partie entiere d'un nombre 
function recupdpt(x)  { var result = Math.trunc(x/1000); return result; }

//fonction qui retourne le nombre de feu par departement, la somme des surfaces brulées par departement et la moyenne des surfaces brulées par departement
function moyenneSB(){
	for(var i = 1; i<100; i++)
	{
		var dptb = [];
		moysom[i] = 0;
		nombre[i] = 0;
		var dpt = i;
		for(var j = 0; j<feu.length; j++)
		{
			dptb[j] = recupdpt(feu[j].insee)
			if(i==dptb[j])
			{
				nombre[i] = nombre[i] + 1;
				moysom[i] = moysom[i] + feu[j].surfacebrulee;
			}
		}
		moyparmark[i] = moysom[i] / nombre[i];
	}
	console.log(nombre, moysom, moyparmark);
}

//initialisation de la map leaflet
var map = L.map('map').setView([47.64427, 1.59113], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
var layerGroup = L.layerGroup().addTo(map);
