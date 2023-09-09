import httpx
import asyncio
import random
import time
from api_functions import get_api_data, update_product
from log_functions import log_message
from telegram import Bot
from telegram.error import BadRequest, InvalidToken, TimedOut

async def send_product_to_telegram(client, bot, product, CANAL_ID):
    product_id = product.get('product_id', None)
    image_url = product.get('image_url')
    message = product.get('message')
    thread_ids = product.get('thread_id', [])
    state = product.get('state')

    max_retries = 3

    for thread_id in thread_ids:
        for attempt in range(1, max_retries + 1):
            try:
                result = await bot.send_photo(
                    chat_id=CANAL_ID[state], photo=image_url, caption=message, 
                    reply_to_message_id=thread_id, parse_mode='HTML'
                )
                
                if result.message_id:
                    publishing_time = int(time.time()) + (4 * 3600)

                    props = {
                        'sent': True,
                        'publishing_time': publishing_time,
                        'state': 'FREE',
                        'thread_id': [18]
                    }

                    log_message(f'El producto id: {product_id} se publicó correctamente')
                    await update_product(client, product_id, props)
                    break
            except BadRequest as e:
                log_message(f'Error {attempt} al responder al mensaje {thread_id}: Hubo un error al enviar el mensaje al chat: {e}.')
                if attempt < max_retries:
                    log_message('Se intentará enviar el mensaje nuevamente en 5 segundos.')
                    await asyncio.sleep(5)
                else:
                    log_message(f'Se han alcanzado el máximo número de intentos para el mensaje {thread_id}. No se enviará el producto.')
            except TimedOut as e:
                log_message(f'Error de tiempo de espera al enviar el mensaje {thread_id}: {e}')
                if attempt < max_retries:
                    log_message(f'Se intentará enviar el mensaje nuevamente en 5 segundos.')
                    await asyncio.sleep(5)
                else:
                    log_message(f'Se han alcanzado el máximo número de intentos para el mensaje {thread_id}. No se enviará el producto.')

async def send_data(TOKEN, sortOrder, fields, CANAL_ID, filters):
    total_page = 1
    page = 1
    async with httpx.AsyncClient() as client:
        count_error = 1
        max_count_error = 3

        while page <= total_page and count_error <= max_count_error:
            api_data = await get_api_data(client, page, sortOrder, fields, filters)

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
                            
                    await send_product_to_telegram(client, bot, product, CANAL_ID)
                page += 1
                await asyncio.sleep(1)
            else:
                log_message(f'Error {count_error}: Hubo un error al obtener los datos de la API.')
                if count_error < max_count_error:
                    log_message(f'Se intentará acceder a la API nuevamente en 5 segundos.')
                await asyncio.sleep(5)
                count_error += 1