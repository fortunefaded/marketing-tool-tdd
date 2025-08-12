# Marketing Tool

[![CI/CD Pipeline](https://github.com/fortunefaded/marketing-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/fortunefaded/marketing-tool/actions/workflows/ci.yml)

## 概要

TDD（テスト駆動開発）で構築されたマーケティングツール

## 技術スタック

- **Testing**: Vitest (カバレッジ100%)
- **CI/CD**: GitHub Actions
- **Type Safety**: TypeScript
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged

## セットアップ

npm install
npm test

## 開発コマンド

npm run test # テスト実行
npm run test:ui # Vitest UI
npm run test:coverage # カバレッジ
npm run lint # ESLint
npm run format # Prettier
npm run type-check # TypeScript型チェック
