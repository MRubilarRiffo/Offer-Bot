import asyncio
import time
from services.update_product import update_product
from utilities.log_message import log_message
from telegram.error import BadRequest, TimedOut

async def send_product(client, bot, product, CANAL_ID):
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

                if result.message_id and state == 'PREMIUM':
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
            except (BadRequest, TimedOut) as e:
                error_type = "BadRequest" if isinstance(e, BadRequest) else "TimedOut"
                log_message(f'Error {error_type} {attempt} al enviar el mensaje: {e}')
                if attempt < max_retries:
                    log_message('Se intentará enviar el mensaje nuevamente en 5 segundos.')
                    await asyncio.sleep(5)
                else:
                    log_message(f'Se ha alcanzado el máximo número de intentos. No se enviará el producto.')