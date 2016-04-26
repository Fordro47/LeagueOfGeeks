import json
import requests
import os,sys
import traceback
import urllib2
import time
import math
import playerIds as chall
import matches as matches
import items as itemDictionary
# import allMatches as allMatches
from collections import Counter
from operator import itemgetter
# Gets All champion ids
def getChampIds(query):
	try:
		response = requests.get(query)
		responseJSON = response.json()
		champions = []
		ids = []
		responseCounts = responseJSON['data']
		num = 0
		print responseCounts
		for item in responseCounts.iterkeys():
			
			champions.append(responseCounts[item]['id']) # responseCounts[item]['name']
			#num = num + 1
			
		# print num
		# print ids
		# print champions
		# print responseCounts['MonkeyKing']['id']
		print "===================================="
		return champions

	except Exception, e:
		traceback.print_exc()

def getChallengerPlayers(query):
	try:
		response = requests.get(query)
		responseJSON = response.json()
		responseCounts = responseJSON['entries']
		players = []
		num = 0

		# entry = responseCounts[num]
		# res = entry['playerOrTeamId']
		# print res
		# matches.append(responseCounts[num])

		for item in responseCounts:
			entry = responseCounts[num]
			player = entry['playerOrTeamId']
			players.append(player)
			# matches[num] = player#append(entry)
			# matches.append(entry['playerOrTeamId'])
			num = num + 1
		return players

	except Exception, e:
		traceback.print_exc()
	# Gets the last 100 game ids of every champ


def getMatches(query):
	print "test1"
	if query:
		print "test2"
		try:
			response = requests.get(query)
			responseJSON = response.json()
			# print responseJSON
			responseCounts = responseJSON['games']
			matches = []
			num = 0
			# print responseCounts
			print "test3"
			for item in responseCounts:
				entry = responseCounts[num]
				match = entry['gameId']
				matches.append(match)
				num = num + 1
			return matches

		except Exception, e:
			print "exception"
			# traceback.print_exc()
			return 

def getItems(query):
	exception = None
	try:
		response = requests.get(query)
		responseJSON = response.json()
		# responseJSON = query
		queueType = responseJSON['queueType']
		print queueType
		if queueType == "NORMAL_5x5_BLIND" or queueType == "RANKED_SOLO_5x5" or queueType == "NORMAL_5x5_DRAFT" or queueType == "TEAM_BUILDER_DRAFT_RANKED_5x5" or queueType == "ARAM_5x5":

			responseCounts = responseJSON['participants']
			print len(responseCounts)
			champion = responseCounts[0]['championId']
			coll = {}
			num = 0

			for item in responseCounts:
				items = []
				champion = responseCounts[num]['championId']
				# print champion
				item0 = responseCounts[num]['stats']['item0']
				item1 = responseCounts[num]['stats']['item1']
				item2 = responseCounts[num]['stats']['item2']
				item3 = responseCounts[num]['stats']['item3']
				item4 = responseCounts[num]['stats']['item4']
				item5 = responseCounts[num]['stats']['item5']
				item6 = responseCounts[num]['stats']['item6']
				# print item1
				items.append(item0)
				items.append(item1)
				items.append(item2)
				items.append(item3)
				items.append(item4)
				items.append(item5)
				items.append(item6)


				coll[champion] = items
				num = num + 1
			print coll
			return coll
		else:
			return None
	except TypeError as e:
		exception = e
		print exception
		return None
	except KeyError as e:
		exception = e
		print exception
		return None
	except Exception as e:
		exception = e
		print exception
		return None

def getItemName(query):
	try:
		response = requests.get(query)
		responseJSON = response.json()
		print responseJSON['name']
		return responseJSON['name']

	except KeyError, e:
		traceback.print_exc()
def getChampName(query):
	try:
		response = requests.get(query)
		responseJSON = response.json()
		print responseJSON['name']
		return responseJSON['name']

	except Exception, e:
		traceback.print_exc()
def transformIDs(items, final):
	print "inTransformIDs"
	exception = None
	# if item is visionward or farsight alteration exclude
	try:
		for item in items:
			query = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + str(item) + "?api_key=48b82772-b0fa-4332-9215-275cfef0fa15"
			champItems = []
			num = 0
			for at in items.get(item):
				print str(items.get(item)[num])
				if str(at)!=str("none") and str(at)!=str("0") and str(at)!=str("3340") and str(at)!=str("3341") and str(at)!=str("3345") and str(at)!=str("3348") and str(at)!=str("3361") and str(at)!=str("3362") and str(at)!=str("3363") and str(at)!=str("3364") and str(at)!=str("2043")and str(at)!=str("2031")and str(at)!=str("2003")and str(at)!=str("2009"):

					itemName = itemDictionary.items[str(at)]['name']
					champItems.append(itemName)
				num = num + 1
			name = getChampName(query)
			if name in final:
				final[name].extend(champItems)
			else:
				final[name] = champItems

		return final

	except TypeError as e:
		exception = e
		print exception
		return None
	except KeyError as e:
		exception = e
		print exception
		return None
	except Exception as e:
		exception = e
		print exception
		return None
	# for item in items:
	# 	query = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + str(item) + "?api_key=48b82772-b0fa-4332-9215-275cfef0fa15"
	# 	champItems = []
	# 	num = 0
	# 	for at in items.get(item):
	# 		itemNameQuery = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/"+str(items.get(item)[num])+"?api_key=48b82772-b0fa-4332-9215-275cfef0fa15"
	# 		print str(items.get(item)[num])
	# 		itemName = getItemName(itemNameQuery)
	# 		champItems.append(itemName)
	# 		num = num + 1

	# 	final[getChampName(query)] = champItems
	# return final

dynamic_base = "https://na.api.pvp.net"
static_base = "https://global.api.pvp.net"
api_key = "?api_key=48b82772-b0fa-4332-9215-275cfef0fa15"

#champIdQuery ="https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=48b82772-b0fa-4332-9215-275cfef0fa15"
champIdQuery = static_base + "/api/lol/static-data/na/v1.2/champion" + api_key
#matchDataQuery = dynamic_base + "/api/lol//v2.2/match/" + matchId + api_key     #add matchId a t end
matchListsQuery = "https://na.api.pvp.net/api/lol/na/v2.5/league/challenger?type=RANKED_SOLO_5x5&api_key=48b82772-b0fa-4332-9215-275cfef0fa15"



# champIds = getChampIds(champIdQuery)
# print champIds

coll = {}
# challengerPlayers = getChallengerPlayers(matchListsQuery)
# print chall.players
# print len(chall.players)


# print len(challengerPlayers)
# print challengerPlayers
matches1 = []
matches2 = []
matches3 = []
matches4 = []

items = {}
final = {}








# for item in allMatches.matches:
# 	items = getItems(item, coll)
# 	final.update(transformIDs(items, final))

for item in matches.Matches:
	matchDataQuery = dynamic_base + "/api/lol/na/v2.2/match/" + str(item) + api_key
	result = {}
	result = getItems(matchDataQuery)
	if result != None:
		print result
		print "------------------------"
		final.update(transformIDs(result, final))
		print final
		print "------------------------"
	# items = getItems(matchDataQuery)#gets all the items for all champs from 1 game
	
	
	# break
# Final is not a dictionary of champs and item occurances
stats = []

for item in final:
	end = 6
	temp = final[item]
	tempSize = len(temp)
	if tempSize >= 1:
		# blah = {}
		blah = Counter(temp)
		print "temp below"
		print temp
		newArr = []
		for i in Counter(temp):
			newArr.extend([(i, round(Counter(temp)[i] / float(len(temp)) * 100.0, 2))])
		x = {}
		
			# print item
		print newArr
		print "=-=-=-=-=-=-=-=-=-=-=-=-"
		# print sorted(newArr, key=lambda tup: -tup[1])
		Arr = []
		Arr = sorted(newArr, key=lambda tup: -tup[1])
		
		# for i in Arr:
		# 	print i 
		# 	print Arr.index(i)
		# 	x[Arr[Arr.index(i)][0]] = Arr[Arr.index(i)][1]
		# 	print x
		print "====================="
		# print x.most_common(4)
		print Arr
		print "====================="
		
		other = 100.0
		for i in Arr:
			other = other - (Arr[Arr.index(i)][1])# + Arr[Arr.index(i)][1] + Arr[Arr.index(i)][1]) 
			print other

			if (end-1) == i:
				break
			if (Arr.index(i) + 1) == len(Arr) and len(Arr) < end:
				#short cut soon
				lastIndex = Arr.index(i) + 1
				# Arr[Arr.index(i)] = ("Other", round(other, 2))
				# # Arr[lastIndex] = ("Other", round(other, 2))
				stats.append((item, Arr[0:lastIndex]))
				break
		if len(Arr) > end:
			Arr[end] = ("Other", round(other, 2))
			stats.append((item, Arr[0:end+1]))#gets 0, 1, 2 of array
		

		# stats[item] = x

		# for thing in temp:
		# 	print thing
		# stats[str(item)] = temp

	
print stats
# print final
# itemDictionary
f = open('output.txt', 'w')
print >> f, 'Graph Data', stats
f.close()








# recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + "57539163" + "/recent" + api_key
# print recentGamesListQuery
# matches.extend(getMatches(recentGamesListQuery))
# print matches


# num = 0
# print "start players1 matches"
# for item in chall.players1:
# 	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players1[num]) + "/recent" + api_key
# 	matches1.extend(getMatches(recentGamesListQuery))
# 	num = num + 1
# 	print matches1
# print "end player1"	
# f = open('output.txt', 'w')
# print >> f, 'Matches1', matches1
# f.close()
# time.sleep(3)

# num = 0
# print "start players2"
# for item in chall.players2:
# 	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players2[num]) + "/recent" + api_key
# 	matches2.extend(getMatches(recentGamesListQuery))
# 	num = num + 1
# 	print matches2
# print "end player2"	
# f = open('output.txt', 'w')
# print >> f, 'Matches2', matches2
# f.close()
# time.sleep(3)

# num = 0
# print "start players3"
# for item in chall.players3:
# 	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players3[num]) + "/recent" + api_key
# 	matches3.extend(getMatches(recentGamesListQuery))
# 	num = num + 1
# 	print matches3
# print "end player3"	
# f = open('output.txt', 'w')
# print >> f, 'Matches3', matches3
# f.close()
# time.sleep(3)

# num = 0
# print "start players4"
# for item in chall.players4:
# 	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players4[num]) + "/recent" + api_key
# 	matches4.extend(getMatches(recentGamesListQuery))
# 	num = num + 1
# 	print matches4
# print "end player4"	
# f = open('output.txt', 'w')
# print >> f, 'Matches4', matches4
# f.close()
# time.sleep(3)




# for item in chall.players:
# 	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players[num]) + "/recent" + api_key
# 	print recentGamesListQuery
# 	matches.extend(getMatches(recentGamesListQuery))
# 	num = num + 1
# 	print matches
# 	time.sleep(.05)
# print matches

# print matches
# for item in matches:
# 	# coll = {}
# 	print item
# 	matchDataQuery = dynamic_base + "/api/lol/na/v2.2/match/" + str(item) + api_key
# 	getItems(matchDataQuery, coll)

# recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + summonerId + "/recent" + api_key

# print matches
# matchDataQuery = dynamic_base + "/api/lol/na/v2.2/match/" + "2146212864" + api_key
# https://na.api.pvp.net/api/lol/na/v2.2/match/2146212864?api_key=48b82772-b0fa-4332-9215-275cfef0fa15
# https://na.api.pvp.net/api/lol/na/v2.2/match/2146212864?api_key=48b82772-b0fa-4332-9215-275cfef0fa15






# items = {}
# final = {}
# for item in matches.Matches:
# 	matchDataQuery = dynamic_base + "/api/lol/na/v2.2/match/" + str(item) + api_key
# 	items = getItems(matchDataQuery, coll)#gets all the items for all champs from 1 game
	
# 	final = final + transformIDs(items, final)

# print final
# # itemDictionary
# f = open('output.txt', 'w')
# print >> f, 'Items', final
# f.close()



# print matches
# for item in challengerPlayers:
# 	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + challengerPlayers[0] + "/recent"
# 	getMatches + api_key
# 	print item
# print challengerPlayers[0]

# Retrieve match by match ID /api/lol/{region}/v2.2/match/{matchId}
# Retrieve challenger matches /api/lol/{region}/v2.5/league/challenger
# Get Recent Games by summoner Id /api/lol/na/v1.3/game/by-summoner/{summonerId}/recent



#https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/31271272/recent?api_key=48b82772-b0fa-4332-9215-275cfef0fa15
