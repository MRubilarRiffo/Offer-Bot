import asyncio
from config.settings import TOKEN, CANAL_ID, sortOrder, fields, filters, CANAL_PREMIUM_ID, CANAL_FREE_ID
from handlers.send_data import send_data
from utilities.log_message import log_message

SLEEP = 5 # minutes

async def check_api_every_minute():
    while True:
        await send_data(TOKEN, sortOrder, fields, CANAL_ID, filters)
        log_message('Esperando...')
        await asyncio.sleep(SLEEP * 60)

if __name__ == '__main__':
    asyncio.run(check_api_every_minute())