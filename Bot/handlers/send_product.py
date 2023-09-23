import asyncio
import time
from services.update_product import update_product
from utilities.log_message import log_message
from utilities.threadSelector import threadSelector
from telegram.error import BadRequest, TimedOut
import httpx
import io

PREMIUM = 'PREMIUM'
FREE = 'FREE'

async def fetch_image(client, url):
    response = await client.get(url)

    if response.status_code == 200:
        photo = io.BytesIO(response.content)
        photo.name = "image.jpg"

        return photo
    else:
        log_message(f"No se pudo descargar la imagen. Código de estado: {response.status_code}.")
        return None

async def send_product(client, bot, product, CANAL_ID):
    product_id = product.get('product_id', None)
    image_url = product.get('image_url')
    message = product.get('message')
    state = product.get('state')
    store = product.get('store')
    discount = product.get('discount')

    thread_id = threadSelector(discount, store, state)

    photo = await fetch_image(client, image_url)

    if (not photo):
        log_message(f'No se envió el producto: {product_id}')
        return

    max_retries = 3

    for attempt in range(1, max_retries + 1):
        try:
            result = await bot.send_photo(
                chat_id=CANAL_ID,
                photo=photo,
                caption=message,
                reply_to_message_id=thread_id,
                parse_mode='HTML'
            )

            props = {
                'sent': True,
                'publishing_time': int(time.time()) + (4 * 60 * 60) if state == PREMIUM else 1,
                'state': FREE,
            }

            if result.message_id:
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