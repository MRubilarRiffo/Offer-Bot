import json
import httpx
import asyncio
from telegram import Update, Bot
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import io

TOKEN = '6619933255:AAEyi6kY1O7KWq_Ysm-IixjUwcdPhm1I5tg'
CANAL_ID = -1001871217917  # Asegúrate de usar el ID correcto de tu canal

sent_products = set()

async def get_api_data(page):
    api_url = f'https://knasta.cl/_next/data/8223c0c755711a83aabf91debc5a3fba60bf78b3/es/results.json?knastaday=1&d=-0&page={page}'
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)
        if response.status_code == 200:
            return response.json()
        else:
            return None

async def send_data(bot: Bot):
    total_page = 1
    page = 1
    while True:
        api_data = await get_api_data(page)
        total_page = api_data["pageProps"]["initialData"]["total_pages"]

        print(f"Page: {page}")
        print(f"Total Page: {total_page}")

        new_products_sent = False
        if api_data:
            products = api_data["pageProps"]["initialData"]["products"]
            for product in products:
                product_id = product.get('product_id', None)  # Asumiendo que cada producto tiene un ID único
                if product_id not in sent_products:
                # Suponiendo que el diccionario del producto tiene las claves 'title', 'price' y 'url'
                    title = product.get('brand_title')
                    firts_price = product.get('formated_last_variation_price')
                    last_price = product.get('formated_current_price')
                    url = product.get('url')
                    store = product.get('retail_label')[0]
                    discount = product.get('percent')
                    image_url = product.get('image')

                    message = f"\n✅ {title}\n\n🛒 {store}\n\n💰 {firts_price} --> {last_price} ({discount}%)\n\n😎 {url}"

                    async with httpx.AsyncClient() as client:
                        response = await client.get(image_url)
                        image_data = io.BytesIO(response.content)
                        await bot.send_photo(chat_id=CANAL_ID, photo=image_data, caption=message)

                # await context.bot.send_message(chat_id=CANAL_ID, text=message)
                    # await bot.send_message(chat_id=CANAL_ID, text=message)
                    sent_products.add(product_id)
                    new_products_sent = True
                    await asyncio.sleep(10)
            if new_products_sent:
                print("Se enviaron nuevos productos.")
            else:
                print("No hay productos nuevos.")
        else:
            await bot.send_message(CANAL_ID, "Hubo un error al obtener los datos de la API.")

        if page >= total_page:
            break
        else:
            page += 1

        await asyncio.sleep(60)

async def check_api_every_minute():
    bot = Bot(token=TOKEN)
    while True:
        await send_data(bot)
        await asyncio.sleep(300)

if __name__ == '__main__':
    asyncio.run(check_api_every_minute())
