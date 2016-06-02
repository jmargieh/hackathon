import webapp2
import json
from events import Event
from users import User


class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Whats up bitches?, remember we have a meeting on Sunday.\n see you then :D')

class BhadelPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Sho ya bhadel ?')


class Event(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        Event.createEvent(body)
        self.response.write('OK')


class Register(webapp2.RequestHandler):
    def post(self):
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        body = json.loads(self.request.body)
        User.registerUser(body)
        self.response.write('OK')

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/bhadel', BhadelPage),
    ('/createevent', Event),
    ('/register', Register),
], debug=True)
