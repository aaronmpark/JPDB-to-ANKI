import requests
from bs4 import BeautifulSoup

url = "https://jpdb.io/visual-novel/993/nursery-rhyme/vocabulary-list"

response = requests.get(url)
response.raise_for_status()

# Ensure correct encoding for Japanese text
response.encoding = "utf-8"

soup = BeautifulSoup(response.text, "html.parser")

body = soup.body
container_div = body.find("div", class_="container bugfix")
vocab_list_div = container_div.find("div", class_="vocabulary-list") if container_div else None

vocab_dict = {}

if vocab_list_div:
    entries = vocab_list_div.find_all("div", class_="entry")
    for entry in entries:
        # Find all ruby tags (sometimes there are multiple for kanji + furigana)
        ruby_tags = entry.find_all("ruby")
        # Join all ruby text for full spelling
        spelling = "".join(ruby.get_text(strip=True) for ruby in ruby_tags) if ruby_tags else None

        meaning_divs = entry.find_all("div", recursive=False)
        meaning = None
        if meaning_divs:
            inner_divs = meaning_divs[0].find_all("div", recursive=False)
            if len(inner_divs) > 1:
                meaning = inner_divs[1].get_text(strip=True)
            else:
                for div in meaning_divs[0].find_all("div"):
                    text = div.get_text(strip=True)
                    if ";" in text:
                        meaning = text
                        break

        if spelling and meaning:
            vocab_dict[spelling] = meaning

    print("Extracted vocabulary entries:")
    for idx, (k, v) in enumerate(vocab_dict.items(), 1):
        print(f"{idx}. \"{k}: {v}\"")
else:
    print("Vocabulary list not found on the page.")