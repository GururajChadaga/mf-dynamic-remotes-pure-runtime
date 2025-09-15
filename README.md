# Module Federation Dynamic Remotes - Pure Runtime

This repository contains modifications made to the official Module Federation examples from [module-federation-examples/advanced-api/dynamic-remotes](https://github.com/module-federation/module-federation-examples/tree/master/advanced-api/dynamic-remotes) to also demonstrate pure runtime consumption.

## Architecture

### Remote Applications
- **app2** - Remote application running on port 3002
- **app3** - Remote application running on port 3003

### Host Applications
- **hostbuildtime** (port 3000) - Uses Module Federation build plugin to consume app2 and app3 at build time
- **hostruntime** (port 3001) - Attempts to use `createInstance` from Module Federation runtime to load remotes app2 and app3 at runtime

## Issue Description

The repository demonstrates a critical issue with pure runtime Module Federation:

- **hostbuildtime**: Console log of webpack share scopes confirms correct initialization of shared dependencies
- **hostruntime**: Webpack share scopes shows an empty object, causing React sharing to fail

This results in an "invalid hook call error" when clicking the app3 button in hostruntime, as React is not correctly shared between the host and remote applications.

## Scripts

- `npm start` - Start all applications concurrently
- `npm run cleandist` - Remove all dist directories
- `npm run cleanstart` - Clean dist directories and start all applications

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start all applications:
   ```bash
   npm start
   ```

3. Access the applications:
   - hostbuildtime: http://localhost:3000 (working)
   - hostruntime: http://localhost:3001 (React sharing issue)
   - app2: http://localhost:3002
   - app3: http://localhost:3003

## Problem Investigation

The core issue lies in the difference between build-time and runtime Module Federation approaches:

1. **Build-time approach** (hostbuildtime) properly initializes webpack share scopes during the build process
2. **Runtime approach** (hostruntime) fails to properly initialize shared dependencies, resulting in empty share scopes and React hook errors
