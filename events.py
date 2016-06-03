from utils import Utils
from firebaseManager import FirebaseManager
import logging
import event_actions
import json

class Event:

    @staticmethod
    def createEvent(userId, data):
        """
        creates an event
        Args:
            userId: the id of the creator
            data: event data .. data["invitees"] doesnt include the creator (added later)

        Returns:

        """
        data = Utils.dictNoneCheck(data, {"title": "", "description": "", "eventType": "", "shoppingList": [],
                                          "invitees": [], "availableDates": [], "location": ""})
        # make the user accepted array, everyone except the creator defaults to pending
        usersAccepted = []
        for inviteeId in data["invitees"]:
            usersAccepted.append({"userId": inviteeId, "status": "pending"})
        usersAccepted.append({"userId": userId, "status": "confirmed"})
        # ###

        availableDates = data["availableDates"]
        for i in range(0, len(availableDates)):
            availableDates[i]["usersAccepted"] = usersAccepted

        data["availableDates"] = availableDates
        data["invitees"].append(userId)  # add the creator
        res = FirebaseManager.pushToFB(data, "events/upcoming")

        # data["invitees"].pop()  # remove the creator, no need to invite him
        Event.inviteUsers(data["invitees"], res)

    @staticmethod
    def inviteUsers(invitees, eventId):
        for userId in invitees:
            Event.inviteUser(userId, eventId)

    @staticmethod
    def inviteUser(userId, eventId):
        invitation = {"seen": 0, "eventId": eventId}
        FirebaseManager.pushToFB(invitation, "users/"+userId+"/invitations")

    @staticmethod
    def confirmDates(eventId, userId, goodDates):
        """
        confirms user is available for dates for event
        Args:
            eventId: the event Id
            userId: the user's Id
            goodDates: an array of indices.. each index represent the date a user is okay with
        Returns:

        """
        res = json.loads(FirebaseManager.getFromFB("events/upcoming/{}/availableDates/".format(eventId)))
        if res is None:
            logging.warn("no event")
            return
        logging.info("changing dates for event " + str(eventId))
        someOnePending = False

        for i in range(0, len(res)):
            status = "declined"
            if i in goodDates:
                status = "confirmed"

            usersAccepted = res[i]["usersAccepted"]
            for x in range(0, len(usersAccepted)):
                if usersAccepted[x]["userId"] == userId:
                    usersAccepted[x]["status"] = status
                elif usersAccepted[x]["status"] == "pending":
                    someOnePending = True
            res[i]["usersAccepted"] = usersAccepted
        FirebaseManager.saveToFB(res, "events/upcoming/{}/availableDates/".format(eventId))
        Event.removeInvite(userId, eventId)
        Event.addEventToGoing(userId, eventId)

        if not someOnePending:  # every one answered.
            event_actions.closeEventTime(eventId)

    @staticmethod
    def removeInvite(userId, eventId):
        """
        removes an event invite from user's invite list
        Args:
            userId:
            eventId:

        Returns:

        """
        invitations = json.loads(FirebaseManager.getFromFB("users/{}/invitations/".format(userId)))
        if invitations is None:
            return
        for invitationId in invitations:
            if invitations[invitationId]["eventId"] == eventId:
                FirebaseManager.deleteFromFB("users/{}/invitations/{}".format(userId, invitationId))
                return

    @staticmethod
    def addEventToGoing(userId, eventId):
        """
        adds the event id to the user's going list
        Args:
            userId:
            eventId:

        Returns:

        """
        res = json.loads(FirebaseManager.getFromFB("users/{}/goingEvents".format(userId)))
        if res is None:
            res = []
        res.append(eventId)
        FirebaseManager.saveToFB(res, "users/{}/goingEvents".format(userId))

    # @staticmethod
    # def eventPassed(eventId):
    #     """
    #     called when event has passed
    #     eventId:
    #     Returns:
    #
    #     """
    #     res = json.loads(FirebaseManager.getFromFB("events/history/"+eventId))
    #     shopList = []
    #     for i in range(0, len(res["shoppingList"])):
    #         shopList.append(res["shoppingList"][i]["item"])
    #     event_actions.updateDB(res["eventType"], shopList)

    @staticmethod
    def getUserEvents(userId):
        """
        returns all the events (invited and going) for given user
        Args:
            userId:

        Returns: returns dict of events

        """
        allEventIds = []
        goingEvents = json.loads(FirebaseManager.getFromFB("users/{}/goingEvents".format(userId)))
        invitedEvents = json.loads(FirebaseManager.getFromFB("users/{}/invitations/".format(userId)))

        if invitedEvents is not None:
            for tempKey in invitedEvents:
                if "eventId" in invitedEvents[tempKey]:
                    allEventIds.append(invitedEvents[tempKey]["eventId"])

        if goingEvents is not None:
            for i in range(0, len(goingEvents)):
                allEventIds.append(goingEvents[i])

        allEvents = []
        for i in range(0, len(allEventIds)):
            eventDetails = Event.getEvent(allEventIds[i])
            if eventDetails is not None:
                allEvents.append({allEventIds[i]: eventDetails})
        return allEvents


    @staticmethod
    def getEvent(eventId):
        """
        returns event
        Args:
            eventId:

        Returns:

        """
        res = json.loads(FirebaseManager.getFromFB("events/upcoming/{}".format(eventId)))
        return res

    @staticmethod
    def removeEvent(eventId):
        """
        remove event from existance
        Args:
            eventId:

        Returns:

        """
        FirebaseManager.deleteFromFB("events/upcoming/"+eventId)
        users = json.loads(FirebaseManager.getFromFB("users/"))
        for userId in users:
            if "invitations" in users[userId]:
                for tempKey in users[userId]["invitations"]:
                    if "eventId" in users[userId]["invitations"][tempKey] and users[userId]["invitations"][tempKey]["eventId"] == eventId:
                        FirebaseManager.deleteFromFB("users/{}/invitations/{}".format(userId, tempKey))
            if "goingEvents" in users[userId]:
                for i in range(0, len(users[userId]["goingEvents"])):
                    if users[userId]["goingEvents"][i] == eventId:
                        FirebaseManager.deleteFromFB("users/{}/goingEvents/{}".format(userId, str(i)))
