from firebaseManager import FirebaseManager
import logging
import json
import operator

DBEventTypesPath = "bigdata/lists/"
DBItemCorrelationPath = "bigdata/itemcorrelation"
DBTimesPath = "events/upcoming/"

def getSuggestedItems(eventType, currentItemList, count=5):
	global DBEventTypesPath

	topItems = []
	################### Find suggested items based on event type ########################
	if (eventType is not None):
		eventSuggestedItems = json.loads(FirebaseManager.getFromFB(DBEventTypesPath + eventType))

		#Remove the items currently in the shopping list from the items that will be suggested
		for item in currentItemList:
			if(item in eventSuggestedItems):
				del eventSuggestedItems[item]

		sorted_eventSuggestedItems = sorted(eventSuggestedItems.iteritems(), key=lambda (k,v): (v,k), reverse=True)

		for i in range(0,len(sorted_eventSuggestedItems)):
			topItems.append(sorted_eventSuggestedItems[i][0])
			if (i==count-1):
				break

	#logging.info(topItems)
	################### Find suggested items based on items in user's item list ########################

	if (currentItemList is not None):
		for item in currentItemList:
			correlatedItems = json.loads(FirebaseManager.getFromFB(DBItemCorrelationPath + "/" + item))
			if (correlatedItems is not None):
				closestCorrelatedItem = max(correlatedItems.iteritems(), key=operator.itemgetter(1))[0]
				if (closestCorrelatedItem not in topItems):
					topItems.append(closestCorrelatedItem)
					if (len(topItems) == count*2):
						break

	logging.info(topItems)
	return topItems


def putItem(eventType,item):
	global DBEventTypesPath

	FirebaseManager.patchToFB(item,DBEventTypesPath+eventType)


def putFinalDate(eventID,fromTime,toTime,eventDate):
	global DBTimesPath

	finalDatePath = DBTimesPath + eventID + "/finalDate"

	finalDate = {"fromTime":fromTime,"toTime":toTime,"eventDate": eventDate}
	FirebaseManager.saveToFB(finalDate,finalDatePath)


def closeEventTime(eventID):
	global DBTimesPath

	eventDatesPath = DBTimesPath + eventID + "/availableDates"
	eventAvailableTimes = json.loads(FirebaseManager.getFromFB(eventDatesPath))
	bestTimeIndex = calcBestTime(eventAvailableTimes)

	logging.info(bestTimeIndex)
	putFinalDate(eventID,eventAvailableTimes[bestTimeIndex]["fromTime"],eventAvailableTimes[bestTimeIndex]["toTime"],eventAvailableTimes[bestTimeIndex]["eventDate"])


def calcBestTime(eventAvailableTimes):

	maxCount = -1
	for i in range(0,len(eventAvailableTimes)):
		currEventCount = countAvailableUsers(eventAvailableTimes[i]["usersAccepted"])
		if(currEventCount > maxCount):
			maxCount = currEventCount
			bestTimeIndex = i

	return bestTimeIndex


def countAvailableUsers(usersStatus):
	usersAvailable = 0
	for i in range(0,len(usersStatus)):
		if(usersStatus[i]["status"] == "confirmed"):
			usersAvailable = usersAvailable + 1

	return usersAvailable


def updateEventTypeItems(eventType, shoppingList):
	global DBEventTypesPath

	eventTypePath = DBEventTypesPath + eventType
	for item in shoppingList:
		dbItem = json.loads(FirebaseManager.getFromFB(eventTypePath + "/" + item))
		if(dbItem is None):
			newItem = {item:1}
			FirebaseManager.patchToFB(newItem,eventTypePath)
		else:
			FirebaseManager.saveToFB(dbItem+1,eventTypePath + "/" + item)


def updateItemCorrelation(shoppingList):
	global DBItemCorrelationPath

	for item1 in shoppingList:
		for item2 in shoppingList:
			if (item1 == item2):
				continue

			dbItem1 = json.loads(FirebaseManager.getFromFB(DBItemCorrelationPath + "/" + item1))
			if(dbItem1 is None):
				newItem = {item1:{item2:1}}
				FirebaseManager.patchToFB(newItem,DBItemCorrelationPath)
			else:
				dbItem2 = json.loads(FirebaseManager.getFromFB(DBItemCorrelationPath + "/" + item1 + "/" + item2))
				if(dbItem2 is None):
					newItem = {item2:1}
					FirebaseManager.patchToFB(newItem,DBItemCorrelationPath + "/" + item1)
				else:
					FirebaseManager.saveToFB(dbItem2+1,DBItemCorrelationPath + "/" + item1 + "/" + item2)



def updateDB(eventType, shoppingList):
	updateEventTypeItems(eventType, shoppingList)
	updateItemCorrelation(shoppingList)