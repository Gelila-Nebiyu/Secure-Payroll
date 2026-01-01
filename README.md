
# Sentinel Payroll Secure - Full Stack Simulation

This is a comprehensive security demonstration application that simulates a full-stack environment (Frontend + Backend + Database) entirely within the browser using React.

## 🏗 Architecture Explained

**Q: Where is the Backend?**
A: This application uses a **Serverless/Browser-based Architecture** for demonstration purposes.
- **Frontend**: The React UI components (`App.tsx`).
- **Backend Simulation**: The `services/` folder acts as the backend API layer. It handles authentication logic, password hashing, and authorization checks.
- **Database**: The `services/mockDatabase.ts` file acts as the database driver. It uses the browser's **LocalStorage** to persist data, mimicking a MongoDB instance (`db.users.find(...)`).

**Q: Where is the OTP Console?**
A: Since there is no physical server terminal, the backend logs are piped to the **Browser Developer Tools Console**.
- Press `F12` (or Right Click -> Inspect -> Console) in your browser to see the "Server Logs".
- When you register or login with MFA, the **Verification Codes (OTP)** will appear there in colorful badges.

## 🚀 How to Run in VS Code

1.  **Prerequisites**: Install [Node.js](https://nodejs.org/).
2.  **Setup Project**:
    Open your VS Code terminal and run:
    ```bash
    npx create-react-app sentinel-payroll --template typescript
    cd sentinel-payroll
    ```
3.  **Install Dependencies**:
    ```bash
    npm install lucide-react @google/genai @hcaptcha/react-hcaptcha
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
4.  **Configure Tailwind**:
    Update `tailwind.config.js`:
    ```js
    module.exports = {
      content: ["./src/**/*.{js,jsx,ts,tsx}"],
      darkMode: 'class',
      theme: { extend: {} },
      plugins: [],
    }
    ```
5.  **Add Code**:
    - Copy the provided code files into your `src/` folder.
    - Create a `.env` file for API keys (optional).
      ```
      REACT_APP_HCAPTCHA_SITE_KEY=your_key_here
      # REACT_APP_GEMINI_KEY=your_gemini_key
      ```
6.  **Run the App**:
    ```bash
    npm start
    ```
    The app will open at `http://localhost:3000`.

## 🔐 Credentials & Usage Flow

### 1. Initial Setup (Admin)
The system automatically seeds a default Admin account on first load:
- **Email**: `admin@sentinel.com`
- **Password**: `admin123`
- **Role**: `ADMIN` (Has full access to User Management)

### 2. User Registration Flow
1.  Click **Register New Account** on the login screen.
2.  Fill in details and complete the **hCaptcha**.
3.  **Open Browser Console (F12)**.
4.  You will see a log: `[SENTINEL BACKEND] SMTP SERVICE`.
5.  Copy the **OTP Code** displayed there and enter it in the UI to verify email.
6.  **IMPORTANT**: New users are assigned the `UNASSIGNED` role by default. They cannot see any data.

### 3. Assigning Roles
1.  Log out and log back in as **Admin**.
2.  Go to **User Management** (Sidebar).
3.  Find the new user and change their role to `HR_MANAGER`, `FINANCE_MANAGER`, or `EMPLOYEE`.
4.  Log back in as the new user to see their specific dashboard.

## 🛡 Security Features Implemented
- **hCaptcha Integration**: Bot protection on login/register.
- **MongoDB-style Persistence**: Data stays saved even if you refresh.
- **RBAC & ABAC**: Complex permission logic in `accessControlService.ts`.
- **Encrypted Logs**: Audit logs include simulated cryptographic signatures.
