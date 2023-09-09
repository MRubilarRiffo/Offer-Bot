import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = [
    os.environ.get('TOKEN_1'),
    os.environ.get('TOKEN_2'),
    os.environ.get('TOKEN_3'),
    os.environ.get('TOKEN_4'),
    os.environ.get('TOKEN_5'),
    os.environ.get('TOKEN_6'),
    os.environ.get('TOKEN_7'),
    os.environ.get('TOKEN_8'),
    os.environ.get('TOKEN_9'),
]

CANAL_ID = {
    'PREMIUM': os.environ.get('CANAL_PREMIUM_ID'),
    'FREE': os.environ.get('CANAL_FREE_ID')
}

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
THREAD_ID = 'thread_id'
PUBLISHING_TIME = 'publishing_time'
STATE = 'state'

name = ''
store = ''
sent = 'false'
minDiscount = 10
maxDiscount = 100

sortOrder = ASC
filters = f'minDiscount={minDiscount}&maxDiscount={maxDiscount}&name={name}&store={store}&sent={sent}'
# fields = f'{NAME},{IMAGE_URL},{URL},{STORE},{NORMAL_PRICE},{OFFER_PRICE},{DISCOUNT},{ID},{MESSAGE}'
fields = f'{ID},{IMAGE_URL},{DISCOUNT},{MESSAGE},{THREAD_ID},{PUBLISHING_TIME},{STATE}'