# Code Health Scanning System

This project includes a comprehensive code health scanning system to catch issues early and maintain code quality.

## Quick Start

```bash
# Quick scan (fast, essential checks)
npm run scan:quick

# Full static analysis
npm run full:scan

# Full scan with runtime checks (requires dev server running)
npm run full:scan:runtime
```

## Available Commands

### Static Analysis
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - ESLint code quality checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run stylelint` - CSS/SCSS style checking
- `npm run stylelint:fix` - Auto-fix style issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Dead Code Detection
- `npm run deadcode` - Find unused dependencies and code
- `npm run unused-exports` - Find unused TypeScript exports

### Security & Performance
- `npm run security` - Security vulnerability audit
- `npm run htmlhint` - HTML validation (for index.html)

### Runtime Checks (requires dev server)
- `npm run a11y` - Accessibility scanning with axe-core
- `npm run perf` - Performance audit with Lighthouse  
- `npm run links` - Broken link detection

### Combined Scans
- `npm run build:check` - Pre-build validation
- `npm run full:scan` - Complete static analysis
- `npm run full:scan:runtime` - Runtime checks (needs server)
- `npm run scan:quick` - Fast essential checks

## Tools Included

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Stylelint** - CSS/SCSS linting

### Dead Code Detection
- **depcheck** - Unused dependencies
- **knip** - Dead code and unused files
- **ts-prune** - Unused TypeScript exports

### Security & Performance
- **npm audit** - Package vulnerabilities
- **axe-core** - Accessibility testing
- **Lighthouse** - Performance, SEO, best practices
- **linkinator** - Broken link detection
- **HTMLHint** - HTML validation

## Configuration Files

- `eslint.config.js` - ESLint configuration (flat config format)
- `.stylelintrc.json` - Stylelint rules
- `.prettierrc` - Prettier formatting rules
- `.htmlhintrc` - HTML validation rules
- `knip.json` - Dead code detection config

## CI/CD Integration

The project includes a GitHub Actions workflow (`.github/workflows/code-health.yml`) that runs on every PR and push to main:

- Type checking
- Linting
- Code formatting validation
- Dead code detection
- Security audit
- Build verification

## Builder.io Integration

For Builder.io pages and components, use this prompt for comprehensive scanning:

```
Scan ALL pages and components for code issues, broken bindings, missing variables, unused code, and performance problems. 
Report and FIX when safe:
- Broken data bindings / undefined state
- JavaScript expression errors
- Unused components/styles/sections
- Missing <alt> on images
- Accessibility violations (focus order, roles, labels)
- Deprecated or unsupported APIs

Do NOT change visual design except when required to fix an issue.
Do NOT touch dark mode or hero section.
```

## Running Runtime Checks

For accessibility, performance, and link checking:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In another terminal, run runtime checks:
   ```bash
   npm run full:scan:runtime
   ```

## Customization

### Adding New Rules
Edit the respective config files to add custom rules:
- `eslint.config.js` - JavaScript/TypeScript rules
- `.stylelintrc.json` - CSS rules
- `.prettierrc` - Formatting preferences

### Excluding Files
Add patterns to the `ignores` array in `eslint.config.js` or modify other config files as needed.

### CI Configuration
Modify `.github/workflows/code-health.yml` to adjust CI behavior, add new checks, or change trigger conditions.

## Best Practices

1. **Run quick scan frequently**: `npm run scan:quick`
2. **Fix issues incrementally**: Use `--fix` flags where available
3. **Pre-commit checks**: Consider adding git hooks
4. **Regular full scans**: Run `npm run full:scan` before releases
5. **Monitor CI**: Address failing checks promptly

## Troubleshooting

### Common Issues

1. **ESLint errors on config files**: Add them to the `ignores` array
2. **Stylelint Tailwind issues**: Already configured to ignore Tailwind directives
3. **TypeScript path issues**: Ensure `tsconfig.json` paths are correct
4. **Performance scan fails**: Make sure dev server is running on port 3000

### Performance Tips

- Use `npm run scan:quick` for fast feedback
- Run full scans in CI, not locally
- Configure IDE extensions for real-time feedback
- Use `--fix` flags to auto-resolve many issues
