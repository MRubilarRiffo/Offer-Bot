import asyncio
from config.settings import sortOrder, fields, filters_premium, filters_free, CANAL_PREMIUM_ID, CANAL_FREE_ID, TOKEN_FREE, TOKEN_PREMIUM
from handlers.send_data import send_data
from utilities.log_message import log_message

SLEEP = 5 # minutes

async def check_api_every_minute():
    while True:
        task_premium = asyncio.create_task(send_data(TOKEN_PREMIUM, sortOrder, fields, CANAL_PREMIUM_ID, filters_premium))
        task_free = asyncio.create_task(send_data(TOKEN_FREE, sortOrder, fields, CANAL_FREE_ID, filters_free))

        await asyncio.gather(task_premium, task_free)

        log_message('Esperando...')
        await asyncio.sleep(SLEEP * 60)

if __name__ == '__main__':
    asyncio.run(check_api_every_minute())