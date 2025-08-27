import requests
from bs4 import BeautifulSoup

# URL of the vocabulary list page
url = "https://jpdb.io/visual-novel/993/nursery-rhyme/vocabulary-list"

# Send a GET request to the page
response = requests.get(url)
response.raise_for_status()  # Raise an error if the request failed

# Parse the HTML content with BeautifulSoup
soup = BeautifulSoup(response.text, "html.parser")

# Access the body tag
body = soup.body

# Find the div with class "container bugfix" inside body
container_div = body.find("div", class_="container bugfix")

# Find the div with class "vocabulary-list" inside the container
vocab_list_div = container_div.find("div", class_="vocabulary-list") if container_div else None

# Prepare the dictionary to store results
vocab_dict = {}

if vocab_list_div:
    entries = vocab_list_div.find_all("div", class_="entry")
    for entry in entries:
        # Find the first ruby tag inside the entry (the spelling)
        ruby_tag = entry.find("ruby")
        spelling = ruby_tag.get_text(strip=True) if ruby_tag else None

        # Find the div containing the meanings (the second inner div)
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