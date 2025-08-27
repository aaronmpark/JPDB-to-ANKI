import requests
from bs4 import BeautifulSoup
import time

base_url = "https://jpdb.io"
url = "https://jpdb.io/visual-novel/993/nursery-rhyme/vocabulary-list"

vocab_dict = {}  # Make vocab_dict global for all pages

while url:
    response = requests.get(url)
    response.raise_for_status()
    response.encoding = "utf-8"

    soup = BeautifulSoup(response.text, "html.parser")
    body = soup.body
    container_div = body.find("div", class_="container bugfix")
    vocab_list_div = container_div.find("div", class_="vocabulary-list") if container_div else None

    if vocab_list_div:
        entries = vocab_list_div.find_all("div", class_="entry")
        for entry in entries:
            ruby_tags = entry.find_all("ruby")
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

    else:
        print("Vocabulary list not found on the page.")

    # Find the next page URL from pagination
    next_url = None
    pagination_div = container_div.find("div", class_="pagination without-prev") if container_div else None
    if pagination_div:
        a_tag = pagination_div.find("a", href=True)
        if a_tag:
            next_url = base_url + a_tag["href"]
            print(f"Next page: {next_url}")
        else:
            print("No next page link found.")
    else:
        print("Pagination div not found.")

    # Add a 1 second delay before the next iteration
    if next_url:
        time.sleep(1)

    # Set url for next iteration or break if no next page
    url = next_url

# Print all collected vocabulary entries after all pages are processed
print("All extracted vocabulary entries:")
for idx, (k, v) in enumerate(vocab_dict.items(), 1):
    print(f"{idx}. \"{k}: {v}\"")