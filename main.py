#!/usr/bin/env python3

import os,sys,re
import requests
import urllib
import threading
import Queue

from BeautifulSoup import *
from pprint import pprint
from ConfigParser import *

###   global   ###
mutex = threading.Lock()
queue = Queue.Queue()

queue = Queue.Queue()

#ini_file = ConfigParser

from utils import stdout
from database import *

class Worker(threading.Thread):
    def __init__(self, queue):
        threading.Thread.__init__(self)
        self.queue = queue
        self.start()
    
    def run(self): 
        while True: 
            if self.queue.empty():
                break;
            caller, args = self.queue.get()
            caller(args)
            self.queue.task_done()

def do_somethinking(arg):
    pass

def fetch():
   for i in xrange(100):
       queue.put((do_something, arg))

### main ###
if __name__ == '__main__':
    # maybe some dates
    fetch()
