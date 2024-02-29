# LIFPROJET


## Name
RC1. Data Explorable : feu de foret.

## Description


Dans la page Home il est possible de faire plusieurs types de recherche: par date, par nom ou par département.
La recherche par nom à un menu déroulant de suggestions de noms en fonction de ce qui a déjà été entrer. En fonction
de la rechercher effectuer la carte sur la droite est mise à jour pour afficher les points correspondant a la rechercheIl est aussi possible de clicker sur un point afficher pour qu'une bulle d'information sur ce point de données apparaisse,
il contient le numéro INSEE du point, la date et l'heure d'enregistrement du feu ainsi que la surface brulée par le feu. 

Dans la page Prévention, il y a une carte de la France découper par départements. Ces départements ont une couleur qui
depend du nombre de feux ayant été enregistré dans ce département, plus le nombre est grand plus le département est sombre.
Cette gradation de couleurs est indiqué par une légende en bas de page. En survolant un département, une carte d'info après et 
indique le nom du départementla surface moyen brûlée par les feux enregister dans ce département et le nombre de feux enregistrer 
entre 2006 et 2022 dans ce département.

La page voronoi fonctionne de manière très similaire à la page Prévention mais au lieu d'afficher les départements elle affiche
une tesselation de vonoroi. La taille des cellules est représentative du nombre de feu, et la couleur de la surface brûlée dans 
Chaque cellule.

La page About rassemble des informations sur le site(même si ça serait difficile d'arriver ici sans le savoir).

## Usage
permet de visualiser des données sur la repartition des feux en France

## Architecture

traitementPython: fichier contenant le code python pour les pré-traitements.

untreated data: fichier de données qui ne sont pas utiliser directement par le site.

web: dossier contenant les fichier du site

README.md: ce fichier

Rapport_LIFPROJET.pdf: rapport du projet.

Soutenance.pdf: diaporama de la soutenance


## Installation
Pour lancer le site il faut charger le dossier web dans Visual Studio Code et utiliser l'extension Server Live en clickant sur go live
(en bas a droite dans Visual Studio Code )une fois cette extention installer.
pour le traitement python executer traitementPython/main.py 

## Usage
permet de visualiser des données sur la repartition des feux en France




## Authors and acknowledgment
Oussama Benaziz p2007990
BONHOTAL JULES p2003042
GHEBRIOUA ANIS p2018783
nous remercions Rémy Cazabet, le profeseur refferent de ce projet, pour ses conseil tout au long du develepement. 


## Project status
le projet n'as malheureusement pas put etre mener a terme dans le temps impartie, il manque notament l'integration des clusters comme
methode pour supplenter l'affichage des points individuels lors qu'il sont trop nombreux.
