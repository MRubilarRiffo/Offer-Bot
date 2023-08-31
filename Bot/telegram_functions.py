import io
import httpx
import asyncio
from api_functions import get_api_data

async def send_product_to_telegram(client, bot, product, CANAL_ID, sent_products):
    product_id = product.get('product_id', None)
    if product_id not in sent_products:
        title = product.get('name')
        firts_price = product.get('first_price')
        last_price = product.get('last_price')
        url = product.get('url')
        store = ' - '.join(product.get('store'))
        discount = product.get('discount')
        image_url = product.get('image_url')

        message = f"\n✅ {title}\n\n🛒 {store}\n\n💰 ${firts_price} --> ${last_price} ({discount}%)\n\n😎 {url}"

        try:
            response = await client.get(image_url)
            response.raise_for_status()
            image_data = io.BytesIO(response.content)
            await bot.send_photo(chat_id=CANAL_ID, photo=image_data, caption=message)
        except httpx.HTTPError:
            await bot.send_message(CANAL_ID, "Hubo un error al obtener la imagen del producto.")

        sent_products.add(product_id)
        await asyncio.sleep(15)

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
                print(f"Error {count_error}: Hubo un error al obtener los datos de la API.")
                if count_error < max_count_error:
                    print(f"Se intentará acceder a la API nuevamente en 5 segundos")
                await asyncio.sleep(5)
                count_error += 1
