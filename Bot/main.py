import asyncio
from config.settings import sortOrder, fields, filters_premium, filters_free, CANAL_PREMIUM_ID, CANAL_FREE_ID, TOKEN_FREE, TOKEN_PREMIUM, PREMIUM, FREE
from handlers.send_data import send_data
from utilities.log_message import log_message
from multiprocessing import Process

SLEEP = 5 # minutes

async def send_data_every_minute(token, sortOrder, fields, canal_id, filters, state):
    while True:
        await send_data(token, sortOrder, fields, canal_id, filters, state)
        log_message('Esperando...')
        await asyncio.sleep(SLEEP * 60)

def process_function(*args):
    asyncio.run(send_data_every_minute(*args))

if __name__ == '__main__':
    process_premium = Process(target=process_function, args=(TOKEN_PREMIUM, sortOrder, fields, CANAL_PREMIUM_ID, filters_premium, PREMIUM))
    process_free = Process(target=process_function, args=(TOKEN_FREE, sortOrder, fields, CANAL_FREE_ID, filters_free, FREE))

    process_premium.start()
    process_free.start()

    process_premium.join()
    process_free.join()