
'''
    common utils 
'''

def stdout(msg): 
    try: 
        mutex.acquire()
        print(msg)
    finally:
        mutex.release()

def to_utf8(target):
    if not target:
        return target
    try: 
        target = unicode(target, 'utf-8', 'ignore')
    except:
        pass
    return target.encode('utf-8', 'ignore')


def escape_html(target):
    '''
       replace double quotes and single quotes
    '''
    if not target:
        return target
    target.replace('"', '&quot;')
    target.replace("'", '&apos;')
    target.replace('\\', '&#92;')
    return target
