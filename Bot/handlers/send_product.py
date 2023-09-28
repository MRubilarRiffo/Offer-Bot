import io
import time
import asyncio
from services.update_product import update_product
from utilities.log_message import log_message
from utilities.threadSelector import threadSelector
from telegram.error import BadRequest, TimedOut

PREMIUM = 'PREMIUM'
FREE = 'FREE'

async def fetch_image(client, url):
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            response = await client.get(url)
            response.raise_for_status()  # Lanza una excepción si el código HTTP es 400 o superior.

            photo = io.BytesIO(response.content)
            photo.name = "image.jpg"
            return photo
        except asyncio.TimeoutError:
            log_message(f"Timeout al intentar descargar la imagen. Intento {attempt}.")
        except Exception as e:
            log_message(f"No se pudo descargar la imagen. Error: {e}. Intento {attempt}.")
        
        if attempt < max_retries:
            log_message('Reintentando en 5 segundos...')
            await asyncio.sleep(5)

    log_message("Se han agotado los intentos para descargar la imagen.")
    return None

async def send_product(client, bot, product, CANAL_ID):
    product_id = product.get('product_id', None)
    image_url = product.get('image_url', None)
    message = product.get('message', None)
    state = product.get('state', None)
    store = product.get('store', None)
    discount = product.get('discount', None)

    if (not product_id or not image_url or not message or not state or not store or not discount):
        return

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
        except BadRequest as e:
            log_message(f'BadRequest. No se pudo enviar el producto. Error {attempt}: {e}')
        except TimedOut as e:
            log_message(f'TimedOut. No se pudo enviar el producto. Error {attempt}: {e}')
        except Exception as e:
            log_message(f"No se pudo enviar el producto. Error: {e}. Intento {attempt}.")
            
        if attempt < max_retries:
            log_message('Reintentando en 5 segundos...')
            await asyncio.sleep(5)
        else:
            log_message("Se han agotado los intentos para descargar la imagen.")