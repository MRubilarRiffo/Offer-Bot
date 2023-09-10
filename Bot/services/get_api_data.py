import httpx
from utilities.log_message import log_message

async def get_api_data(client, page, sortOrder, fields, filters):
    api_url = f'http://localhost:3001/products?sortOrder={sortOrder}&fields={fields}&page={page}&{filters}'
    try:
        response = await client.get(api_url)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        log_message(f'Error: {e}')
        return None