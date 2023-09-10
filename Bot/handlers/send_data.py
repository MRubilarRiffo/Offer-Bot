import httpx
import asyncio
import random
from services.get_api_data import get_api_data
from utilities.log_message import log_message
from .send_product import send_product
from telegram import Bot
from telegram.error import InvalidToken

async def send_data(TOKEN, sortOrder, fields, CANAL_ID, filters):
    total_page = 1
    page = 1
    async with httpx.AsyncClient() as client:
        count_error = 1
        max_count_error = 3

        while page <= total_page and count_error <= max_count_error:
            api_data = await get_api_data(client, page, sortOrder, fields, filters)

            # if not api_data:

            #     continue

            if api_data:
                total_page = api_data['metadata']['totalPages']

                for product in api_data['data']:
                    count_error = 1
                    max_count_error = 3
                    while count_error <= max_count_error:
                        token_aleatorio = random.choice(TOKEN)
                        try:
                            bot = Bot(token=token_aleatorio)
                            break
                        except InvalidToken:
                            log_message(f'Token inválido: ${token_aleatorio}')
                            if count_error < max_count_error:
                                log_message('Se intentará enviar el mensaje nuevamente.')
                                await asyncio.sleep(1)
                                count_error += 1
                            
                    await send_product(client, bot, product, CANAL_ID)
                page += 1
                await asyncio.sleep(1)
            else:
                log_message(f'Error {count_error}: Hubo un error al obtener los datos de la API.')
                if count_error < max_count_error:
                    log_message(f'Se intentará acceder a la API nuevamente en 5 segundos.')
                await asyncio.sleep(5)
                count_error += 1