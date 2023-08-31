import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.environ.get('TOKEN_2')
CANAL_ID = os.environ.get('CANAL_ID')

sortOrder = 'asc'
fields = 'name,image_url,url,store,first_price,last_price,discount,product_id'

sent_products = set()