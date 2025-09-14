#!/bin/bash

# Layered Authorship Framework - Batch Addition Script
# Primary Author: Sean Christopher Southwick
# Computational Assistance: Non-human automated systems provided script structure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ROOT_PATH="."
SCRIPT_TYPE="auto"
DRY_RUN=false
VERBOSE=false

# Help function
show_help() {
    echo "Layered Authorship Framework - Recursive Addition Tool"
    echo ""
    echo "Usage: $0 [OPTIONS] [PATH]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -t, --type TYPE     Script type: 'node', 'python', or 'auto' (default: auto)"
    echo "  -d, --dry-run       Show what would be processed without making changes"
    echo "  -v, --verbose       Enable verbose output"
    echo ""
    echo "Arguments:"
    echo "  PATH                Root path to process (default: current directory)"
    echo ""
    echo "Examples:"
    echo "  $0                          # Process current directory with auto-detection"
    echo "  $0 -t node ./my-project     # Use Node.js script for ./my-project"
    echo "  $0 -t python -v ~/projects  # Use Python script with verbose output"
    echo "  $0 --dry-run                # Preview what would be processed"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -t|--type)
            SCRIPT_TYPE="$2"
            shift 2
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            echo -e "${RED}Error: Unknown option $1${NC}" >&2
            show_help
            exit 1
            ;;
        *)
            ROOT_PATH="$1"
            shift
            ;;
    esac
done

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Auto-detect script type if needed
if [[ "$SCRIPT_TYPE" == "auto" ]]; then
    if command -v node >/dev/null 2>&1; then
        SCRIPT_TYPE="node"
        echo -e "${BLUE}🔍 Auto-detected: Using Node.js script${NC}"
    elif command -v python3 >/dev/null 2>&1; then
        SCRIPT_TYPE="python"
        echo -e "${BLUE}🔍 Auto-detected: Using Python script${NC}"
    else
        echo -e "${RED}❌ Error: Neither Node.js nor Python3 found${NC}" >&2
        echo "Please install Node.js or Python3, or specify script type manually"
        exit 1
    fi
fi

# Validate script type and check dependencies
case "$SCRIPT_TYPE" in
    node)
        if ! command -v node >/dev/null 2>&1; then
            echo -e "${RED}❌ Error: Node.js not found${NC}" >&2
            exit 1
        fi
        SCRIPT_PATH="$SCRIPT_DIR/add-framework-recursive.js"
        ;;
    python)
        if ! command -v python3 >/dev/null 2>&1; then
            echo -e "${RED}❌ Error: Python3 not found${NC}" >&2
            exit 1
        fi
        SCRIPT_PATH="$SCRIPT_DIR/add_framework_recursive.py"
        ;;
    *)
        echo -e "${RED}❌ Error: Invalid script type '$SCRIPT_TYPE'${NC}" >&2
        echo "Valid types: node, python, auto"
        exit 1
        ;;
esac

# Check if script exists
if [[ ! -f "$SCRIPT_PATH" ]]; then
    echo -e "${RED}❌ Error: Script not found at $SCRIPT_PATH${NC}" >&2
    exit 1
fi

# Validate root path
if [[ ! -d "$ROOT_PATH" ]]; then
    echo -e "${RED}❌ Error: Directory '$ROOT_PATH' does not exist${NC}" >&2
    exit 1
fi

# Show configuration
echo -e "${BLUE}🚀 Layered Authorship Framework - Recursive Addition${NC}"
echo -e "${BLUE}=================================================${NC}"
echo "Script type: $SCRIPT_TYPE"
echo "Root path: $(realpath "$ROOT_PATH")"
echo "Dry run: $DRY_RUN"
echo "Verbose: $VERBOSE"
echo ""

# Dry run preview
if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}🔍 DRY RUN MODE - No files will be modified${NC}"
    echo ""
    
    # Show what would be processed
    echo "Files that would be processed:"
    find "$ROOT_PATH" -type f \( \
        -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o \
        -name "*.py" -o -name "*.html" -o -name "*.md" -o \
        -name "*.yml" -o -name "*.yaml" \
    \) ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" ! -path "*/build/*" \
    | head -20
    
    echo ""
    echo -e "${YELLOW}Use without --dry-run to actually process files${NC}"
    exit 0
fi

# Confirm before proceeding
echo -e "${YELLOW}⚠️  This will add authorship attribution to files in the specified directory.${NC}"
echo -e "${YELLOW}   Make sure you have backups of important files.${NC}"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚫 Operation cancelled${NC}"
    exit 0
fi

# Execute the appropriate script
echo -e "${GREEN}🎯 Starting framework addition...${NC}"
echo ""

case "$SCRIPT_TYPE" in
    node)
        if [[ "$VERBOSE" == "true" ]]; then
            node "$SCRIPT_PATH" "$ROOT_PATH"
        else
            node "$SCRIPT_PATH" "$ROOT_PATH" 2>/dev/null
        fi
        ;;
    python)
        if [[ "$VERBOSE" == "true" ]]; then
            python3 "$SCRIPT_PATH" "$ROOT_PATH"
        else
            python3 "$SCRIPT_PATH" "$ROOT_PATH" 2>/dev/null
        fi
        ;;
esac

# Check exit status
if [[ $? -eq 0 ]]; then
    echo ""
    echo -e "${GREEN}✅ Framework addition completed successfully!${NC}"
    echo -e "${BLUE}📋 Check the generated report file for details${NC}"
else
    echo ""
    echo -e "${RED}❌ Framework addition failed${NC}"
    exit 1
fi
