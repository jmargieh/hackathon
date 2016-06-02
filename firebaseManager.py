import logging
from google.appengine.api import urlfetch
import json

FBBaseURL 						= "https://glass-tribute-131519.firebaseio.com/"
FBAuth 							= '.json?auth=uf0EkFdwlCu1ZxrSrOaAvaXvNpDVaZf5SdXNCJi2'



class FirebaseManager:

    # returns the data from path. SYNC
    # takes additional optional query paramaters
    @staticmethod
    def getFromFB(path, params=None):
        try:
            logging.info("getting from Firebase")
            paramStr = ""
            if params:
                paramStr = "&"+str(params)
            url = str(FBBaseURL)+str(path)+str(FBAuth)+paramStr
            result = urlfetch.fetch(url)
            if result.status_code == 200:
                return result.content
            return {}
        except Exception, e:
            logging.exception(e)
            return{}


    # saves the data to path (erasing any previous data). ASYNC
    @staticmethod
    def saveToFB(data, path):
        logging.info("Saving to Firebase")
        url = str(FBBaseURL)+str(path)+str(FBAuth)
        rpc = urlfetch.create_rpc()
        urlfetch.make_fetch_call(rpc, url, payload=json.dumps(data), method='PUT')
        rpc.wait()

    #push data to FireBase
    @staticmethod
    def pushToFB(data,path):
        logging.info("Pushing to Firebase")
        url = str(FBBaseURL)+str(path)+str(FBAuth)
        res = json.loads(urlfetch.fetch(url, payload=json.dumps(data), method='POST'))
        if res is None or "name" not in res:
            return ""
        return res["name"]


    # deletes the data from path.
    @staticmethod
    def deleteFromFB(path):
        logging.info("deleting from Firebase")
        url = str(FBBaseURL)+str(path)+str(FBAuth)
        rpc = urlfetch.create_rpc()
        urlfetch.make_fetch_call(rpc, url,payload={}, method=urlfetch.DELETE)
        rpc.wait()

    # patches the data to path(without earasing any previous data).
    @staticmethod
    def patchToFB(data,path):
        logging.info("Saving to Firebase")
        url = str(FBBaseURL)+str(path)+str(FBAuth)
        rpc = urlfetch.create_rpc()
        urlfetch.make_fetch_call(rpc, url,payload=json.dumps(data), method='PATCH')
        rpc.wait()