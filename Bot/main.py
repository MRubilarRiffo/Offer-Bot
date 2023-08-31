import sys
import asyncio
from telegram import Bot
from telegram.error import InvalidToken
from config import TOKEN, CANAL_ID, sortOrder, fields, sent_products
from telegram_functions import send_data

async def check_api_every_minute():
    try:
        bot = Bot(token=TOKEN)
    except InvalidToken:
        print("El token proporcionado no es válido. Asegúrate de usar el token correcto del BotFather.")
        sys.exit(1)

    while True:
        await send_data(bot, sortOrder, fields, CANAL_ID, sent_products)
        print("Esperando...")
        await asyncio.sleep(300)

if __name__ == '__main__':
    asyncio.run(check_api_every_minute())
