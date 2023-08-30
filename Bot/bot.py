import json
import httpx
import asyncio
from telegram import Update, Bot
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import io
from dotenv import load_dotenv
import os

load_dotenv()

TOKEN = os.environ.get('TOKEN')
CANAL_ID = os.environ.get('CANAL_ID')

sortOrder = 'asc'
fields = 'name,image_url,url,store,first_price,last_price,discount,product_id'

sent_products = set()

async def get_api_data(client, page):
    api_url = f'http://localhost:3001/products?sortOrder={sortOrder}&fields={fields}&page={page}'
    try:
        response = await client.get(api_url)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError:
        return None

async def send_data(bot: Bot):
    total_page = 1
    page = 1
    async with httpx.AsyncClient() as client:
        while page <= total_page:
            api_data = await get_api_data(client, page)
            if api_data:
                total_page = api_data["metadata"]["totalPages"]

                print(f"Page: {page}")
                print(f"Total Page: {total_page}")

                new_products_sent = False
                products = api_data["data"]
                for product in products:
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
                        new_products_sent = True
                        await asyncio.sleep(15)
                if new_products_sent:
                    print("Se enviaron nuevos productos.")
                else:
                    print("No hay productos nuevos.")
                page += 1
            else:
                await bot.send_message(CANAL_ID, "Hubo un error al obtener los datos de la API.")

async def check_api_every_minute():
    bot = Bot(token=TOKEN)
    while True:
        await send_data(bot)
        await asyncio.sleep(300)

if __name__ == '__main__':
    asyncio.run(check_api_every_minute())
