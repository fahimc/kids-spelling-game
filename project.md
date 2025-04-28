You are an experienced frontend developer tasked with creating *SpellyQuest*, a fun mobile-first Vite + React + TypeScript app to help kids practice spelling through a game-based experience.

Follow the instructions carefully:

---

## 🏗️ Project Goal:
Create a mobile-first Vite+React+TypeScript app designed to help children aged 5–10 learn and practice spelling. The app should feel like a colorful and engaging game.

The game flow:
- Initial screen to input 10–20 spellings.
- Learning phase to teach the spelling.
- Fun mini-games to practice the spelling.
- Testing phase to assess spelling memory.
- Victory/reward screen at the end.

All screens must be mobile-first and designed for fun, excitement, and easy interaction.

---

## 🏛️ Architecture:

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Animations**: Framer Motion
- **Text-to-Speech**: Browser's `SpeechSynthesis` API
- **Persistence**: LocalStorage (to save progress)

### Folder Structure:

/src /assets -> Images, sounds /components -> Reusable UI elements (Button, InputField, GameCard, etc.) /pages -> WelcomePage, SpellInputPage, LearningPage, GamePage, TestPage, VictoryPage /context -> Global state management /utils -> Helper functions (shuffle letters, validate spelling) /hooks -> Custom hooks (e.g., useSpeechSynthesis) /styles -> Tailwind customization /status.md -> Status tracking file

yaml
Copy
Edit

### Third-party Libraries:
- Tailwind CSS
- React Router
- Framer Motion
- react-confetti (for celebration animations)

---

## 📜 Screens to Build:

1. **Welcome Screen**:
   - Fun, animated, colorful
   - Logo
   - “Start Adventure” button

2. **Spell Input Screen**:
   - Simple form to input 10–20 spellings manually
   - Button to "Begin Journey"

3. **Learning Screen**:
   - Show the word
   - Play audio pronunciation
   - Interactive activities (trace letters, complete missing letters)

4. **Game Play Screen**:
   - Mini-games like:
     - Unscramble letters
     - Fill-in-the-blank
     - Hangman-style guessing

5. **Testing Screen**:
   - Test the child's knowledge through quizzes

6. **Victory Screen**:
   - Rewards
   - Celebration animations
   - Replay option

---

## 🗓️ Project Plan (Phases):

| Phase | Task | Deliverable |
|:---|:---|:---|
| 1 | Initialize Vite+React+TS project | Basic app setup, Tailwind added |
| 2 | Create folder structure & routing | `/pages`, `/components`, Context API, Router |
| 3 | Build Welcome Screen | Logo, animations, Start button |
| 4 | Build Spell Input Screen | Form for 10–20 spellings |
| 5 | Build Learning Screen | Word display, TTS audio, tracing/missing letters mini-activity |
| 6 | Build Game Play Screen | Fun spelling games (scramble, fill in blanks) |
| 7 | Build Testing Screen | Spelling tests, progress tracking |
| 8 | Build Victory Screen | Rewards, replay option |
| 9 | Add Persistence (LocalStorage) | Save words and progress |
| 10 | Polish: Add animations & UI polish | Framer Motion animations |
| 11 | Finalize /status.md tracking | Progress log file completed |

---

## 📓 Status Tracking - `/status.md`

After completing **every phase**, update `/status.md` with:

- **Phase Completed**
- **Summary of Changes**
- **Any Architecture Decisions**
- **Next Task**

### Example `/status.md` format:

```markdown
# Status Log: SpellyQuest

## Phase 1: Project Setup
- Initialized Vite + React + TypeScript project.
- Installed Tailwind CSS, React Router, Framer Motion.
- `npm create vite@latest spellyquest --template react-ts`
- Next: Set up folder structure and routing.

---

## Phase 2: Folder Structure and Routing
- Created folders: /pages, /components, /assets, /context, /hooks, /utils
- Set up React Router with basic routes.
- Created `App.tsx` skeleton.
- Next: Build Welcome Screen.
⚡ Rules for Development:
Work strictly phase-by-phase.

Never skip phases.

Keep /status.md up-to-date.

Save work clearly and regularly.

If unsure about a decision, log the assumption in /status.md.

Focus on a playful, colorful, kid-friendly game look throughout.
