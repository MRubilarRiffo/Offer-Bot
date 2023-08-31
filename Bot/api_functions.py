import httpx

async def get_api_data(client, page, sortOrder, fields):
    api_url = f'http://localhost:3001/products?sortOrder={sortOrder}&fields={fields}&page={page}'
    try:
        response = await client.get(api_url)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError:
        return None
