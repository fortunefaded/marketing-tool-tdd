# Marketing Tool

[![CI/CD Pipeline](https://github.com/fortunefaded/marketing-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/fortunefaded/marketing-tool/actions/workflows/ci.yml)

## 概要

TDD（テスト駆動開発）で構築されたマーケティングツール

## 技術スタック

- **Framework**: React + TypeScript + Vite
- **Backend**: Convex (リアルタイムデータベース)
- **Logging**: Vibelogger (人間が読みやすい日本語ログシステム)
- **Testing**: Vitest (カバレッジ100%)
- **CI/CD**: GitHub Actions
- **Type Safety**: TypeScript
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged
- **AI Integration**: Serena MCP (Claude Desktop/Code連携)

## セットアップ

npm install
npm test

## 開発コマンド

npm run dev # 開発サーバー起動
npm run test # テスト実行
npm run test:ui # Vitest UI
npm run test:coverage # カバレッジ
npm run lint # ESLint
npm run format # Prettier
npm run type-check # TypeScript型チェック

## Serena MCP統合

このプロジェクトはSerena MCPと統合されており、Claude DesktopやClaude Codeから直接プロジェクトを操作できます。
詳細は[SERENA_MCP_SETUP.md](./SERENA_MCP_SETUP.md)を参照してください。
