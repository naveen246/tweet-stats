import cgi
import urllib
import webapp2
import json

import jinja2
import os

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))
	
def renderTemplate(self, htmlPage, template_values):
	template = jinja_environment.get_template("/templates/"+htmlPage)
	self.response.out.write(template.render(template_values))

class MainPage(webapp2.RequestHandler):
    def get(self):
		renderTemplate(self, 'home.html', {})

class Cloud(webapp2.RequestHandler):
	def post(self):
		tweetDataStr = self.request.get("twitterData")
		tweetStat = json.loads(tweetDataStr)
		template_values = {
			"tweetStat" : tweetStat
		}
		renderTemplate(self, 'output.html', template_values)


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/output', Cloud)],
                              debug=True)