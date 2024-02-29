


import traitementCVSDtatabase
import numpy as np
import pandas as pd
import geopandas as gpd
import shapely.geometry
import shapely.ops
from sklearn.cluster import kmeans_plusplus
import geojson as gjs
from scipy.spatial import Voronoi, voronoi_plot_2d
import matplotlib.pyplot as plt
import json
import shapely as sp

df_places = gpd.read_file('E:/Cours/generale/2022-2023/lifprojet/untreated  data/jsononline-net.json')
with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/france main simplifier.geojson") as f:
    area_shape2 = gjs.load(f)

# import franceTracerALaMain.json commme json
with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/franceTracerALaMain.json") as fmain:
    hullFranceJson = gjs.load(fmain)

# isole la liste de points du json
hullFrancePoints = hullFranceJson["features"][0]["geometry"]["coordinates"][0]

# convertie la liste de points en shaply plolygones
hullFrance = sp.geometry.Polygon(hullFrancePoints)


#cree une liste des feux et leur positions et la met dans x
x = traitementCVSDtatabase.treat_feu_to_tab()[1:]
xAvecSurfacBruler = traitementCVSDtatabase.treat_feu_to_tab_Avec_Surface()[1:]



# traitement de valeur outre mer
c = 0
for e in [a for a in x]:
    if ((e[0] < 40 or e[0] > 52) or (e[1] < -5 or e[1] > 8)):  # (e[0] < 39 or e[1] > 15):
        x = np.delete(x, c, 0)
    else:
        c = c + 1

c = 0
for e in [a for a in xAvecSurfacBruler]:
    if ((float(e[0]) < 40 or float(e[0]) > 52) or (float(e[1]) < -5 or float(e[1]) > 8)):  # (e[0] < 39 or e[1] > 15):
        xAvecSurfacBruler = np.delete(xAvecSurfacBruler, c, 0)
    else:
        c = c + 1

pd.DataFrame(x).plot.scatter(1, 0)
testx = x

centers, indices = kmeans_plusplus(x, n_clusters=50, random_state=0)

vor = Voronoi(centers, furthest_site=False)
# fig = voronoi_plot_2d(vor)#juste pour l'affichage


lines = [  # vor to list of lines
    shapely.geometry.LineString(vor.vertices[line])
    for line in vor.ridge_vertices
]

# polygones to shaply polygones
shaplyPolygonesListe = []
for poligoneGenerated in shapely.ops.polygonize(lines):
    shaplyPolygonesListe.append(poligoneGenerated)

# cree un shaply polygone contenant tout les point initiaux
convexHullAllPoints = shapely.geometry.MultiPoint(x).convex_hull

# utilise un verison plus joli du polygone de contour pour le decoupage et l'ajout des polygones pour les points exclus
#NON FONCTIONELLE
# convexHullAllPoints = hullFrance

# trim polygones in shaplyPolygonesListe to the convex hull of all the points
shaplyPolygonesListeLen = len(shaplyPolygonesListe)
counterTrim = 0
allPolygonesAfterTrim = []
while (counterTrim < shaplyPolygonesListeLen):
    allPolygonesAfterTrim.append(shaplyPolygonesListe[counterTrim].intersection(convexHullAllPoints))
    counterTrim += 1

# soustrait tout les polygon generer au polygones de contour
for polyGen in shaplyPolygonesListe:
    convexHullAllPoints = convexHullAllPoints.difference(polyGen)

# cree une liste des polygones resultant de la soustraction
excludedPointsPolygonesListe = list(convexHullAllPoints)



# ajout les polygones contenant les excluded dans shaplyPolygonesListe
for exPointPoly in excludedPointsPolygonesListe:
    allPolygonesAfterTrim.append(exPointPoly)



# refectorisation de allPolygonesAfterTrim pour la compatibiliter avec le rest du code
shaplyPolygonesListe = allPolygonesAfterTrim



# transphormes the shaply polygones into json and put them in polygoneList
polygoneList = []
conterPoly = 0
for poly in shaplyPolygonesListe:
    tmp = gpd.GeoSeries([poly]).to_json()
    polygoneList.insert(conterPoly, tmp)
    conterPoly += 1



# cree une liste listSurface qui compte la surfface bruler pour chauque polygone
# et une list listNbFeu qui compt le nombre de feu pour chaque polygone
nbPolygones = len(shaplyPolygonesListe)

listSurface = [0] * nbPolygones
listNbFeu = [0] * nbPolygones
counterListSurface = 0
for poly in shaplyPolygonesListe:
    for xSurface in xAvecSurfacBruler:
        tmpPoint = sp.geometry.Point(float(xSurface[0]), float(xSurface[1]))
        if (poly.contains(tmpPoint)):
            listSurface[counterListSurface] += int(xSurface[2])
            listNbFeu[counterListSurface] += 1
    counterListSurface += 1



# enleve des polygones sans surface qui sont cree a cause de problemes d union et de differances avec les polygone lors de
# la phase de trimage et de creation des polygones pour les points exclus par defaut
c = 0
for nbFeu in listNbFeu:
    if (nbFeu == 0):
        shaplyPolygonesListe = np.delete(shaplyPolygonesListe, c, 0)
        listNbFeu = np.delete(listNbFeu, c, 0)
        print(listSurface[c])
        listSurface = np.delete(listSurface, c, 0)
    else:
        c += 1

for poly in shaplyPolygonesListe:
    polyx, polyy = poly.exterior.xy
    plt.plot(polyy, polyx)


# exchange x and y position because it is generated ratated on the side et insertion des nbfeu et surface brulee
counterExchange = 0
for a in polygoneList:
    loaded = json.loads(a)

    conteurCoord = 0
    for tab in json.loads(a)['features'][0]["geometry"]['coordinates'][0]:
        tmpx = tab[0]
        tmpy = tab[1]
        # insertion des nbfeu et surface brulee
        loaded["nbFeu"] = int(listNbFeu[conteurCoord])
        loaded["surfaceBrulee"] = int(listSurface[conteurCoord])
        # invertion des x et y
        loaded['features'][0]["geometry"]['coordinates'][0][conteurCoord][0] = tmpy
        loaded['features'][0]["geometry"]['coordinates'][0][conteurCoord][1] = tmpx
        conteurCoord += 1
    loaded['features'][0]["geometry"]['coordinates'][0].reverse()
    polygoneList[counterExchange] = json.dumps(loaded)
    counterExchange += 1



#genere un featureCollection avec les polygones comme features, utiliser pour l'affichage sur le site.
with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/JSON polygones.json", 'w', encoding="utf-8") as out:
    out.write('{"type": "FeatureCollection","features": [')
    for index, a in enumerate(polygoneList):
        loaded = json.loads(a)
        feature = loaded['features'][0]
        valNbFeu = 0
        if (index < len(listSurface)):
            valNbFeu = listSurface[index]
        dictProperties = {
            "code": str(index),
            "nom": "region numero " + str(index),
            "nbfeu": str(valNbFeu)
        }
        feature['properties'] = dictProperties

        feature = json.dumps(feature)
        if (index < len(polygoneList) - 1):
            feature += ","
        out.write(feature)

    out.write(']}')

# enregistrement des polygones en sql query
with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/sql polygones.txt", 'w', encoding="utf-8") as out:
    out.write('create table polygones (polyID bigint primary key ,poly json);' + '\n' + '\n' + '\n')
    out.write('insert into polygones (polyID, poly) ' + '\n')
    out.write('VALUES ')
    index = 0
    for i in polygoneList:
        out.write('(' + str(index) + ', ' + '\'' + i + '\'' + ')' + ',' + '\n')
        index += 1

plt.show()
