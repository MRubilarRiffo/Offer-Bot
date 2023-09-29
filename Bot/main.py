from multiprocessing import Process
from config.settings import sortOrder, fields, filters_premium, filters_free, CANAL_PREMIUM_ID, CANAL_FREE_ID, TOKEN_FREE, TOKEN_PREMIUM
from handlers.send_data import send_data
from utilities.log_message import log_message
import time

SLEEP = 5 # minutes

def send_data_every_minute(token, sortOrder, fields, canal_id, filters):
    while True:
        send_data(token, sortOrder, fields, canal_id, filters)
        log_message('Esperando...')
        time.sleep(SLEEP * 60)

if __name__ == '__main__':
    process_premium = Process(target=send_data_every_minute, args=(TOKEN_PREMIUM, sortOrder, fields, CANAL_PREMIUM_ID, filters_premium))
    process_free = Process(target=send_data_every_minute, args=(TOKEN_FREE, sortOrder, fields, CANAL_FREE_ID, filters_free))

    process_premium.start()
    process_free.start()

    process_premium.join()
    process_free.join()