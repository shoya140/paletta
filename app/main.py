import tornado.ioloop
import tornado.options
import tornado.web
import os.path

from tornado.options import define, options

define("port", default=8000, help="run on the given port", type=int)
define("debug", default=0, help="1:watch in real time (debug mode)", type=bool)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
                (r'/', IndexHandler),
                (r'/ga/?', GAHandler)
                ]
        settings = dict(
            debug = options.debug,
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static")
            )
        tornado.web.Application.__init__(self, handlers, **settings)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html', colors=10, url="http://paletta.mrk1869.com", title="Paletta - HSV Color palette for every Programmer")

class GAHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('ga.html', colors=12)

if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
