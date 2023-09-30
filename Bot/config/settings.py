import os
from dotenv import load_dotenv

load_dotenv()

TOKEN_PREMIUM = os.environ.get('TOKEN_PREMIUM').replace('\n', '').replace(' ', '').split(',')
TOKEN_FREE = os.environ.get('TOKEN_FREE').replace('\n', '').replace(' ', '').split(',')

CANAL_FREE_ID = os.environ.get('CANAL_FREE_ID')

THREAD_ID_20_DCTO_FREE = os.environ.get('THREAD_ID_20_DCTO_FREE')
THREAD_ID_30_DCTO_FREE = os.environ.get('THREAD_ID_30_DCTO_FREE')
THREAD_ID_40_DCTO_FREE = os.environ.get('THREAD_ID_40_DCTO_FREE')
THREAD_ID_50_DCTO_FREE = os.environ.get('THREAD_ID_50_DCTO_FREE')
THREAD_ID_60_DCTO_FREE = os.environ.get('THREAD_ID_60_DCTO_FREE')
THREAD_ID_70_DCTO_FREE = os.environ.get('THREAD_ID_70_DCTO_FREE')

THREAD_ID_SUPERMARKET_20_DCTO_FREE = os.environ.get('THREAD_ID_SUPERMARKET_20_DCTO_FREE')
THREAD_ID_SUPERMARKET_50_DCTO_FREE = os.environ.get('THREAD_ID_SUPERMARKET_50_DCTO_FREE')

CANAL_PREMIUM_ID = os.environ.get('CANAL_PREMIUM_ID')

THREAD_ID_SUPERMARKET_20_DCTO_PREMIUM = os.environ.get('THREAD_ID_SUPERMARKET_20_DCTO_PREMIUM')
THREAD_ID_SUPERMARKET_30_DCTO_PREMIUM = os.environ.get('THREAD_ID_SUPERMARKET_30_DCTO_PREMIUM')
THREAD_ID_SUPERMARKET_50_DCTO_PREMIUM = os.environ.get('THREAD_ID_SUPERMARKET_50_DCTO_PREMIUM')

THREAD_ID_20_DCTO_PREMIUM = os.environ.get('THREAD_ID_20_DCTO_PREMIUM')
THREAD_ID_30_DCTO_PREMIUM = os.environ.get('THREAD_ID_30_DCTO_PREMIUM')
THREAD_ID_60_DCTO_PREMIUM = os.environ.get('THREAD_ID_60_DCTO_PREMIUM')
THREAD_ID_75_DCTO_PREMIUM = os.environ.get('THREAD_ID_75_DCTO_PREMIUM')

ASC = 'asc'
DESC = 'desc'
RANDOM = 'random'

NAME = 'name'
IMAGE_URL = 'image_url'
URL = 'url'
STORE = 'store'
OFFER_PRICE = 'offer_price'
NORMAL_PRICE = 'normal_price'
DISCOUNT = 'discount'
ID = 'product_id'
MESSAGE = 'message'

sentPREMIUM = 'false'
sentFREE = 'false'
minDiscountPREMIUM = 20
maxDiscountPREMIUM = 100
minDiscountFREE = 20
maxDiscountFREE = 49

sortOrder = ASC
filters_premium = f'minDiscount={minDiscountPREMIUM}&maxDiscount={maxDiscountPREMIUM}&sentPREMIUM={sentPREMIUM}'
filters_free = f'minDiscount={minDiscountFREE}&maxDiscount={maxDiscountFREE}&sentFREE={sentFREE}'
fields = f'{ID},{IMAGE_URL},{MESSAGE},{STORE},{DISCOUNT}'

PREMIUM = 'PREMIUM'
FREE = 'FREE'