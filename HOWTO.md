# HOWTO: Build and Use Ollama-Only Cody Extension

This guide explains how to build and use a modified version of the Cody VS Code extension that works exclusively with local Ollama models, bypassing all Sourcegraph authentication and subscription requirements.

## What Was Modified

The following changes were made to create a local-only Ollama version:

### 1. Authentication Bypass
- **File**: `vscode/src/services/AuthProvider.ts`
- **Change**: Created `LocalAuthProvider` that automatically authenticates as "lambda" user
- **Result**: No login required, direct access to chat interface

### 2. Subscription Bypass
- **Files**: 
  - `lib/shared/src/sourcegraph-api/userProductSubscription.ts`
  - `lib/shared/src/auth/types.ts`
- **Change**: All users treated as enterprise users with full access
- **Result**: No subscription checks, no upgrade prompts, full feature access

### 3. Ollama-Only Models
- **File**: `lib/shared/src/models/sync.ts`
- **Change**: Only load local Ollama models, ignore all server-side models
- **Result**: Model selector shows only your local Ollama models

### 4. UI Cleanup
- **File**: `vscode/webviews/components/Notices.tsx`
- **Change**: Removed all subscription notices and upgrade prompts
- **Result**: Clean UI without Sourcegraph-specific notifications

## Prerequisites

1. **Node.js 18+** and **pnpm 8.6.7+**
2. **VS Code Extension CLI (vsce)**:
   ```bash
   npm install -g @vscode/vsce
   ```
3. **Ollama installed and running** on `localhost:11434`

## Building the VSIX

### Step 1: Install Dependencies
```bash
cd cody
pnpm install
```

### Step 2: Build the Extension
```bash
cd vscode
pnpm build
```

### Step 3: Create VSIX Package
```bash
# For production build
vsce package --no-dependencies --out dist/cody-ollama.vsix

# Or use the existing script for testing
pnpm run _build:vsix_for_test
```

The VSIX file will be created at:
- `vscode/dist/cody-ollama.vsix` (production build)
- `vscode/dist/cody.e2e.vsix` (test build)

## Installing the VSIX

### Method 1: VS Code Command Line
```bash
code --install-extension vscode/dist/cody-ollama.vsix
```

### Method 2: VS Code UI
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Click the three dots menu (`...`)
4. Select "Install from VSIX..."
5. Choose your `cody-ollama.vsix` file

### Method 3: VS Code Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Extensions: Install from VSIX..."
3. Select your VSIX file

## Using the Extension

### 1. Start Ollama
Make sure Ollama is running with at least one model:
```bash
# Start Ollama (if not already running)
ollama serve

# Pull a model if you don't have any
ollama pull gemma2
```

### 2. Open VS Code
The extension will automatically:
- Authenticate you as "lambda" user
- Detect your local Ollama models
- Show the chat interface

### 3. Access Chat
- Click the Cody icon in the activity bar
- The chat interface opens immediately (no login required)
- Model selector appears in the chat toolbar if you have Ollama models

### 4. Select Models
- Click the model selector in the chat input toolbar
- Choose from your available Ollama models
- Start chatting!

## Troubleshooting

### No Model Selector Appears
1. **Check Ollama is running**: `curl http://localhost:11434/api/tags`
2. **Verify models are available**: `ollama list`
3. **Restart VS Code** after installing the extension
4. **Check Developer Console** (`Ctrl+Shift+I`) for errors

### Models Not Detected
1. **Ollama must be on port 11434** (default)
2. **Pull at least one model**: `ollama pull llama2`
3. **Restart the extension**: Reload VS Code window

### Extension Not Loading
1. **Disable original Cody extension** if installed
2. **Check VS Code version compatibility** (requires VS Code 1.80+)
3. **Verify VSIX installation**: Check Extensions list

## Development Workflow

### For Development/Testing
```bash
cd vscode
pnpm dev:desktop  # Opens new VS Code window with extension loaded
```

### For Production Build
```bash
cd vscode
pnpm build
vsce package --no-dependencies --out dist/cody-ollama.vsix
```

### Building from Scratch
```bash
git clone https://github.com/phelstab/cody
cd cody
pnpm install
cd vscode
pnpm build
vsce package --no-dependencies --out dist/cody-ollama.vsix
```

## Features

✅ **No Authentication Required** - Auto-login as "lambda" user  
✅ **Local Ollama Models Only** - No cloud dependencies  
✅ **Full Chat Functionality** - All chat features work locally  
✅ **Code Completion** - Works with local models  
✅ **No Subscription Checks** - All features unlocked  
✅ **Clean UI** - No upgrade prompts or notices  

## Technical Notes

- **Model Detection**: Extension checks `http://localhost:11434/api/tags` for models
- **Authentication**: Bypassed with hardcoded "lambda" user
- **Subscriptions**: All users treated as enterprise (full access)
- **Rate Limiting**: Disabled for local development
- **Telemetry**: Original telemetry behavior preserved

## File Structure

Key modified files:
```
vscode/
├── src/services/AuthProvider.ts           # Authentication bypass
├── webviews/components/Notices.tsx        # UI cleanup
lib/shared/src/
├── auth/types.ts                          # Subscription bypass
├── models/sync.ts                         # Ollama-only models
└── sourcegraph-api/userProductSubscription.ts  # Plan bypass
```

Built extension:
```
vscode/dist/
└── cody-ollama.vsix                       # Installable extension
```

---

**Note**: This modified extension is for local development and testing only. It removes all Sourcegraph cloud features and works exclusively with local Ollama models.
