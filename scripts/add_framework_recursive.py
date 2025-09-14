#!/usr/bin/env python3

import os
import json
import re
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import argparse

class AuthorshipFrameworkAdder:
    """
    Recursively adds Layered Authorship Framework attribution to project files.
    """
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = {
            'primary_author': 'Sean Christopher Southwick',
            'framework_version': '1.0.0',
            'exclude_dirs': {'.git', 'node_modules', '.next', 'dist', 'build', '.vscode', '.idea', '__pycache__'},
            'exclude_files': {'.DS_Store', 'Thumbs.db', '.pyc'},
            'max_file_size': 10 * 1024 * 1024,  # 10MB
            **(config or {})
        }
        
        self.file_types = {
            '.py': {'type': 'python', 'template': 'python-header-template.py'},
            '.js': {'type': 'javascript', 'template': 'code-header-template.js'},
            '.jsx': {'type': 'javascript', 'template': 'code-header-template.js'},
            '.ts': {'type': 'javascript', 'template': 'code-header-template.js'},
            '.tsx': {'type': 'javascript', 'template': 'code-header-template.js'},
            '.html': {'type': 'html', 'template': 'html-header-template.html'},
            '.md': {'type': 'markdown', 'template': 'README_TEMPLATE.md'},
            '.yml': {'type': 'yaml', 'template': 'project-metadata.yml'},
            '.yaml': {'type': 'yaml', 'template': 'project-metadata.yml'},
        }
        
        self.report = {
            'processed': 0,
            'modified': 0,
            'skipped': 0,
            'errors': 0,
            'files': []
        }
    
    def load_template(self, template_name: str) -> Optional[str]:
        """Load template file content."""
        try:
            template_path = Path(__file__).parent.parent / 'templates' / template_name
            return template_path.read_text(encoding='utf-8')
        except FileNotFoundError:
            print(f"⚠️  Template {template_name} not found")
            return None
        except Exception as e:
            print(f"❌ Error loading template {template_name}: {e}")
            return None
    
    def generate_attribution_data(self, file_path: Path, assistance_type: str = 'code structure and formatting') -> Dict[str, str]:
        """Generate attribution data for a file."""
        now = datetime.now().strftime('%Y-%m-%d')
        artifact_id = f"SCS-{int(time.time())}-{hash(str(file_path)) % 1000000:06d}"
        
        return {
            'primary_author': self.config['primary_author'],
            'assistance_type': assistance_type,
            'collaborators': 'None',
            'creation_date': now,
            'last_modified': now,
            'artifact_id': artifact_id,
            'contribution_level': 'Level 2 - Assisted Development',
            'file_path': str(file_path.relative_to(Path.cwd()))
        }
    
    def replace_template_placeholders(self, template: str, data: Dict[str, str]) -> str:
        """Replace template placeholders with actual data."""
        replacements = {
            '{primary_author}': data['primary_author'],
            '{assistance_type}': data['assistance_type'],
            '{collaborators}': data['collaborators'],
            '{creation_date}': data['creation_date'],
            '{last_modified}': data['last_modified'],
            '{artifact_id}': data['artifact_id'],
            '{contribution_level}': data['contribution_level'],
            # JavaScript style placeholders
            '{primaryAuthor}': data['primary_author'],
            '{assistanceType}': data['assistance_type'],
            '{creationDate}': data['creation_date'],
            '{lastModified}': data['last_modified'],
            '{artifactId}': data['artifact_id'],
            '{contributionLevel}': data['contribution_level'],
        }
        
        result = template
        for placeholder, value in replacements.items():
            result = result.replace(placeholder, value)
        
        return result
    
    def has_existing_attribution(self, content: str) -> bool:
        """Check if file already has authorship attribution."""
        attribution_markers = [
            'layered authorship framework',
            'primary author: sean christopher southwick',
            'sean christopher southwick',
            'authorship attribution'
        ]
        
        content_lower = content.lower()
        return any(marker in content_lower for marker in attribution_markers)
    
    def process_file(self, file_path: Path) -> Dict[str, any]:
        """Process a single file and add attribution if needed."""
        try:
            self.report['processed'] += 1
            
            # Check file extension
            ext = file_path.suffix.lower()
            file_type_info = self.file_types.get(ext)
            
            if not file_type_info or not file_type_info['template']:
                self.report['skipped'] += 1
                return {'status': 'skipped', 'reason': 'No template for file type'}
            
            # Check file size
            if file_path.stat().st_size > self.config['max_file_size']:
                self.report['skipped'] += 1
                return {'status': 'skipped', 'reason': 'File too large'}
            
            # Read file content
            try:
                content = file_path.read_text(encoding='utf-8')
            except UnicodeDecodeError:
                self.report['skipped'] += 1
                return {'status': 'skipped', 'reason': 'Binary file or encoding issue'}
            
            # Check for existing attribution
            if self.has_existing_attribution(content):
                self.report['skipped'] += 1
                return {'status': 'skipped', 'reason': 'Attribution already exists'}
            
            # Load template
            template = self.load_template(file_type_info['template'])
            if not template:
                self.report['skipped'] += 1
                return {'status': 'skipped', 'reason': 'Template not found'}
            
            # Generate attribution
            attribution_data = self.generate_attribution_data(file_path)
            attribution = self.replace_template_placeholders(template, attribution_data)
            
            # Create new content
            if file_type_info['type'] == 'markdown':
                # For markdown, replace template placeholders in full template
                new_content = self.replace_template_placeholders(template, {
                    **attribution_data,
                    '{PROJECT_NAME}': file_path.parent.name,
                    '{PROJECT_DESCRIPTION}': 'Project description here',
                    '{PROJECT_CONTENT}': content
                })
            else:
                # For code files, prepend attribution header
                new_content = attribution + '\n\n' + content
            
            # Write updated content
            file_path.write_text(new_content, encoding='utf-8')
            self.report['modified'] += 1
            
            return {
                'status': 'modified',
                'attribution': attribution_data,
                'file_type': file_type_info['type']
            }
            
        except Exception as e:
            self.report['errors'] += 1
            return {'status': 'error', 'error': str(e)}
    
    def process_directory(self, dir_path: Path) -> None:
        """Recursively process directory."""
        try:
            for item in dir_path.iterdir():
                if item.is_dir():
                    if item.name not in self.config['exclude_dirs']:
                        self.process_directory(item)
                elif item.is_file():
                    if item.name not in self.config['exclude_files']:
                        result = self.process_file(item)
                        self.report['files'].append({
                            'path': str(item.relative_to(Path.cwd())),
                            **result
                        })
        except PermissionError:
            print(f"⚠️  Permission denied: {dir_path}")
        except Exception as e:
            print(f"❌ Error processing directory {dir_path}: {e}")
    
    def add_framework_recursively(self, root_path: str = '.') -> Dict:
        """Main method to add framework recursively."""
        root = Path(root_path).resolve()
        
        print(f"🚀 Starting Layered Authorship Framework addition...")
        print(f"📁 Root path: {root}")
        
        start_time = time.time()
        self.process_directory(root)
        end_time = time.time()
        
        # Generate report
        print(f"\n📊 PROCESSING REPORT")
        print("=" * 50)
        print(f"⏱️  Processing time: {end_time - start_time:.2f}s")
        print(f"📄 Files processed: {self.report['processed']}")
        print(f"✅ Files modified: {self.report['modified']}")
        print(f"⏭️  Files skipped: {self.report['skipped']}")
        print(f"❌ Errors: {self.report['errors']}")
        
        if self.report['modified'] > 0:
            print(f"\n📝 MODIFIED FILES:")
            for file_info in self.report['files']:
                if file_info['status'] == 'modified':
                    print(f"  ✅ {file_info['path']} ({file_info.get('file_type', 'unknown')})")
        
        if self.report['errors'] > 0:
            print(f"\n❌ ERRORS:")
            for file_info in self.report['files']:
                if file_info['status'] == 'error':
                    print(f"  ❌ {file_info['path']}: {file_info.get('error', 'Unknown error')}")
        
        # Save detailed report
        report_path = f"authorship-framework-report-{int(time.time())}.json"
        with open(report_path, 'w') as f:
            json.dump(self.report, f, indent=2)
        print(f"\n📋 Detailed report saved to: {report_path}")
        
        return self.report

def main():
    parser = argparse.ArgumentParser(description='Add Layered Authorship Framework to projects recursively')
    parser.add_argument('path', nargs='?', default='.', help='Root path to process (default: current directory)')
    parser.add_argument('--config', help='Path to configuration JSON file')
    
    args = parser.parse_args()
    
    config = {}
    if args.config:
        try:
            with open(args.config) as f:
                config = json.load(f)
        except Exception as e:
            print(f"❌ Error loading config: {e}")
            return 1
    
    adder = AuthorshipFrameworkAdder(config)
    
    try:
        adder.add_framework_recursively(args.path)
        print("\n🎉 Framework addition complete!")
        return 0
    except Exception as e:
        print(f"💥 Fatal error: {e}")
        return 1

if __name__ == '__main__':
    exit(main())
