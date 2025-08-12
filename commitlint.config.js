export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新機能
        'fix', // バグ修正
        'docs', // ドキュメント
        'style', // フォーマット
        'refactor', // リファクタリング
        'perf', // パフォーマンス改善
        'test', // テスト
        'build', // ビルドシステム
        'ci', // CI/CD
        'chore', // その他の変更
        'revert', // リバート
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 5],
    'body-max-line-length': [2, 'always', 100],
  },
}
