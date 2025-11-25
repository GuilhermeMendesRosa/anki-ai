import requests

url = 'https://ankiuser.net/svc/editor/add-or-update'

headers = {
    'accept': '*/*',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'content-type': 'application/octet-stream',
    'origin': 'https://ankiuser.net',
    'priority': 'u=1, i',
    'referer': 'https://ankiuser.net/add',
    'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
}

cookies = {
    'has_auth': '1',
    'ankiweb': 'eyJvcCI6ImNrIiwiaWF0IjoxNzY0MTA1Njg5LCJqdiI6MCwiayI6Im5NfjF-JCQ-WUNQdXFTaS4iLCJjIjoyLCJ0IjoxNzY0MTA1Njg5fQ.JCUP0ThGPlADu59-xEV5zexIUvq-McQHzF_iaQL0uEw'
}

# The data as bytes, decoded from the unicode escapes
data = b'\n\x09New Front\n\x08New Back\x1a\x0e\x08\xd1\xe1\xe4\x8b\xc4.\x10\x90\x8f\xd5\xee\xa63'

response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(f'Status Code: {response.status_code}')
print(f'Response: {response.text}')