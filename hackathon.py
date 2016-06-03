import webapp2
import json
from events import Event
from users import User
import event_actions
from firebaseManager import FirebaseManager

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Whats up ?, remember we have a meeting on Sunday.\n see you then :D')

class BhadelPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Sho ya bhadel ?')


class Events(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        userId = body["userId"]
        body.pop("userId", None)
        Event.createEvent(userId, body)
        self.response.write('OK')


class Register(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        User.registerUser(body)
        self.response.write('OK')


class DB(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        event_actions.updateDB(body["eventType"], body["shoppingList"])
        self.response.write('OK')

class Test(webapp2.RequestHandler):
    def get(self):
        pokerArr = []
        pokerArr.append(["xl", "beer", "snacks"])
        # pokerArr.append(["bagel", "cups", "drinks", "sunflowerSeeds"])
        # pokerArr.append(["drinks", "cups", "snacks"])
        # pokerArr.append(["pokerset", "chips", "beer", "coke", "sunflowerSeeds"])
        # pokerArr.append(["drinks", "sunflowerSeeds", "pizza"])
        # pokerArr.append(["pizza", "beer"])
        # pokerArr.append(["pizza", "beer"])
        # pokerArr.append(["pizza", "beer"])
        # dinnerArr = []
        # dinnerArr.append(["pizza", "cups", "drinks"])
        # dinnerArr.append(["coke", "cups", "napkins"])
        # dinnerArr.append(["icecream", "spoons", "cookies"])
        # dinnerArr.append(["salt", "meat", "beer"])
        # dinnerArr.append(["meat", "beer", "knives", "forks"])
        # breakfastArr = []
        # breakfastArr.append(["coffee", "eggs", "milk"])
        # breakfastArr.append(["coffee", "milk", "sugar"])
        # breakfastArr.append(["eggs", "salt", "tomatoes"])
        # breakfastArr.append(["tea", "milk", "sugar"])
        # bbqArr =[]
        # bbqArr.append(["meat", "beer", "coal", "lighter"])
        # bbqArr.append(["meat", "beer", "bottleOpenner", "grill"])
        # bbqArr.append(["meat", "grill", "coal"])

        for arr in pokerArr:
            event_actions.updateDB("PokerNight", arr)
        # for arr in dinnerArr:
        #     event_actions.updateDB("Dinner", arr)
        # for arr in breakfastArr:
        #     event_actions.updateDB("Breakfast", arr)
        # for arr in bbqArr:
        #     event_actions.updateDB("Barbeque", arr)

        self.response.write('OK')


class Suggested(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        eventType = ""
        shoppingList=[]
        if "eventType" in body:
            eventType = body["eventType"]
        if "shoppingList" in body:
            shoppingList = body["shoppingList"]
        res = event_actions.getSuggestedItems(eventType, shoppingList)
        self.response.write(json.dumps(res))


class AllUserEvents(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        userId = body["userId"]
        self.response.write(json.dumps(Event.getUserEvents(userId)))


class GetEvent(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        eventId = body["eventId"]
        self.response.write(json.dumps(Event.getEvent(eventId)))


class CleanEvent(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        eventId = body["eventId"]
        Event.removeEvent(eventId)

        self.response.write("Clean")


class Names(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        userIds = json.loads(self.request.body)
        names = []
        for i in range(0, len(userIds)):
            user = json.loads(FirebaseManager.getFromFB("users/"+userIds[i]))
            if "firstName" in user:
                names.append(user["firstName"])
            else:
                names.append("")
        self.response.write(json.dumps(names))

class Items(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        eventId = body["eventId"]
        shoppingList = body["shoppingList"]
        FirebaseManager.saveToFB(shoppingList, "events/upcoming/{}/shoppingList".format(eventId))
        self.response.write("ok")


class Dates(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        eventId = body["eventId"]
        goodDates = body["goodDates"]
        userId = body["userId"]
        Event.confirmDates(eventId, userId, goodDates)
        self.response.write("ok")

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/bhadel', BhadelPage),
    ('/createevent', Events),
    ('/register', Register),
    ('/db', DB),
    ('/suggested', Suggested),
    ('/alluserevents', AllUserEvents),
    ('/cleanevent', CleanEvent),
    ('/names', Names),
    ('/event', GetEvent),
    ('/items', Items),
    ('/dates', Dates),

    # ('/test', Test),
], debug=True)
