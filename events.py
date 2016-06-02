from utils import Utils
from firebaseManager import FirebaseManager
import logging


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
                                          "invitees": []})
        # make the user accepted array, everyone except the creator defaults to pending
        usersAccepted = []
        for inviteeId in data["invitees"]:
            usersAccepted.append({"userId": inviteeId, "status": "pending"})
        usersAccepted.append({"userId": userId, "status": "confirmed"})
        # ###

        availableDates = data["availableDates"]
        for i in range(0, len(availableDates)):
            availableDates["usersAccepted"] = usersAccepted

        data["availableDates"] = availableDates
        data["invitees"].append(userId)  # add the creator
        res = FirebaseManager.pushToFB(data, "events/upcoming")

        data["invitees"].pop()  # remove the creator, no need to invite him
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
        res = FirebaseManager.getFromFB("events/upcoming/{}/availableDates/".format(eventId))
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
            pass
            # closeEventTime(eventId)

    @staticmethod
    def removeInvite(userId, eventId):
        """
        removes an event invite from user's invite list
        Args:
            userId:
            eventId:

        Returns:

        """
        invitations = FirebaseManager.getFromFB("users/{}/invitations/".format(userId))
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
        res = FirebaseManager.getFromFB("users/{}/goingEvents".format(userId))
        if res is None:
            res = []
        res.append(eventId)
        FirebaseManager.saveToFB(res, "users/{}/goingEvents".format(userId))
