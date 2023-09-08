import asyncio
from config import TOKEN, CANAL_ID, sortOrder, fields, filters
from telegram_functions import send_data
from log_functions import log_message

async def check_api_every_minute():
    while True:
        await send_data(TOKEN, sortOrder, fields, CANAL_ID, filters)
        log_message('Esperando...')
        await asyncio.sleep(300)

if __name__ == '__main__':
    asyncio.run(check_api_every_minute())
