#!/bin/bash

# Layered Authorship Framework - Integration Installer
# Primary Author: Sean Christopher Southwick
# Computational Assistance: Non-human automated systems provided installation script structure

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")

echo -e "${BLUE}🚀 Layered Authorship Framework - Integration Installer${NC}"
echo "=" * 60

# Install Git Hooks
install_git_hooks() {
    echo -e "${YELLOW}📎 Installing Git hooks...${NC}"
    
    if [[ ! -d "$GIT_ROOT/.git" ]]; then
        echo -e "${RED}❌ Not in a Git repository${NC}"
        return 1
    fi
    
    # Install pre-commit hook
    cp "$SCRIPT_DIR/git-hooks/pre-commit" "$GIT_ROOT/.git/hooks/"
    chmod +x "$GIT_ROOT/.git/hooks/pre-commit"
    echo -e "${GREEN}  ✅ Pre-commit hook installed${NC}"
    
    # Install Python pre-commit config if Python is available
    if command -v python3 >/dev/null 2>&1; then
        cp "$SCRIPT_DIR/pre-commit-config.py" "$GIT_ROOT/.git/hooks/"
        echo -e "${GREEN}  ✅ Python pre-commit config installed${NC}"
    fi
}

# Install GitHub Actions
install_github_actions() {
    echo -e "${YELLOW}🔄 Installing GitHub Actions workflow...${NC}"
    
    mkdir -p "$GIT_ROOT/.github/workflows"
    cp "$SCRIPT_DIR/github-actions/authorship-check.yml" "$GIT_ROOT/.github/workflows/"
    echo -e "${GREEN}  ✅ GitHub Actions workflow installed${NC}"
}

# Install VS Code settings
install_vscode_settings() {
    echo -e "${YELLOW}💻 Installing VS Code settings...${NC}"
    
    mkdir -p "$GIT_ROOT/.vscode"
    
    # Merge with existing settings if they exist
    if [[ -f "$GIT_ROOT/.vscode/settings.json" ]]; then
        echo -e "${YELLOW}  ⚠️  Existing VS Code settings found. Manual merge required.${NC}"
        cp "$SCRIPT_DIR/vscode/settings.json" "$GIT_ROOT/.vscode/settings.authorship.json"
        echo -e "${YELLOW}  📋 Settings saved as settings.authorship.json${NC}"
    else
        cp "$SCRIPT_DIR/vscode/settings.json" "$GIT_ROOT/.vscode/"
        echo -e "${GREEN}  ✅ VS Code settings installed${NC}"
    fi
    
    # Install snippets
    mkdir -p "$GIT_ROOT/.vscode"
    cp "$SCRIPT_DIR/vscode/snippets.json" "$GIT_ROOT/.vscode/authorship-snippets.code-snippets"
    echo -e "${GREEN}  ✅ VS Code snippets installed${NC}"
}

# Install Webpack plugin
install_webpack_plugin() {
    echo -e "${YELLOW}📦 Installing Webpack plugin...${NC}"
    
    if [[ -f "$GIT_ROOT/package.json" ]]; then
        cp "$SCRIPT_DIR/webpack/authorship-plugin.js" "$GIT_ROOT/"
        echo -e "${GREEN}  ✅ Webpack plugin installed${NC}"
        echo -e "${BLUE}  📋 Add to webpack.config.js:${NC}"
        echo "     const AuthorshipFrameworkPlugin = require('./authorship-plugin.js')"
        echo "     plugins: [new AuthorshipFrameworkPlugin()]"
    else
        echo -e "${YELLOW}  ⏭️  No package.json found, skipping Webpack plugin${NC}"
    fi
}

# Main installation menu
show_menu() {
    echo ""
    echo "Select integrations to install:"
    echo "1) Git hooks (pre-commit)"
    echo "2) GitHub Actions workflow"
    echo "3) VS Code settings and snippets"
    echo "4) Webpack plugin"
    echo "5) All integrations"
    echo "6) Exit"
    echo ""
}

# Parse command line arguments
if [[ $# -gt 0 ]]; then
    case "$1" in
        git|hooks)
            install_git_hooks
            ;;
        github|actions)
            install_github_actions
            ;;
        vscode|code)
            install_vscode_settings
            ;;
        webpack)
            install_webpack_plugin
            ;;
        all)
            install_git_hooks
            install_github_actions
            install_vscode_settings
            install_webpack_plugin
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo "Usage: $0 [git|github|vscode|webpack|all]"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}🎉 Integration installation complete!${NC}"
    exit 0
fi

# Interactive menu
while true; do
    show_menu
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            install_git_hooks
            ;;
        2)
            install_github_actions
            ;;
        3)
            install_vscode_settings
            ;;
        4)
            install_webpack_plugin
            ;;
        5)
            install_git_hooks
            install_github_actions
            install_vscode_settings
            install_webpack_plugin
            ;;
        6)
            echo -e "${BLUE}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice. Please try again.${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}✅ Installation step completed${NC}"
    echo ""
done
