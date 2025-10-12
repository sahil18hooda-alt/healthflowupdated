# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: HealthFlow (Next.js 15 + React 18 + TypeScript + Tailwind + shadcn/ui + Firebase + Genkit/Gemini)

Commands

- Dev (Next.js, port 9002)
  - npm: npm run dev
  - yarn: yarn dev
  - pnpm: pnpm dev
  - bun: bun dev
  Notes:
  - Uses Next.js dev with Turbopack and binds to http://localhost:9002.

- Build
  - npm run build
  Notes:
  - Executes NODE_ENV=production next build (see package.json).

- Start (serve production build)
  - npm run start

- Lint
  - npm run lint
  Notes:
  - Uses next lint. No custom ESLint config found; Next defaults apply.

- Typecheck
  - npm run typecheck
  Notes:
  - Runs tsc --noEmit. next.config.ts has ignoreDuringBuilds set for ESLint and TypeScript; use this script for strict checks locally.

- AI flows (Genkit local dev)
  - Start flows: npm run genkit:dev
  - Watch flows: npm run genkit:watch
  Notes:
  - Loads src/ai/dev.ts via tsx. That file imports and registers all flows under src/ai/flows.
  - dev.ts calls dotenv.config(); place environment variables in a .env file for local development.

- Testing
  - No unit/e2e test tooling is configured in this repository (no Jest/Vitest/Cypress/Playwright found). If tests are added later, update this file with how to run the full suite and a single test.

Environment

- Next.js dev server runs on port 9002 (see README.md and the dev script).
- Genkit + GoogleAI plugin typically requires an API key. For local dev, set GOOGLE_GENAI_API_KEY in your environment (dotenv is loaded by src/ai/dev.ts). Do not print or commit secrets.
- Firebase SDK initialization (src/firebase/index.ts) attempts to auto-initialize (for Firebase App Hosting) and falls back to src/firebase/config.ts for local dev.

High-level architecture

- App Router layout
  - Root layout (src/app/layout.tsx): sets metadata, global fonts, ThemeProvider, and Toaster.
  - Auth group (src/app/(auth)/...): login and patient signup pages.
  - Main app group (src/app/(app)/...): feature pages mounted inside a shared shell (src/app/(app)/layout.tsx) that renders AppSidebar, AppHeader, and a Chatbot sheet overlay. This group contains the patient/employee feature routes (dashboard, appointments, symptom-analyzer, medication-checker, lab-report-analyzer, imaging-diagnosis, predictive-risk-model, schedule-assistant, etc.).

- UI system
  - Component library: shadcn/ui components live in src/components/ui/* and are composed into higher-level pieces (e.g., layout/AppHeader, layout/AppSidebar, chatbot overlay).
  - Styling: TailwindCSS with globals in src/app/globals.css; theme toggling via src/providers/theme-provider.tsx and src/components/theme-toggle.tsx.

- Data layer
  - Firebase client SDK wrapper (src/firebase/index.ts) exposes initializeFirebase() and returns auth/firestore SDKs. It re-exports provider components and Firestore hooks (src/firebase/firestore/use-collection.tsx, use-doc.tsx) for data access in client components.
  - Demo data for UI flows is provided in src/lib/mock-data.ts; common types live in src/lib/types.ts.

- AI subsystem (Genkit + Gemini)
  - Genkit setup: src/ai/genkit.ts instantiates ai = genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.5-flash' }).
  - Flow definitions: each flow in src/ai/flows/* is a server action module ('use server') that
    - Defines input/output schemas with z (from genkit),
    - Defines a prompt via ai.definePrompt(...), and
    - Wraps it in ai.defineFlow(...) exported as a typed async function.
  - Examples:
    - ai-chatbot-assistant.ts: simple Q&A assistant used by the floating Chatbot component.
    - ai-symptom-analysis.ts: structured differential output with mandatory disclaimer.
    - ai-medication-interaction-checker.ts: pairwise interaction detection with severity.
    - ai-lab-report-analyzer.ts and ai-imaging-diagnosis-flow.ts: multimodal prompts using {{media url=...}}; imaging flow also generates a heatmap image via googleai/gemini-2.5-flash-image-preview and returns a data URI.
  - Registration: src/ai/dev.ts imports each flow so genkit start can discover them in local dev.
  - Invocation from UI: client components call flow functions directly; e.g., src/components/chatbot.tsx calls aiChatbotAssistant(...) from a client component. This relies on Next.js server actions to execute the flow on the server.

- Routing and feature mapping
  - The docs folder contains high-level diagrams mapping user flows and AI features:
    - docs/ai-architecture.md: feature-to-flow mapping and output schemas (symptom analyzer, lab interpreter, medication checker, imaging diagnosis, fitness coach, chatbot, inquiry triage, medical notes, predictive risk, schedule assistant).
    - docs/user-flow.md and docs/blueprint.md: user journeys (patient/employee) and core features that correspond to the (app) route pages.

Conventions and notes

- Next config (next.config.ts) ignores TypeScript and ESLint errors during builds. Use npm run typecheck and npm run lint during development to catch issues proactively.
- Path aliases: tsconfig.json defines @/* -> src/* for imports.
- Many flows include explicit medical disclaimers in their output schemas; maintain this pattern when adding new flows.

Quick references

- Dev server: http://localhost:9002
- Key entry points:
  - Web shell: src/app/(app)/layout.tsx and src/app/layout.tsx
  - Chatbot UI: src/components/chatbot.tsx
  - AI init: src/ai/genkit.ts; flow registry: src/ai/dev.ts; flows: src/ai/flows/*
  - Firebase bootstrap: src/firebase/index.ts (auto-init + fallback)

Change management

- If you introduce tests (Jest/Vitest/Playwright/Cypress), add the install/build/run commands here, including how to run a single test/spec.
- If you add CI or deployment tooling (e.g., GitHub Actions, Firebase config), include the minimal, actionable commands necessary for common tasks.
