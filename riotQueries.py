import json
import requests
import traceback
import urllib2
import time
import challengers as chall
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
			# traceback.print_exc()
			return 

def getItems(query, coll):
	try:
		response = requests.get(query)
		responseJSON = response.json()
		responseCounts = responseJSON['participants']

		# champion = responseCounts[0]['championId']
		# coll = {}
		num = 0

		for item in responseCounts:
			items = []
			champion = responseCounts[num]['championId']
			# print champion
			item1 = responseCounts[num]['stats']['item1']
			item2 = responseCounts[num]['stats']['item2']
			item3 = responseCounts[num]['stats']['item3']
			item4 = responseCounts[num]['stats']['item4']
			item5 = responseCounts[num]['stats']['item5']
			item6 = responseCounts[num]['stats']['item6']
			# print item1
			items.append(item1)
			items.append(item2)
			items.append(item3)
			items.append(item4)
			items.append(item5)
			items.append(item6)

			coll[champion] = items
			num = num + 1
		return coll

	except Exception, e:
		traceback.print_exc()

# def 
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
print chall.players
print len(chall.players)


# print len(challengerPlayers)
# print challengerPlayers
matches = []
num = 0


# recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + "57539163" + "/recent" + api_key
# print recentGamesListQuery
# matches.extend(getMatches(recentGamesListQuery))
# print matches
print "players1"
for item in chall.players1:
	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players1[num]) + "/recent" + api_key
	matches.extend(getMatches(recentGamesListQuery))
	num = num + 1
	print matches
	time.sleep(.1)

num = 0
print "players2"
for item in chall.players2:
	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players2[num]) + "/recent" + api_key
	matches.extend(getMatches(recentGamesListQuery))
	num = num + 1
	print matches
	time.sleep(.1)

num = 0
for item in chall.players3:
	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players3[num]) + "/recent" + api_key
	matches.extend(getMatches(recentGamesListQuery))
	num = num + 1
	print matches
	time.sleep(.1)

num = 0
for item in chall.players4:
	recentGamesListQuery = dynamic_base + "/api/lol/na/v1.3/game/by-summoner/" + str(chall.players4[num]) + "/recent" + api_key
	matches.extend(getMatches(recentGamesListQuery))
	num = num + 1
	print matches
	time.sleep(.1)





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


# items = getItems(matchDataQuery, coll)


# print coll




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



# print num

# url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=48b82772-b0fa-4332-9215-275cfef0fa15"
# result = json.load(url)
# request = urllib2.Request(url)
# response = urllib2.urlopen(request)
# jsonobj = json.load(response)
# # resp_dict = json.load(response)

# print jsonobj

# for price in jsonobj['data'][0]:
#     print price['__value__']

# print jsonobj