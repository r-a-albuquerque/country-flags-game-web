# Country Flags Game

A React web app that challenges you to identify countries by their flags. A flag is shown on screen along with five country name options — pick the right one before the timer runs out.

## Features

- Flag displayed with 5 multiple-choice country name options
- 15-second countdown timer per question; a timeout counts as a wrong answer
- Live score tracking (right / wrong answers)
- Toast notifications on correct and incorrect selections
- Optional hardware integration: signal a physical Arduino board on each answer

## Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 16 (class components) |
| Styling | Bootstrap 4 + inline styles |
| Routing | React Router v5 |
| HTTP client | axios |
| Notifications | react-toastify |
| Country data | [REST Countries v2](https://restcountries.com) public API |

## Getting started

### Prerequisites

- Node.js 12 or later
- npm

### Installation

```bash
git clone https://github.com/rarruda-albuquerque/country-flags-game-web.git
cd country-flags-game-web
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
# URL of the REST Countries API endpoint
REACT_APP_API_COUNTRY=https://restcountries.com/v2/all

# Arduino integration (optional — see below)
REACT_APP_ARDUINO=false
REACT_APP_API_ARDUINO=http://localhost:3300/api/arduino
```

> [!NOTE]
> `REACT_APP_API_COUNTRY` defaults to the public REST Countries v2 API. You only need to set it if you want to point to a self-hosted mirror.

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads on file changes.

## Arduino integration (optional)

When `REACT_APP_ARDUINO=true`, the app posts each answer result to the backend URL defined by `REACT_APP_API_ARDUINO`. This allows a connected Arduino board to give physical feedback (e.g. green/red LED, buzzer) for right and wrong answers.

The expected request body is:

```json
{ "rightAnswer": true }
```

> [!TIP]
> The Arduino backend must be running and reachable before starting the game, otherwise the API call will fail silently and only a console error is logged.

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server on port 3000 |
| `npm test` | Run tests in interactive watch mode |
| `npm run build` | Build a production bundle into `build/` |
| `npm start` | Serve the production build with `serve` |
