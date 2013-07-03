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

ini_file = ConfigParser

from utils import stdout

class Worker(threading.Thread):
    def __init__(self, queue):
        threading.Thread.__init__(self)
        self.queue = queue
        self.start()
    
    def run(self): 
        while True: 
            if self.queue.empty():
                break;
            caller, singer, url = self.queue.get()
            caller(singer, url)
            self.queue.task_done()


class Roboto:  
    def __init__(self):
        pass

    def urls():
        '''
            read the init url file and get the line one by one
        '''
        for url in open('singers.list'):
            yield url.strip()
    
    def fetch(singer, url):
        if not singer or not url:
            return
        cate_name = singer
        tags = singer#.decode('utf8')
        update_count = 0
        fetched = {url}
        while url:
            response = requests.get(url)
            page_content = response.content
            page_content = page_content.decode('gbk','ignore')
        
            soup = BeautifulSoup(''.join(page_content))
            ring_list = soup.find('div', attrs={'id':'ll'}).findAll('ul')
            for ring_item in ring_list:
                if ring_item.get('class') and ring_item['class'] == 'titl':
                    continue
    
                title = ring_item.find('li', attrs={'class':'ll-n'}).find('a').renderContents()
                ring_html = ring_item.find('li', attrs={'class':'ll-n'}).find('a')['href']
                ring_html = host + '/' + ring_html[3:]
        
                length = ring_item.find('li', attrs={'class':'ll-c'}).renderContents().replace('秒','').strip()
                topic = ring_item.find('li', attrs={'class':'ll-z'}).find('a')
                if topic:
                    topic = topic.renderContents()
                sub_cate = ring_item.find('li', attrs={'class':'ll-l'}).renderContents()
        
                rr = requests.get(ring_html)
                ring_html_content = rr.content.decode('gbk')
                ring_id = re.findall(u';var ringid=(.*);var ringtitle=', ring_html_content, re.DOTALL)
                if ring_id:
                    ring_id = ring_id[0]
                else:
                    continue
                ring_url = 'http://d1.v3gp.com:86/v3gp_down.php?aid=' + ring_id
                ring_cookie = 'm_' + ring_id + '=ok; fd_' + ring_id + '=ok;' 
        
                rid = int(ring_id) + 10000000
                rate = ''
                dcount = ''
                author = ''
                source = 'v3gp'
        
                # fix for UnicodeDecodeError
                title = to_utf8(escape_html(title))
                sub_cate = to_utf8(escape_html(sub_cate))
                tag = singer + ',' + sub_cate
                if topic:
                    tag = tag + ',' + topic
                tag = to_utf8(tag)
        
                #print rid, cate_name,ring_url, title, tag, rate, dcount, length, author, source
                rt = iRingtone(rid, cate_name, ring_url, title, tag, rate, dcount, length, author, source)
                mutex.acquire()
                if rt_is_exist(rt):
                    print 'rid ' + str(rid) + ' exists. SKIP'
                    mutex.release()
                    continue
        
                upload_rt(rt, save=True, cookie=ring_cookie)
                write_rt_to_db2(rt=rt) 
                mutex.release()
    
            next_page = re.findall(u'.*<a href="(.*)">下一页<\/a> <a href=', page_content, re.DOTALL)
            if len(next_page)>0:
                next_url = url_prefix(url) + next_page[0]
                if next_url in fetched:
                    url = None
                else:
                    url = next_url
                    fetched.add(next_url)
            else:
                url = None
            
    def get_singers():
        singer_count = 0
    
        for page_url in urls():
            if (page_url): 
                base_url = url_prefix(page_url)
                response = requests.get(page_url)
                page_content = response.content
                page_content = page_content.decode('gbk', 'ignore')
                soup = BeautifulSoup(''.join(page_content))
                singers = soup.find('div', attrs={'id':'author'}).find('ul').findAll('li')
                for singer in singers:
                    if(singer.find('a') == None):
                        continue
                    singer_count += 1
                    # starts threads here
                    queue.put((get_musics, singer.find('a').renderContents('utf-8'), base_url+singer.find('a')['href']))
                    #print singer.find('a').renderContents('utf-8'), base_url+singer.find('a')['href']
        for i in xrange(30):
            Worker(queue)

def main():
    


if __name__ == '__main__':
    main()
