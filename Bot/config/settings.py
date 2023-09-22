import os
from dotenv import load_dotenv

load_dotenv()

TOKEN_PREMIUM = os.environ.get('TOKEN_PREMIUM').replace('\n', '').replace(' ', '').split(',')
# TOKEN_FREE = os.environ.get('TOKEN_FREE').replace('\n', '').split(',')

CANAL_FREE_ID = os.environ.get('CANAL_FREE_ID')

THREAD_ID_10_DCTO_FREE = os.environ.get('THREAD_ID_10_DCTO_FREE')
THREAD_ID_30_DCTO_FREE = os.environ.get('THREAD_ID_30_DCTO_FREE')

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
PUBLISHING_TIME = 'publishing_time'
STATE = 'state'

name = ''
store = ''
sent = 'false'
state_premium = 'PREMIUM'
state_free = 'FREE'
minDiscount = 20
maxDiscount = 100

sortOrder = ASC
filters_premium = f'minDiscount={minDiscount}&maxDiscount={maxDiscount}&name={name}&store={store}&sent={sent}&state={state_premium}'
filters_free = f'minDiscount={minDiscount}&maxDiscount={maxDiscount}&name={name}&store={store}&sent={sent}&state={state_free}'
fields = f'{ID},{IMAGE_URL},{MESSAGE},{STATE},{STORE},{DISCOUNT}'