import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.environ.get('TOKEN_2')
CANAL_ID = os.environ.get('CANAL_ID')

ASC = 'asc'
DESC = 'desc'

NAME = 'name'
IMAGE_URL = 'image_url'
URL = 'url'
STORE = 'store'
FIRST_PRICE = 'first_price'
LAST_PRICE = 'last_price'
DISCOUNT = 'discount'
ID = 'product_id'

sortOrder = ASC
fields = f'{NAME},{IMAGE_URL},{URL},{STORE},{FIRST_PRICE},{FIRST_PRICE},{DISCOUNT},{ID}'

sent_products = set()