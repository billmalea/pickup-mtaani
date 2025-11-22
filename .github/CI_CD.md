# CI/CD Documentation

This document describes the Continuous Integration and Continuous Deployment setup for the Pickup Mtaani SDK.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `master`, `main`, or `develop` branches
- Pull requests to `master`, `main`, or `develop` branches

**Jobs:**

#### Test Job
- **Matrix Strategy**: Tests on Node.js 16.x, 18.x, and 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Run ESLint
  5. Build TypeScript
  6. Run tests
  7. Upload coverage to Codecov (Node 20.x only)

#### Build Job
- **Depends on**: Test job must pass
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Build package
  5. Verify dist directory
  6. Upload build artifacts

**Status Badge:**
```markdown
[![CI](https://github.com/billmalea/pickup-mtaani/actions/workflows/ci.yml/badge.svg)](https://github.com/billmalea/pickup-mtaani/actions/workflows/ci.yml)
```

### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- GitHub Release published

**Jobs:**

#### Publish to NPM
- **Steps**:
  1. Checkout code
  2. Setup Node.js with npm registry
  3. Install dependencies
  4. Run tests
  5. Build package
  6. Publish to npm (requires `NPM_TOKEN` secret)

#### Publish to GitHub Packages
- **Steps**:
  1. Checkout code
  2. Setup Node.js with GitHub registry
  3. Install dependencies
  4. Build package
  5. Update package name to scoped format
  6. Publish to GitHub Packages

#### Create Release Notes
- **Depends on**: Both publish jobs
- **Steps**:
  1. Generate changelog
  2. Update release with installation instructions and links

**Required Secrets:**
- `NPM_TOKEN`: npm access token for publishing
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### 3. Code Quality Workflow (`.github/workflows/code-quality.yml`)

**Triggers:**
- Push to `master`, `main`, or `develop` branches
- Pull requests

**Jobs:**

#### Lint
- Run ESLint
- Check Prettier formatting

#### Type Check
- Run TypeScript compiler with `--noEmit`

#### Security Audit
- Run `npm audit`
- Run Snyk security scan (requires `SNYK_TOKEN` secret)

#### Dependency Review
- Reviews dependencies in pull requests
- Fails on moderate+ severity vulnerabilities

## Setup Instructions

### 1. Configure NPM Token

To publish to npm, you need to create an npm access token:

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Go to Settings → Access Tokens
3. Generate a new Automation token
4. Add it to GitHub Secrets:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

### 2. Configure Snyk (Optional)

For security scanning:

1. Sign up at [snyk.io](https://snyk.io/)
2. Get your API token from Account Settings
3. Add it to GitHub Secrets as `SNYK_TOKEN`

### 3. Enable GitHub Packages (Optional)

GitHub Packages publishing is configured but optional. It works automatically with the `GITHUB_TOKEN`.

### 4. Configure Branch Protection

Recommended branch protection rules for `master`:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `master`
3. Enable:
   - ✓ Require a pull request before merging
   - ✓ Require status checks to pass before merging
     - Required checks: `test`, `build`, `lint`, `type-check`
   - ✓ Require branches to be up to date before merging
   - ✓ Require linear history
   - ✓ Include administrators

## Creating a Release

### Manual Release

1. **Update Version**
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Push with Tags**
   ```bash
   git push origin master --tags
   ```

3. **Create GitHub Release**
   - Go to Releases → Draft a new release
   - Choose the tag you just pushed
   - Add release notes
   - Click "Publish release"

4. **Automated Actions**
   - CI tests will run
   - Package will be published to npm
   - Package will be published to GitHub Packages
   - Release notes will be updated

### Automated Release (Recommended)

Use semantic-release for automated versioning:

1. **Install semantic-release**
   ```bash
   npm install --save-dev semantic-release @semantic-release/git @semantic-release/changelog
   ```

2. **Add Configuration** (`.releaserc.json`)
   ```json
   {
     "branches": ["master"],
     "plugins": [
       "@semantic-release/commit-analyzer",
       "@semantic-release/release-notes-generator",
       "@semantic-release/changelog",
       "@semantic-release/npm",
       "@semantic-release/github",
       "@semantic-release/git"
     ]
   }
   ```

3. **Use Conventional Commits**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   git commit -m "docs: update README"
   ```

4. **Push to Master**
   - semantic-release will automatically:
     - Determine version bump
     - Generate changelog
     - Create GitHub release
     - Publish to npm

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

## Monitoring

### Check Workflow Status

- Go to Actions tab in your repository
- View workflow runs
- Check logs for failures

### Badges

Add these badges to your README:

```markdown
[![CI](https://github.com/billmalea/pickup-mtaani/actions/workflows/ci.yml/badge.svg)](https://github.com/billmalea/pickup-mtaani/actions/workflows/ci.yml)
[![Release](https://github.com/billmalea/pickup-mtaani/actions/workflows/release.yml/badge.svg)](https://github.com/billmalea/pickup-mtaani/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/pickup-mtaani-sdk.svg)](https://www.npmjs.com/package/pickup-mtaani-sdk)
[![codecov](https://codecov.io/gh/billmalea/pickup-mtaani/branch/master/graph/badge.svg)](https://codecov.io/gh/billmalea/pickup-mtaani)
```

## Troubleshooting

### NPM Publish Fails

- Verify `NPM_TOKEN` is set correctly
- Check if package name is available on npm
- Ensure version number is unique
- Check npm access level (public vs private)

### Build Fails

- Check TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check Node.js version compatibility

### Tests Fail

- Run tests locally: `npm test`
- Check test environment setup
- Verify all test files are committed

### Security Scan Issues

- Review security vulnerabilities: `npm audit`
- Update dependencies: `npm update`
- Check for breaking changes before updating

## Best Practices

1. **Always run tests locally before pushing**
   ```bash
   npm run lint
   npm run build
   npm test
   ```

2. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

3. **Review PRs carefully**
   - Check CI status
   - Review code changes
   - Test locally

4. **Monitor npm downloads**
   - Check [npm stats](https://www.npmjs.com/package/pickup-mtaani-sdk)
   - Monitor for issues

5. **Respond to security alerts**
   - Enable Dependabot alerts
   - Update vulnerable dependencies promptly

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
