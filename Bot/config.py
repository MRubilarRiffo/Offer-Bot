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
OFFER_PRICE = 'offer_price'
NORMAL_PRICE = 'normal_price'
DISCOUNT = 'discount'
ID = 'product_id'

sortOrder = ASC
fields = f'{NAME},{IMAGE_URL},{URL},{STORE},{NORMAL_PRICE},{OFFER_PRICE},{DISCOUNT},{ID}'

sent_products = set()