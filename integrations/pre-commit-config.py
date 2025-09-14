"""
Layered Authorship Framework Attribution

Primary Author: Sean Christopher Southwick
Computational Assistance: Non-human automated systems provided pre-commit configuration
Human Collaborators: None
Creation Date: 2025-08-26
Last Modified: 2025-08-26
Artifact ID: SCS-PRECOMMIT-CONFIG-001

Contribution Level: Level 2 - Assisted Development
"""

import os
import sys
import subprocess
import re
from pathlib import Path
from typing import List, Set

class AuthorshipFrameworkChecker:
    """Pre-commit hook for Layered Authorship Framework compliance."""
    
    ATTRIBUTION_MARKERS = [
        "Layered Authorship Framework",
        "Primary Author: Sean Christopher Southwick"
    ]
    
    SUPPORTED_EXTENSIONS = {
        '.py', '.js', '.jsx', '.ts', '.tsx', 
        '.html', '.md', '.yml', '.yaml'
    }
    
    def __init__(self):
        self.git_root = self._get_git_root()
        self.framework_scripts = self._find_framework_scripts()
    
    def _get_git_root(self) -> Path:
        """Get the root directory of the git repository."""
        try:
            result = subprocess.run(
                ['git', 'rev-parse', '--show-toplevel'],
                capture_output=True, text=True, check=True
            )
            return Path(result.stdout.strip())
        except subprocess.CalledProcessError:
            return Path.cwd()
    
    def _find_framework_scripts(self) -> List[str]:
        """Find available framework scripts."""
        scripts = []
        
        js_script = self.git_root / 'scripts' / 'add-framework-recursive.js'
        if js_script.exists():
            scripts.append(f'node {js_script}')
        
        py_script = self.git_root / 'scripts' / 'add_framework_recursive.py'
        if py_script.exists():
            scripts.append(f'python3 {py_script}')
        
        return scripts
    
    def _get_staged_files(self) -> List[Path]:
        """Get list of staged files."""
        try:
            result = subprocess.run(
                ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
                capture_output=True, text=True, check=True
            )
            return [Path(f) for f in result.stdout.strip().split('\n') if f]
        except subprocess.CalledProcessError:
            return []
    
    def _has_attribution(self, file_path: Path) -> bool:
        """Check if file has proper attribution."""
        try:
            content = file_path.read_text(encoding='utf-8')
            return any(marker in content for marker in self.ATTRIBUTION_MARKERS)
        except (UnicodeDecodeError, FileNotFoundError):
            return True  # Skip binary files or missing files
    
    def _needs_attribution(self, file_path: Path) -> bool:
        """Check if file needs attribution based on extension."""
        return file_path.suffix.lower() in self.SUPPORTED_EXTENSIONS
    
    def check_staged_files(self) -> tuple[List[Path], bool]:
        """Check staged files for attribution compliance."""
        staged_files = self._get_staged_files()
        missing_attribution = []
        
        for file_path in staged_files:
            if (file_path.exists() and 
                self._needs_attribution(file_path) and 
                not self._has_attribution(file_path)):
                missing_attribution.append(file_path)
        
        return missing_attribution, len(missing_attribution) == 0
    
    def add_attribution_to_files(self, files: List[Path]) -> bool:
        """Add attribution to files using framework scripts."""
        if not self.framework_scripts:
            print("❌ No framework scripts found")
            return False
        
        script = self.framework_scripts[0]  # Use first available script
        
        try:
            # Process each file individually
            for file_path in files:
                temp_dir = Path.cwd() / '.temp_attribution'
                temp_dir.mkdir(exist_ok=True)
                
                # Copy file to temp directory
                temp_file = temp_dir / file_path.name
                temp_file.write_text(file_path.read_text())
                
                # Run framework script on temp directory
                subprocess.run(
                    script.split() + [str(temp_dir)],
                    capture_output=True, check=True
                )
                
                # Copy back if modified
                if temp_file.exists():
                    file_path.write_text(temp_file.read_text())
                    subprocess.run(['git', 'add', str(file_path)], check=True)
                    print(f"✅ Added attribution to {file_path}")
                
                # Cleanup
                temp_dir.rmdir() if temp_dir.exists() else None
            
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error adding attribution: {e}")
            return False
    
    def run_check(self) -> int:
        """Run the pre-commit check."""
        print("🔍 Layered Authorship Framework - Pre-commit Check")
        
        missing_files, is_compliant = self.check_staged_files()
        
        if is_compliant:
            print("✅ All staged files have proper attribution")
            return 0
        
        print("⚠️  The following files are missing Layered Authorship Framework attribution:")
        for file_path in missing_files:
            print(f"  - {file_path}")
        
        if self.framework_scripts:
            response = input("\nAdd attribution automatically? (y/N): ").lower()
            if response == 'y':
                if self.add_attribution_to_files(missing_files):
                    print("✅ Attribution added successfully")
                    return 0
                else:
                    print("❌ Failed to add attribution")
                    return 1
        
        print("❌ Commit aborted. Please add attribution manually.")
        if self.framework_scripts:
            print(f"   Use: {self.framework_scripts[0]}")
        
        return 1

def main():
    """Main entry point for pre-commit hook."""
    checker = AuthorshipFrameworkChecker()
    return checker.run_check()

if __name__ == '__main__':
    sys.exit(main())
