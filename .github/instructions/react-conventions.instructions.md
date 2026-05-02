---
description: "Use when creating or modifying React components, services, or utilities in this project. Covers component style, CSS approach, state management, async patterns, file naming, and import/export conventions."
applyTo: "src/**/*.{js,jsx}"
---

# React Project Conventions

## Component Style

- Use **class components** extending `React.Component` for all components (no functional components or hooks).
- Define all state, methods, and constants as **class fields** (arrow functions), not inside the constructor.
- Define even `render` as a class field arrow function: `render = () => { ... }`.

```jsx
class MyComponent extends Component {
  DEFAULT_VALUE = 10;
  state = { items: [] };

  fetchData = async () => { ... };
  render = () => ( <div>...</div> );
}
export default MyComponent;
```

## File Naming

- Components: **PascalCase** with `.jsx` extension (e.g., `CountryOption.jsx`).
- Services and utilities: **camelCase** with `.js` extension (e.g., `httpService.js`, `utils.js`).
- Place components in `src/components/`, services and utilities in `src/services/`.

## CSS and Styling

- Use **Bootstrap utility classes** as the primary styling mechanism.
- Use **inline style objects** (camelCase properties) for one-off overrides: `style={{ height: "10rem" }}`.
- Avoid CSS Modules or styled-components — use plain global `.css` files for base resets only.
- Embed component-specific CSS as a JSX `<style>` tag inside `render` when a plain class or inline style is insufficient.

## State Management

- Use **local component state only** via `this.state` and `this.setState`. Do not introduce Redux, Context API, or any external state library.
- Destructure state in `render` using spread: `const { foo, bar } = { ...this.state }`.
- Use multiple `setState` calls when updating unrelated state slices.

## Async Patterns

- Use `async/await` in component lifecycle methods and event handlers.
- Service functions (in `src/services/`) return raw Promises — do **not** `await` inside them.
- Destructure and rename axios response data at the call site: `const { data: countries } = await http.getCountries()`.

## Service Layer

- HTTP calls go through `src/services/httpService.js`, which wraps axios and registers a global error interceptor.
- Export `httpService` as a **default object** bundling all methods.
- Pure utility functions go in `src/services/utils.js` as **named exports**, using lodash where appropriate.

## Import / Export

- Components: use `export default ComponentName` (one default export per file).
- Utilities: use named exports (`export function foo() { ... }`).
- Services: use a default object export (`export default { method1, method2 }`).
- Import lodash as the full bundle only when multiple utilities are needed; prefer named imports (`import { random } from 'lodash'`) otherwise.
