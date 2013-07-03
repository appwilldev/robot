
# using pymysql module
# python >= 3.0

import pymysql

'''
    use to connect to mysql
'''
class MySQL:
    def __init__(self, arg):
        self.conn = pymysql.connect(host=arg['host'], user=arg['user'], passwd=arg['passwd'], db=arg['db'], charset='utf8') 

    def query(sql): 
        if not sql: 
            return None
        try: 
            mutex.acquire()
            handler = self.conn.cursor()
            result = handler.execute(sql).fetchone()
            self.conn.commit()
            return result
        finally:
            mutex.release()

    def execute(sql): 
        if not sql: 
            return None
        try: 
            mutex.acquire()
            handler = self.conn.cursor()
            result = handler.execute(sql)
            self.conn.commit()
            return result
        finally:
            mutex.release()
