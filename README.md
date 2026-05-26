# 🧠 Algorithm Explanation Assistant

An AI-powered web application that helps users understand algorithms in a structured and interactive way.  
Built with Flask, JavaScript, and AI integration, this project provides detailed explanations, code, and complexity analysis similar to ChatGPT.

---

## 🚀 Features

✨ Ask any algorithm or paste pseudocode  
✨ Get structured explanations instantly  
✨ Includes:
- Definition  
- Step-by-step explanation  
- Example walkthrough  
- Python code  
- Time & Space complexity  
- Advantages & Disadvantages  
- Use cases  

✨ ChatGPT-like interface  
✨ Multiple chat support  
✨ Persistent chat storage (saved even after refresh)  
✨ Sidebar navigation for previous chats  
✨ Markdown + code highlighting support  
✨ Clean and responsive UI  

---

## 🏗️ Project Structure


## Project Structure
```text
algorithm_explanation_assistant/
├── app.py # Flask backend
├── chats.json # Stored chat history
├── requirements.txt # Dependencies
├── templates/
│ └── index.html # UI
├── static/
│ ├── css/style.css # Styling
│ └── js/script.js # Frontend logic
├── utils/
│ └── gemini_helper.py # AI integration       # Gemini API integration
```
## ⚙️ Technologies Used

- **Backend:** Python, Flask  
- **Frontend:** HTML, CSS, JavaScript  
- **AI Integration:** Ollama / Gemini / OpenAI  
- **Storage:** JSON (chat persistence)  
- **UI Enhancements:** Markdown + Highlight.js  

---

## 🧪 Setup Instructions

### 1️⃣ Clone Project
```bash
git clone <your-repo-url>
cd algorithm_explanation_assistant
2️⃣ Create Virtual Environment
python -m venv venv

Activate:

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
3️⃣ Install Dependencies
pip install -r requirements.txt
4️⃣ Run Application
python app.py

Open browser:

http://127.0.0.1:5000

## Test Inputs
You can test the system with:
1. Algorithm Names:
   - "Binary Search"
   - "Dijkstra"
   - "Merge Sort"
2. Pseudocode:
   ```pseudocode
   for i = 1 to n
     for j = 1 to n - i
       if arr[j] > arr[j+1]
         swap(arr[j], arr[j+1])
   ```

Enjoy learning algorithms!
