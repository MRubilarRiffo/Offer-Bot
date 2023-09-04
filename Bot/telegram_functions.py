import io
import httpx
import asyncio
from api_functions import get_api_data
from log_functions import log_message
from telegram.error import BadRequest

async def send_product_to_telegram(client, bot, product, CANAL_ID, sent_products):
    product_id = product.get('product_id', None)
    if product_id not in sent_products:
        name = product.get('name')
        firts_price = product.get('offer_price')
        normal_price = product.get('normal_price')
        url = product.get('url')
        store = ' - '.join(product.get('store'))
        discount = product.get('discount')
        image_url = product.get('image_url')

        message = f"\n✅ {name}\n\n🛒 {store}\n\n💰 ${normal_price} --> ${firts_price} ({discount}%)\n\n😎 [Producto]({url})"

        count_error = 1
        max_count_error = 3
        while count_error <= max_count_error:
            try:
                response = await client.get(image_url)
                response.raise_for_status()
                image_data = io.BytesIO(response.content)
                await bot.send_photo(chat_id=CANAL_ID, photo=image_data, caption=message, reply_to_message_id=15)
                break
            except httpx.HTTPError:
                log_message(f"Error {count_error}: Hubo un error al obtener la imagen del producto.")
                if count_error < max_count_error:
                    log_message(f"Se intentará obtener la imagen nuevamente en 5 segundos.")
                await asyncio.sleep(5)
                count_error += 1
            except BadRequest as e:
                log_message(f"Error {count_error}: Hubo un error al enviar el mensaje al chat: {e}.")
                if count_error < max_count_error:
                    log_message(f"Se intentará enviar el mensaje nuevamente en 5 segundos.")
                await asyncio.sleep(5)
                count_error += 1

        sent_products.add(product_id)
        await asyncio.sleep(15) #Espera entre productos

async def send_data(bot, sortOrder, fields, CANAL_ID, sent_products):
    total_page = 1
    page = 1
    async with httpx.AsyncClient() as client:
        count_error = 1
        max_count_error = 3
        while page <= total_page and count_error <= max_count_error:
            api_data = await get_api_data(client, page, sortOrder, fields)
            if api_data:
                total_page = api_data["metadata"]["totalPages"]
                for product in api_data["data"]:
                    await send_product_to_telegram(client, bot, product, CANAL_ID, sent_products)
                page += 1
            else:
                log_message(f"Error {count_error}: Hubo un error al obtener los datos de la API.")
                if count_error < max_count_error:
                    log_message(f"Se intentará acceder a la API nuevamente en 5 segundos.")
                await asyncio.sleep(5)
                count_error += 1
