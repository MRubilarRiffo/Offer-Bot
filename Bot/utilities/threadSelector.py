from config.settings import (
    THREAD_ID_SUPERMARKET_20_DCTO_FREE,
    THREAD_ID_20_DCTO_FREE,
    THREAD_ID_30_DCTO_FREE,
    THREAD_ID_SUPERMARKET_20_DCTO_PREMIUM,
    THREAD_ID_SUPERMARKET_30_DCTO_PREMIUM,
    THREAD_ID_SUPERMARKET_50_DCTO_PREMIUM,
    THREAD_ID_20_DCTO_PREMIUM,
    THREAD_ID_30_DCTO_PREMIUM,
    THREAD_ID_60_DCTO_PREMIUM,
    THREAD_ID_75_DCTO_PREMIUM
)

def threadSelector(discount, store, state):
    PREMIUM = 'PREMIUM'
    FREE = 'FREE'

    UNIMARC = 'Unimarc'
    LIDER_MARKET = 'lider_supermercado'
    JUMBO = 'Jumbo'

    if state == PREMIUM:
        if store[0] == UNIMARC or store[0] == LIDER_MARKET or store[0] == JUMBO:
            if discount >= 50:
                return THREAD_ID_SUPERMARKET_50_DCTO_PREMIUM
            elif discount >= 30:
                return THREAD_ID_SUPERMARKET_30_DCTO_PREMIUM
            elif discount >= 20:
                return THREAD_ID_SUPERMARKET_20_DCTO_PREMIUM
        elif discount >= 75:
            return THREAD_ID_75_DCTO_PREMIUM
        elif discount >= 60:
            return THREAD_ID_60_DCTO_PREMIUM
        elif discount >= 30:
            return THREAD_ID_30_DCTO_PREMIUM
        elif discount >= 10:
            return THREAD_ID_20_DCTO_PREMIUM
    elif state == FREE:
        if store[0] == UNIMARC or store[0] == LIDER_MARKET or store[0] == JUMBO:
            return THREAD_ID_SUPERMARKET_20_DCTO_FREE
        elif discount >= 30:
            return THREAD_ID_30_DCTO_FREE
        elif discount >= 20:
            return THREAD_ID_20_DCTO_FREE

    return None