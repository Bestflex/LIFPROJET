import numpy as np

def convertion_encodage(s):
    s = s.replace('\'', '')
    s = s.replace('à', 'a')
    s = s.replace('ä', 'a')
    s = s.replace('â', 'a')
    s = s.replace('é', 'e')
    s = s.replace('ê', 'e')
    s = s.replace('ë', 'e')
    s = s.replace('è', 'e')
    s = s.replace('î', 'i')
    s = s.replace('ï', 'i')
    s = s.replace('ô', 'o')
    s = s.replace('ö', 'o')
    s = s.replace('ù', 'u')
    s = s.replace('û', 'u')
    s = s.replace('ü', 'u')
    s = s.replace('ÿ', 'y')
    s = s.replace('ç', 'c')
    return s


def treat_position():
    i = 0
    dectX = {}
    dectY = {}
    with open('E:/Cours/generale/2022-2023/lifprojet/untreated  data/code_insee_et_geoloc_la-post.csv', encoding='utf-8') as infile:
        red = convertion_encodage(infile.readline())
        while len(red) > 0:
            i = i + 1
            print('processing line ' + str(i) + '\n')
            red = convertion_encodage(infile.readline())
            redSplit = red.split(',')

            if len(redSplit) > 1:
                dectX[redSplit[0]] = redSplit[5]
                dectY[redSplit[0]] = redSplit[6][:-1]
    infile.close()



def treat_feu():
    i = 0
    dictX = {}
    dictY = {}
    with open('E:/Cours/generale/2022-2023/lifprojet/untreated  data/code_insee_et_geoloc_la-post.csv', encoding='utf-8') as infile:
        redPos = convertion_encodage(infile.readline())
        while len(redPos) > 0:
            i = i + 1
            print('processing line ' + str(i) + '\n')
            redPos = convertion_encodage(infile.readline())
            redSplitPos = redPos.split(',')

            if len(redSplitPos) > 1:
                posx = "0.0"
                posy = "0.0"
                if redSplitPos[5] != "" and redSplitPos[6] != "":
                    posx = redSplitPos[5]
                    posy = redSplitPos[6][:-1]
                dictX[redSplitPos[0]] = posx
                dictY[redSplitPos[0]] = posy
    infile.close()
    f = open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/feu_BDIFF_fr_metro_06-22.csv", encoding='utf-8')
    red = f.readline()
    insert = 'insert into feu (insee, commune, dateRapport, heure, surfaceBrulee, posx, posy)'
    red = convertion_encodage(f.readline())
    i = 0
    dataMissed = 0
    with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/testout.txt", 'w', encoding="utf-8") as out:
        while len(red) != 0:
            i = i + 1
            print('processing line ' + str(i) + '\n')

            redSplit = red.split(',')
            date = redSplit[2][0:10]
            date = date.replace('/', '-')
            hour = redSplit[2][11:16]

            if redSplit[0] in dictX:
                out.write(insert + '\n')
                out.write('VALUES (\'' + redSplit[0] + '\', \''
                          + redSplit[1] + '\', \''
                          + date + '\', \''
                          + hour + '\', \''
                          + redSplit[3][:-1] + '\', \''
                          + dictX[redSplit[0]] + '\', \''
                          + dictY[redSplit[0]] + '\');\n')
            else:
                dataMissed = dataMissed + 1
            red = convertion_encodage(f.readline())

    print('*********** dataMissed ' + str(dataMissed) + '   *************************')
    f.close()
    out.close()


def treat_precipitation():
    insert = "insert into precipitation (posx, posy, presMoyJour, integNbJoursPluis, integNbMaxJoursPluisConsec," \
             " periodeSecheress)"
    with open('E:/Cours/generale/2022-2023/lifprojet/untreated  data/precipitation_meteo-france.txt') as infile:
        with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/testout.txt", 'w') as out:
            redPos = infile.readline()
            print("**" + redPos)
            redPos = convertion_encodage(redPos)
            while len(redPos) > 0:
                if  redPos[0] != '#':
                    redSplit = redPos.split(';')
                    out.write(insert + '\n')
                    out.write('VALUES (\'' + redSplit[1] + '\', \''
                                           + redSplit[2] + '\', \''
                                           + redSplit[5] + '\', \''
                                           + redSplit[9] + '\', \''
                                           + redSplit[10] + '\', \''
                                           + redSplit[12] + '\');\n')
                redPos = convertion_encodage(infile.readline())
                print(redPos)


def treat_feu_to_tab():
    i = 0
    dictX = {}
    dictY = {}
    with open('E:/Cours/generale/2022-2023/lifprojet/untreated  data/code_insee_et_geoloc_la-post.csv', encoding='utf-8') as infile:
        redPos = convertion_encodage(infile.readline())
        while len(redPos) > 0:
            i = i + 1
            # print('processing line ' + str(i) + '\n')
            redPos = convertion_encodage(infile.readline())
            redSplitPos = redPos.split(',')

            if len(redSplitPos) > 1:
                posx = "0.0"
                posy = "0.0"
                if redSplitPos[5] != "" and redSplitPos[6] != "":
                    posx = redSplitPos[5]
                    posy = redSplitPos[6][:-1]
                # if posx >
                dictX[redSplitPos[0]] = posx
                dictY[redSplitPos[0]] = posy
    infile.close()
    f = open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/feu_BDIFF_fr_metro_06-22.csv", encoding='utf-8')
    red = f.readline()
    insert = 'insert into feu (insee, commune, dateRapport, heure, surfaceBrulee, posx, posy)'
    red = convertion_encodage(f.readline())
    i = 0
    dataMissed = 0


    dictname = {}
    indexPos = 0
    listPos = np.array([[0, 0]])
    with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/testout.txt", 'w', encoding="utf-8") as out:
        while len(red) != 0:
            i = i + 1
            # print('processing line ' + str(i) + '\n')

            redSplit = red.split(',')

            if redSplit[0] in dictname:
                dataMissed = dataMissed + 1
            else:
                if redSplit[0] in dictX:
                    dictname[redSplit[0]] = 1
                    # arr = np.array([float(dictX[redSplit[0]]), float(dictY[redSplit[0]])])
                    arr = [[float(dictX[redSplit[0]]), float(dictY[redSplit[0]])]]
                    # print(listPos)
                    # print(arr)
                    listPos = np.append(listPos, arr, axis=0)

                    # listPos.append(arr)
                    indexPos = indexPos + 1
            red = convertion_encodage(f.readline())

    print('*********** dataMissed ' + str(dataMissed) + '   *************************')
    f.close()
    out.close()
    return listPos


def treat_feu_to_tab_Avec_Surface():
    i = 0
    dictX = {}
    dictY = {}
    with open('E:/Cours/generale/2022-2023/lifprojet/untreated  data/code_insee_et_geoloc_la-post.csv', encoding='utf-8') as infile:
        redPos = convertion_encodage(infile.readline())
        while len(redPos) > 0:
            i = i + 1
            # print('processing line ' + str(i) + '\n')
            redPos = convertion_encodage(infile.readline())
            redSplitPos = redPos.split(',')

            if len(redSplitPos) > 1:
                posx = "0.0"
                posy = "0.0"
                if redSplitPos[5] != "" and redSplitPos[6] != "":
                    posx = redSplitPos[5]
                    posy = redSplitPos[6][:-1]
                # if posx >
                dictX[redSplitPos[0]] = posx
                dictY[redSplitPos[0]] = posy
    infile.close()
    f = open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/feu_BDIFF_fr_metro_06-22.csv", encoding='utf-8')
    red = f.readline()
    insert = 'insert into feu (insee, commune, dateRapport, heure, surfaceBrulee, posx, posy)'
    red = convertion_encodage(f.readline())
    i = 0
    dataMissed = 0


    dictname = {}
    indexPos = 0
    listPos = np.array([[0, 0, 0]])
    with open("E:/Cours/generale/2022-2023/lifprojet/untreated  data/testout.txt", 'w', encoding="utf-8") as out:
        while len(red) != 0:
            i = i + 1
            # print('processing line ' + str(i) + '\n')

            redSplit = red.split(',')

            if redSplit[0] in dictname:
                dataMissed = dataMissed + 1
            else:
                if redSplit[0] in dictX:
                    dictname[redSplit[0]] = 1
                    # arr = np.array([float(dictX[redSplit[0]]), float(dictY[redSplit[0]])])
                    arr = [[float(dictX[redSplit[0]]), float(dictY[redSplit[0]]), redSplit[-1][:-1]]]
                    # print(listPos)
                    # print(arr)
                    listPos = np.append(listPos, arr, axis=0)

                    # listPos.append(arr)
                    indexPos = indexPos + 1
            red = convertion_encodage(f.readline())

    print('*********** dataMissed ' + str(dataMissed) + '   *************************')
    f.close()
    out.close()
    return listPos
#treat_position()
# estt = 'a,b,b,b,,,bb,b,'
# tab = estt.split(',')
# # for a in tab:
# #     print ('-' + a)
# if tab[5] == "":
#     print("elle est null")

#treat_feu()