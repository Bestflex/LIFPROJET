var departement; //variable qui stock les données du fichier json 1
var nb_feu_dpt = []; //variable qui stock les données du fichier json 2

//lecture asynchrone du fichier json sur les departements
$.getJSON('../json/voronoi.json', function (data) {

    departement = data;

	for(var y = 0; y<departement.features.length; y++)
	{ 
		departement.features[y].properties.surface=nb_feu_dpt[y]; //modification de la variable de stockage pour y ajouté de nouvelles données
	}

	L.geoJson(departement).addTo(mymap); //ajout des cluster des departements à la map

	for(var i = 0; i<102; i++)
	{
		//modification du style des cluster en fonction des données que l'on possede  
		L.geoJson(departement.features[i], {style: style}).addTo(mymap); 
		info.addTo(mymap); //rajout de la partie info
		
		//maj des infos en focntion de la position de souris
		info.update = function (props) {
			this._div.innerHTML = '<h4>Cellule de Vonoroi avec somme des surfaces brulées</h4>' +  (props ?
				'<b> Cellule n° : ' + props.code + '<br />Somme surface brulée : ' + props.nbfeu  + ' m<sup>2</sup>'
				: 'Mettez la souris sur un departement');
		};	
	}
	//s'occupe de l'interaction avec la position de la souris
	geojson = L.geoJson(departement, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(mymap);
});

//lecture asynchrone du fichier json contenant la moyenne des surfaces brulées par departement
/*$.getJSON('../json/nbfeu.json', function (data) {
    nb_feu_dpt = data.nb_feu;
});*/

//initialisation de la map interactive leaflet
var mymap = L.map('mapid').setView([47.64427, 1.59113], 6);
var tileStreets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
{    
    attribution: 'Map data &copy; <a href="http://openstreatmap.org">OpenstreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,Imagery © <a href="http://mapbox.com">Mapbox </a>',
    maxZoom :8,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic3RpMnnPBMJHC3RpYSIsImEiOiJjamJzMngya2kxMmsxMnZtd3Z0MDR5empkIn0.PEb_L5IRYcwUuu87hHptsg'
}).addTo(mymap);

//fonction qui donne une couleur en fonction du nombre de feu
function getColor(d) {
	return  d > 4000000 ? '#34000f' :
			d > 3000000 ? '#800026' :
			d > 2000000 ? '#BD0026' :
			d > 1500000 ? '#E31A1C' :
			d > 1000000  ? '#FC4E2A' :
			d > 500000  ? '#FD8D3C' :
			d > 100000   ? '#FEB24C' :
			d > 10000   ? '#FED976' :
					   '#FFEDA0' ;
}

//fonction qui modifie le style des cluster des departement
function style(feature) 
{
	return {
		fillColor: getColor(feature.properties.nbfeu),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//fonction qui gere l'affichage en fonction du mouvement de la souris 
function highlightFeature(e) {
	var layer = e.target;
	console.log(layer.feature.properties);
	
	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});
	
	layer.bringToFront();
	info.update(layer.feature.properties);
}

//fonction qui reset l'affichage en fonction du mouvement de la souris 
function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

var geojson;
geojson = L.geoJson(departement);

function zoomToFeature(e) {
	mymap.fitBounds(e.target.getBounds());
}

//fonction recupere le deplacement de la souris
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}
	
var info = L.control();

//rajoute l'info du departement choisie
info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'infomap'); // create a div with a class "infomap"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};
info.addTo(mymap);

var legend = L.control({position: 'bottomright'});

//fonction qui gere l'affichage de la legende
legend.onAdd = function (mymap) {
	            4000000 ? '#34000f' :
			d > 3000000 ? '#800026' :
			d > 2000000 ? '#BD0026' :
			d > 1500000 ? '#E31A1C' :
			d > 1000000 ? '#FC4E2A' :
			d > 500000  ? '#FD8D3C' :
			d > 100000  ? '#FEB24C' :
			d > 10000   ? '#FED976' :
					      '#FFEDA0' ;

    var div = L.DomUtil.create('div', 'infomap legendmap'),
        grades = [10000, 100000, 500000, 1000000, 1500000, 2000000, 3000000, 4000000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(mymap);