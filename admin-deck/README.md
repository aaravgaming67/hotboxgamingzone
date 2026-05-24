# 🖥️ HOTBOX GAMING // STANDALONE ADMINISTRATIVE COMMAND DECK
> A real-time back-office operations ledger synced securely with the Firestore gaming booking systems.

This folder contains a fully isolated, standalone React Single Page Application (SPA). To honor separation of concerns, this can be moved into its own distinct GitHub repository so you can host your booking manager dashboard completely independently of the client player lounge app.

---

## 🚀 Features Pre-integrated
- **Connected Firestore Datastore**: Listens to bookings from the live collection in real-time.
- **Secure Gate Keeper**: Access lockable via a security passcode screen (Bypass available for convenience).
- **Payment & Schedule Controls**: One-click toggles to finalize payments (razorpay settled vs cash at door dues) and gameplay statuses.
- **CSV Dynamic Export**: Export formatted accounting spreadsheets directly from the memory buffer.
- **Mock Booking Synthesizer**: Useful simulation tool to inject test entries into your calendar.

---

## 🛠️ Running Locally

Follow these commands to test the Admin Deck on your machine in under 60 seconds:

1. **Extract/Navigate to this folder:**
   ```bash
   cd admin-deck
   ```
2. **Install exact Node version dependencies:**
   ```bash
   npm install
   ```
3. **Fire up the localized Vite dev server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Navigate to the local port listed in your terminal (usually `http://localhost:3001` or `http://localhost:5173`).

---

## 🌐 Deploying to a Separate GitHub Repository

To establish the Admin Deck as its own distinct repository on GitHub and publish it using **GitHub Pages**:

1. **Initialize a clean Git repository inside the `admin-deck` directory:**
   ```bash
   # Make sure you are inside the admin-deck subfolder!
   cd admin-deck
   git init
   ```

2. **Add a secure lock on dependencies in a `.gitignore` file:**
   Create a `.gitignore` inside `admin-deck/` containing:
   ```text
   node_modules/
   dist/
   .env
   .DS_Store
   ```

3. **Stage and commit the pristine source codebase:**
   ```bash
   git add .
   git commit -m "Initialize standalone HOTBOX Gaming Admin Deck"
   ```

4. **Link the folder to your brand new GitHub repository:**
   *Go to GitHub, click **New Repository** (do not initialize with README), then copy the remote command:*
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USER/YOUR_NEW_ADMIN_REPO.git
   git push -u origin main
   ```

5. **Engage automatic GitHub Pages hosting:**
   - In your newly pushed GitHub Repository page, click **Settings** (top menu).
   - In the left sidebar, click **Pages** (under Code and automation).
   - Under **Build and deployment -> Source**, select **GitHub Actions**.
   - No further steps needed! The pre-configured `.github/workflows/deploy.yml` workflow will now automatically build and publish your standalone Admin Deck live to the web whenever you push updates!

---

## 🔒 Configuration Summary
- **App Engine**: React 19 + Vite 6
- **Styling Core**: Tailwind CSS v4 custom theme
- **Database Backend**: Real-time Firestore socket layer with experimental force polling
