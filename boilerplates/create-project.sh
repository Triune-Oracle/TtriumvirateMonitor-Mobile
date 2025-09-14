#!/bin/bash

# Layered Authorship Framework - Project Creator
# Primary Author: Sean Christopher Southwick
# Computational Assistance: Non-human automated systems provided script structure

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    echo "Layered Authorship Framework - Project Creator"
    echo ""
    echo "Usage: $0 <project-type> <project-name> [options]"
    echo ""
    echo "Project Types:"
    echo "  nextjs      Next.js/React project"
    echo "  python      Python project"
    echo "  nodejs      Node.js project"
    echo "  docs        Documentation project"
    echo ""
    echo "Options:"
    echo "  -h, --help  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 nextjs my-web-app"
    echo "  $0 python data-analysis-tool"
    echo "  $0 nodejs api-server"
    echo "  $0 docs project-documentation"
}

# Validate arguments
if [[ $# -lt 2 ]]; then
    show_help
    exit 1
fi

PROJECT_TYPE="$1"
PROJECT_NAME="$2"

# Validate project type
case "$PROJECT_TYPE" in
    nextjs|python|nodejs|docs)
        ;;
    *)
        echo -e "${RED}❌ Error: Invalid project type '$PROJECT_TYPE'${NC}" >&2
        show_help
        exit 1
        ;;
esac

# Check if project directory already exists
if [[ -d "$PROJECT_NAME" ]]; then
    echo -e "${RED}❌ Error: Directory '$PROJECT_NAME' already exists${NC}" >&2
    exit 1
fi

echo -e "${BLUE}🚀 Creating $PROJECT_TYPE project: $PROJECT_NAME${NC}"
echo ""

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Copy boilerplate files
BOILERPLATE_DIR="$SCRIPT_DIR/$PROJECT_TYPE-project"

if [[ ! -d "$BOILERPLATE_DIR" ]]; then
    echo -e "${RED}❌ Error: Boilerplate for '$PROJECT_TYPE' not found${NC}" >&2
    exit 1
fi

echo -e "${YELLOW}📁 Copying boilerplate files...${NC}"
cp -r "$BOILERPLATE_DIR"/* .

# Copy framework templates and scripts
echo -e "${YELLOW}📋 Adding framework templates...${NC}"
cp -r "$SCRIPT_DIR/../templates" .
cp -r "$SCRIPT_DIR/../scripts" .

# Update project name in files
echo -e "${YELLOW}✏️  Updating project configuration...${NC}"

# Update package.json or pyproject.toml
if [[ -f "package.json" ]]; then
    sed -i.bak "s/scs-${PROJECT_TYPE}-project/${PROJECT_NAME}/g" package.json
    rm package.json.bak
elif [[ -f "pyproject.toml" ]]; then
    sed -i.bak "s/scs-${PROJECT_TYPE}-project/${PROJECT_NAME}/g" pyproject.toml
    rm pyproject.toml.bak
fi

# Update README.md
if [[ -f "README.md" ]]; then
    sed -i.bak "s/${PROJECT_TYPE^} Project with Layered Authorship Framework/${PROJECT_NAME}/g" README.md
    rm README.md.bak
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x scripts/*.py 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Project '$PROJECT_NAME' created successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"

case "$PROJECT_TYPE" in
    nextjs)
        echo "2. npm install"
        echo "3. npm run dev"
        ;;
    python)
        echo "2. python -m venv venv && source venv/bin/activate"
        echo "3. pip install -e ."
        echo "4. python main.py"
        ;;
    nodejs)
        echo "2. npm install"
        echo "3. npm start"
        ;;
    docs)
        echo "2. Open README.md and start documenting"
        ;;
esac

echo ""
echo -e "${BLUE}📋 The project includes the Layered Authorship Framework by default${NC}"
echo -e "${BLUE}📖 See AUTHORSHIP_FRAMEWORK.md for details${NC}"
