import psycopg2
import traceback
import json
from psycopg2.extras import RealDictCursor

config = json.load(open('./config.json'))

host=config['host']
port=config['port']
user=config['user']
password=config['password']
db=config['db']

class Postgres(object):
    # def __init__(self, *args, **kwargs):
    #     self.dbName = args[0] if len(args) > 0 else 'prod'
    #     self.args = args

    def _connect(self, msg=None):
        dsn = f'host={host} port={port} user={user} password={password} dbname={db}'

        try:
            self.con = psycopg2.connect(dsn)
            self.cur = self.con.cursor(cursor_factory=RealDictCursor)
        except:
            traceback.print_exc()

    def __enter__(self, *args, **kwargs):
        self._connect()
        return (self.con, self.cur)

    def __exit__(self, *args):
        for c in ('cur', 'con'):
            try:
                obj = getattr(self, c)
                obj.close()
            except:
                pass # handle it silently!?
        self.args, self.dbName = None, None