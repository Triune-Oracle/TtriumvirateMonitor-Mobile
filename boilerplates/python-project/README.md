# Python Project with Layered Authorship Framework

A Python project template that includes the Layered Authorship Framework for transparent attribution of human and computational contributions.

---

## Authorship Attribution

**Primary Author:** Sean Christopher Southwick  
**Computational Assistance:** Non-human automated systems provided Python project structure and packaging configuration  
**Human Collaborators:** None  
**Creation Date:** 2025-08-26  
**Last Modified:** 2025-08-26  
**Artifact ID:** SCS-PYTHON-BOILERPLATE-001  

**Contribution Level:** Level 2 - Assisted Development

---

## Getting Started

1. **Create virtual environment:**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   pip install -e .
   \`\`\`

3. **Run the project:**
   \`\`\`bash
   python main.py
   \`\`\`

4. **Add framework to existing files:**
   \`\`\`bash
   python scripts/add_framework_recursive.py
   \`\`\`

## Project Structure

\`\`\`
├── src/                   # Source code
├── tests/                 # Test files
├── scripts/              # Framework management scripts
├── templates/            # Attribution templates
├── main.py               # Main entry point
├── pyproject.toml        # Project configuration
└── AUTHORSHIP_FRAMEWORK.md
\`\`\`

## Framework Integration

This project automatically includes:
- Attribution docstrings in all Python files
- Framework documentation
- Automated attribution tools
- Project metadata with authorship information

## Development Guidelines

All new Python files should include appropriate attribution docstrings. Use the provided scripts to automatically add framework attribution to existing or new files.

---

*This project follows the [Layered Authorship Framework](./AUTHORSHIP_FRAMEWORK.md) for transparent attribution of human and computational contributions.*
