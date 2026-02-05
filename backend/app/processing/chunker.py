def chunk_text(pages, chunk_size=500):
    chunks = []
    for p in pages:
        words = p["text"].split()
        for i in range(0, len(words), chunk_size):
            chunks.append({
                "text": " ".join(words[i:i+chunk_size]),
                "page": p["page"]
            })
    return chunks
