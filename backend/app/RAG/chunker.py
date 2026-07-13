def chunking_the_text(similarities,sentences):
    THRESHOLD = 0.6

    chunks = []

    current_chunk = [sentences[0]]

    for i, score in enumerate(similarities):

        if score < THRESHOLD:
            chunks.append(current_chunk)
            current_chunk = []

        current_chunk.append(sentences[i + 1])

    chunks.append(current_chunk)
    return chunks

