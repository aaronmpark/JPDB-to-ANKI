from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from typing import Optional
import anki 

app = FastAPI()

@app.get("/scrape")
def scrape_vocab(url: Optional[str] = Query(
    default="https://jpdb.io/anime/1495/nekopara-koneko-no-hi-no-yakusoku/vocabulary-list",
    description="JPDB vocabulary list URL")):
    vocab = anki.scrape_vocab(url)
    return {"count": len(vocab), "vocab": vocab}

@app.get("/create_deck")
def create_deck(
    url: Optional[str] = Query(
        default="https://jpdb.io/anime/1495/nekopara-koneko-no-hi-no-yakusoku/vocabulary-list",
        description="JPDB vocabulary list URL"),
    filename: Optional[str] = Query(
        default="jpdb_vocab.apkg",
        description="Output Anki deck filename")
):
    vocab = anki.scrape_vocab(url)
    anki.create_anki_deck(vocab, filename)
    return {"message": f"Anki deck '{filename}' created successfully.", "count": len(vocab)}