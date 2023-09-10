import httpx
from utilities.log_message import log_message

async def update_product(client, id, props):
    api_url = f'http://localhost:3001/products/{id}'
    try:
        response = await client.post(api_url, json=props)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        log_message(f'Error: {e}')
        return None