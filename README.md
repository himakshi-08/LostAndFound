# LostLink: Smart Campus Lost & Found System 🔍

LostLink is an intelligent, AI-powered platform designed to seamlessly reunite students with their lost belongings on campus. It eliminates the chaos of WhatsApp groups and physical lost-and-found boxes by using Natural Language Processing (NLP) to automatically match lost and found reports, backed by a robust, secure verification system.

## 🌟 Key Features

*   **🤖 AI Matching Engine:** Automatically calculates match percentages between "Lost" and "Found" reports using TF-IDF text similarity, Levenshtein distance (fuzzy title matching), exact category matching, and time-decay relevance.
*   **🛡️ Secure Verification System:** Anyone who finds an item must set a custom security question (e.g., "What is the phone's wallpaper?"). The claimant must answer it correctly to claim ownership.
*   **🧠 Fuzzy Logic Answer Checking:** The verification system is smart enough to accept partial matches and case-insensitive answers (e.g., accepting "butterfly" when the exact answer was "butterfly company").
*   **📊 Live Activity Feed:** A searchable, real-time dashboard displaying all active lost items on campus.
*   **🏅 Reputation Score:** Incentivizes honesty by awarding users reputation points when they successfully return an item.
*   **✨ Premium UI/UX:** Built with React, Tailwind CSS, and Framer Motion for a sleek, responsive, and glassmorphic user experience.

## 🛠️ Technology Stack

**Frontend:**
*   React.js
*   Tailwind CSS (Styling)
*   Framer Motion (Animations)
*   Vite (Build tool)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database)
*   `natural` NLP library (For AI matching logic)
*   JSON Web Tokens (JWT) & Bcrypt (Authentication)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) installed
*   A [MongoDB](https://www.mongodb.com/) URI (Local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/himakshi-08/LostAndFound.git
cd LostAndFound
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. (Optional) Inject Test Data
If you want to test the AI matching algorithms immediately without creating manual accounts, you can run the provided database seed script:
```bash
cd server
node setup-test-data.js
```
*This will clear existing data and populate the database with dummy users and items.*

---

## 🏗️ System Workflow

1.  **Report:** User A loses an item and submits a "Lost" report. User B finds an item and submits a "Found" report (along with a security question).
2.  **Analyze:** The backend AI engine scans the database and calculates similarity scores between the two items.
3.  **Match:** User A checks their AI Matches dashboard and sees User B's item with a high confidence score.
4.  **Claim & Verify:** User A clicks "Authenticate & Claim" and answers User B's security question.
5.  **Resolve:** If the fuzzy logic verifies the answer, both item records are locked, marked as "Recovered", and User B earns reputation points.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.


