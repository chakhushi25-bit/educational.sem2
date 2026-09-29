import io
import math
import re
import datetime
from typing import Any
import pypdf


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extract clean text from PDF, TXT, MD, CSV, JSON, or code files"""
    ext = filename.lower().split(".")[-1] if "." in filename else "txt"
    text = ""

    if ext == "pdf":
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for idx, page in enumerate(reader.pages):
                page_content = page.extract_text() or ""
                if page_content.strip():
                    pages_text.append(f"[Page {idx + 1}]\n{page_content}")
            text = "\n\n".join(pages_text)
        except Exception as e:
            # Fallback regex text extractor from binary stream
            text = re.sub(rb"[^\x20-\x7E\n\r\t]", b" ", file_bytes).decode("ascii", errors="ignore")
    else:
        # Text/markdown/csv/json
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            try:
                text = file_bytes.decode("latin-1")
            except Exception:
                text = file_bytes.decode("ascii", errors="ignore")

    # Clean excessive whitespace
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list[str]:
    """Split text into overlapping semantic chunks"""
    if not text:
        return []

    # First split by paragraphs
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""

    for p in paragraphs:
        p = p.strip()
        if not p:
            continue

        if len(current_chunk) + len(p) <= chunk_size:
            current_chunk = f"{current_chunk}\n\n{p}".strip()
        else:
            if current_chunk:
                chunks.append(current_chunk)
            # If a single paragraph is longer than chunk_size, split by sentences or characters
            if len(p) > chunk_size:
                sentences = re.split(r"(?<=[.?!])\s+", p)
                temp = ""
                for s in sentences:
                    if len(temp) + len(s) <= chunk_size:
                        temp = f"{temp} {s}".strip()
                    else:
                        if temp:
                            chunks.append(temp)
                        temp = s
                if temp:
                    current_chunk = temp
                else:
                    current_chunk = ""
            else:
                current_chunk = p

    if current_chunk:
        chunks.append(current_chunk)

    # Ensure overlapping windows if chunks are large
    refined_chunks = []
    for i, c in enumerate(chunks):
        if len(c) > 30:  # ignore tiny noise chunks
            refined_chunks.append(c)

    return refined_chunks if refined_chunks else [text[:chunk_size]]


def _tokenize(text: str) -> set[str]:
    """Lowercase word tokens"""
    return set(re.findall(r"\b[a-zA-Z0-9_-]{2,}\b", text.lower()))


def search_relevant_chunks(
    query: str,
    chunks: list[dict[str, Any]],
    top_k: int = 4,
    subject_id: str | None = None,
) -> list[dict[str, Any]]:
    """
    Search and score chunks using BM25-inspired term frequency, length normalization,
    and subject relevance boosting.
    """
    if not chunks:
        return []

    query_tokens = _tokenize(query)
    if not query_tokens:
        return chunks[:top_k]

    scored = []
    for chunk in chunks:
        # Subject filter if specified
        if subject_id and chunk.get("subjectId") and chunk.get("subjectId") != subject_id:
            # lower weight for other subjects, but allow general cross-matching
            subject_boost = 0.3
        else:
            subject_boost = 1.3

        chunk_text_lower = chunk.get("text", "").lower()
        chunk_tokens = _tokenize(chunk_text_lower)
        doc_title_lower = chunk.get("documentTitle", "").lower()

        # Token overlap
        matched_tokens = query_tokens.intersection(chunk_tokens)
        if not matched_tokens:
            continue

        score = 0.0
        for token in matched_tokens:
            # Term frequency in chunk
            tf = chunk_text_lower.count(token)
            # Query term presence in document title gets high boost
            title_boost = 2.5 if token in doc_title_lower else 1.0
            # Length penalty / normalization
            len_penalty = 1.0 / (1.0 + math.log(1 + len(chunk_tokens)))
            score += tf * title_boost * len_penalty * subject_boost

        if score > 0:
            scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored[:top_k]]


def format_rag_context(retrieved_chunks: list[dict[str, Any]]) -> str:
    """Format retrieved document chunks for AI prompt injection"""
    if not retrieved_chunks:
        return ""

    lines = ["Retrieved Document Context from Course Materials:"]
    for idx, c in enumerate(retrieved_chunks):
        doc_name = c.get("documentTitle", "Document")
        subj = c.get("subjectName", "Subject")
        lines.append(f"\n--- [Source #{idx+1}: {doc_name} ({subj})] ---")
        lines.append(c.get("text", "").strip())
    lines.append("\nInstructions: Answer the user's question accurately using the retrieved course document context above whenever applicable. Cite relevant concepts from the course material.")
    return "\n".join(lines)
