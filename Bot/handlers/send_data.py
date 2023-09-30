import httpx
from services.get_api_data import get_api_data
from utilities.log_message import log_message
from .send_product import send_product
from telegram import Bot
from telegram.error import InvalidToken

async def send_data(TOKEN, sortOrder, fields, CANAL_ID, filters, state):
    total_page = 1
    page = 1
    token_index = 0

    async with httpx.AsyncClient() as client:
        while page <= total_page:
            api_data = await get_api_data(client, page, sortOrder, fields, filters)
            
            page += 1

            if not api_data:
                break

            total_page = api_data.get('metadata', None).get('totalPages', None)
            products = api_data.get('data', None)

            if (not total_page or not products):
                break

            for product in products:
                max_retries = 3

                for attempt in range(max_retries):
                    try:
                        token = TOKEN[token_index % len(TOKEN)]
                        bot = Bot(token=token)
                        await send_product(client, bot, product, CANAL_ID, state)
                        token_index += 1
                        break
                    except InvalidToken:
                        log_message(f'Token inválido: {token}')
                        token_index += 1
                        if attempt < max_retries - 1:
                            log_message('Se intentará con el siguiente token.')