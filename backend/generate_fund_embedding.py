import sys
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def fund_to_string(fund):
    # Convert fund dict to string for embedding
    return ' | '.join(f"{k}: {v}" for k, v in fund.items() if k != 'embedding')

def main():
    raw_input = sys.stdin.read()
    input_data = json.loads(raw_input)

    # Check if input is a search query or a fund
    if isinstance(input_data, dict) and input_data.get("type") == "query":
        query_text = input_data.get("text", "")
        embedding = model.encode(query_text).tolist()
    else:
        fund_text = fund_to_string(input_data)
        embedding = model.encode(fund_text).tolist()

    print(json.dumps(embedding))

if __name__ == "__main__":
    main()



