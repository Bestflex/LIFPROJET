import json
import csv

def fileToCode():
    with open("E:/Cours/generale/2022-2023/lifprojet/code-postal-code-insee-2015.json") as jsonfile:
        dic = json.load(jsonfile)
        for dep in dic['features']:
            if ('properties' in dep):
                if ('code_postal' in dep['properties']):
                    print(dep['properties']['code_postal'])

def printCSV():
    with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/feu_BDIFF_fr_metro_06-22.csv", encoding='utf-8') as feufile:
        feu = csv.reader(feufile, delimiter=',', quotechar='|')
        for f in feu:
            print(f)