from flask import Flask, render_template, request, jsonify
from utils.gemini_helper import generate_explanation
import os
import secrets
import json

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

CHAT_FILE = "chats.json"


# 🔹 Load chats from file
def load_chats():
    if not os.path.exists(CHAT_FILE):
        return {}
    with open(CHAT_FILE, "r") as f:
        return json.load(f)


# 🔹 Save chats to file
def save_chats(data):
    with open(CHAT_FILE, "w") as f:
        json.dump(data, f, indent=4)


# 🔹 Home page
@app.route('/')
def index():
    chats = load_chats()
    return render_template('index.html', chats=chats)


# 🔹 Explain route
@app.route('/explain', methods=['POST'])
def explain():
    data = request.get_json()

    if not data or 'query' not in data:
        return jsonify({"success": False, "error": "No query provided"}), 400

    query = data['query'].strip()
    chat_id = data.get('chat_id', 'chat_1')

    if not query:
        return jsonify({"success": False, "error": "Query cannot be empty"}), 400

    # 🔥 Your prompt (unchanged)
    prompt = f"""
Explain the algorithm or concept: {query}

STRICT OUTPUT FORMAT:

1. Definition
- Simple explanation

2. Stepwise Explanation
- Step-by-step working (numbered)

3. Example Walkthrough
- Show with sample input step-by-step

4. Python Code
- Provide correct Python code in code block

5. Time Complexity
- Best, Average, Worst case

6. Space Complexity

7. Advantages
- Bullet points

8. Disadvantages
- Bullet points

9. Use-Case Scenarios
- Real-world applications

IMPORTANT:
- Always include Python code
- Keep formatting clean
"""

    result = generate_explanation(prompt)

    if result.get('success'):
        chats = load_chats()

        if chat_id not in chats:
            chats[chat_id] = []

        chats[chat_id].append({
            "query": query,
            "response": result['data']
        })

        save_chats(chats)

        return jsonify({
            "success": True,
            "response": result['data']
        })

    return jsonify({
        "success": False,
        "error": result.get('error', 'Unknown error occurred')
    }), 500


# 🔹 New Chat
@app.route('/new_chat', methods=['POST'])
def new_chat():
    chats = load_chats()
    new_id = f"chat_{len(chats) + 1}"
    chats[new_id] = []
    save_chats(chats)
    return jsonify({"chat_id": new_id})


# 🔹 Clear history (optional)
@app.route('/clear_history', methods=['POST'])
def clear_history():
    save_chats({})
    return jsonify({"success": True})

@app.route('/get_chat/<chat_id>')
def get_chat(chat_id):
    chats = load_chats()
    return jsonify({
        "messages": chats.get(chat_id, [])
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
