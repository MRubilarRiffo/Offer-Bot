import asyncio
from config.settings import sortOrder, fields, filters_premium, filters_free, CANAL_PREMIUM_ID, CANAL_FREE_ID, TOKEN_FREE, TOKEN_PREMIUM
from handlers.send_data import send_data
from utilities.log_message import log_message

SLEEP = 5 # minutes

async def send_data_every_minute(token, sortOrder, fields, canal_id, filters):
    while True:
        await send_data(token, sortOrder, fields, canal_id, filters)
        log_message('Esperando...')
        await asyncio.sleep(SLEEP * 60)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    
    task1 = loop.create_task(send_data_every_minute(TOKEN_PREMIUM, sortOrder, fields, CANAL_PREMIUM_ID, filters_premium))
    task2 = loop.create_task(send_data_every_minute(TOKEN_FREE, sortOrder, fields, CANAL_FREE_ID, filters_free))

    gathered = asyncio.gather(task1, task2)

    loop.run_until_complete(gathered)