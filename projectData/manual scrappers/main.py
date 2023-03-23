import asyncio
import json
import random
import string

import httpx
from loguru import logger as log


async def search_location(query: str, session):
    """
    search for location data from given query.
    e.g. "New York" will return us TripAdvisor's location details for this query
    """
    log.info(f"searching: {query}")
    url = "https://www.tripadvisor.com/data/graphql/ids"
    # For this request, we'll be sending JSON graphql typeCliqt
    # we indicate query ID and query variables
    payload = json.dumps(
        [
            {
                # Every graphql query has a query ID, in this case it's:
                "query": "c9d791589f937ec371723f236edc7c6b",
                "variables": {
                    "request": {
                        "query": query,
                        "limit": 10,
                        "scope": "WORLDWIDE",
                        "locale": "en-US",
                        "searchCenter": None,
                        # we can define search result types, in this case we want to search locations
                        "types": [
                            "LOCATION",
                            # other options are:
                            #   "QUERY_SUGGESTION",
                            #   "USER_PROFILE",
                            #   "RESCUE_RESULT"
                        ],
                        # we can further narrow down locations to specific items here like
                        # attractions (tours), accomodations (hotels) etc.
                        "locationTypes": [
                            "GEO",
                            "AIRPORT",
                            "ACCOMMODATION",
                            "ATTRACTION",
                            "ATTRACTION_PRODUCT",
                            "EATERY",
                            "NEIGHBORHOOD",
                            "AIRLINE",
                            "SHOPPING",
                            "UNIVERSITY",
                            "GENERAL_HOSPITAL",
                            "PORT",
                            "FERRY",
                            "CORPORATION",
                            "VACATION_RENTAL",
                            "SHIP",
                            "CRUISE_LINE",
                            "CAR_RENTAL_OFFICE",
                        ],
                        "userId": None,
                        "articleCategories": ["default", "love_your_local", "insurance_lander"],
                        "enabledFeatures": ["typeahead-q"],
                    }
                },
            }
        ]
    )

    headers = {
        **session.headers,
        # NOTE: we need to generate a random request ID for this request to succeed
        "x-requested-by": "".join(random.choice(string.ascii_lowercase + string.digits) for i in range(180)),
        # NOTE: these headers are required to not be blocked
        "Referer": "https://www.tripadvisor.com/Hotels",
        "Origin": "https://www.tripadvisor.com",
        "Content-Type": "application/json",
    }
    response = await session.post(url, headers=headers, data=payload)
    data = response.json()
    # return first result
    log.info(f'found {len(data[0]["data"]["Typeahead_autocomplete"]["results"])} results, taking first one')
    return data[0]["data"]["Typeahead_autocomplete"]["results"][0]["details"]


BASE_HEADERS = {
    "authority": "www.tripadvisor.com",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "en-US;en;q=0.9",
    "accept-encoding": "gzip, deflate, br",
}


async def run():
    limits = httpx.Limits(max_connections=5)
    async with httpx.AsyncClient(limits=limits, timeout=httpx.Timeout(15.0), headers=BASE_HEADERS) as session:
        result = await search_location("Alexandria", session=session)
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(run())
