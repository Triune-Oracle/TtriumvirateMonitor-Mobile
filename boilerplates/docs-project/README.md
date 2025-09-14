# Documentation Project with Layered Authorship Framework

A documentation project template that includes the Layered Authorship Framework for transparent attribution of human and computational contributions.

---

## Authorship Attribution

**Primary Author:** Sean Christopher Southwick  
**Computational Assistance:** Non-human automated systems provided documentation structure and formatting  
**Human Collaborators:** None  
**Creation Date:** 2025-08-26  
**Last Modified:** 2025-08-26  
**Artifact ID:** SCS-DOCS-BOILERPLATE-001  

**Contribution Level:** Level 2 - Assisted Development

---

## Project Overview

This documentation project provides a structured approach to creating comprehensive project documentation while maintaining transparent authorship attribution.

## Documentation Structure

\`\`\`
├── docs/
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── tutorials/
│   └── examples/
├── assets/
│   ├── images/
│   └── diagrams/
├── templates/              # Attribution templates
├── scripts/               # Framework management scripts
└── AUTHORSHIP_FRAMEWORK.md
\`\`\`

## Writing Guidelines

### Attribution Requirements

All documentation files should include the standard attribution block:

\`\`\`markdown
---
## Authorship Attribution

**Primary Author:** Sean Christopher Southwick  
**Computational Assistance:** [Describe assistance provided]  
**Human Collaborators:** [List collaborators if any]  
**Creation Date:** [Date]  
**Last Modified:** [Date]  
**Artifact ID:** [Unique identifier]  

**Contribution Level:** [Level 1, 2, or 3]
---
\`\`\`

### Content Guidelines

1. **Clarity**: Write clear, concise explanations
2. **Structure**: Use consistent heading hierarchy
3. **Examples**: Include practical examples where applicable
4. **Attribution**: Always include proper attribution for all content

## Framework Integration

This documentation project includes:
- Attribution templates for all document types
- Automated attribution tools
- Consistent formatting guidelines
- Framework compliance verification

## Adding Framework to Existing Files

Use the provided scripts to add framework attribution to existing documentation:

\`\`\`bash
# For markdown files
./scripts/add-framework.sh ./docs

# For specific files
python scripts/add_framework_recursive.py ./specific-file.md
\`\`\`

---

*This documentation follows the [Layered Authorship Framework](./AUTHORSHIP_FRAMEWORK.md) for transparent attribution of human and computational contributions.*
