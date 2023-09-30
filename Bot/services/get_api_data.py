import httpx
import time
from utilities.log_message import log_message

async def get_api_data(client, page, sortOrder, fields, filters):
    date = int(time.time()) + (4 * 60 * 60)

    api_url = f'http://localhost:3001/products?sortOrder={sortOrder}&fields={fields}&page={page}&{filters}&date={date}'

    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = await client.get(api_url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            log_message(f'Error: {e}')
            if attempt < max_retries - 1:
                log_message('Se intentará la conexión nuevamente.')
            else:
                return None