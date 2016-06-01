import webapp2

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Whats up bitches?, remember we have a meeting on Sunday.\n see you then :D')

class BhadelPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Sho ya bhadel ?')

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/bhadel', BhadelPage),
], debug=True)
