#!/usr/bin/env python3
"""
Code Execution Sandbox - Setup Script
Install dependencies and set up the development environment.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Command: {command}")
        print(f"   Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_requirements(requirements_file):
    """Install requirements from a specific file."""
    if not Path(requirements_file).exists():
        print(f"⚠️  {requirements_file} not found, skipping...")
        return True
    
    return run_command(f"pip install -r {requirements_file}", f"Installing {requirements_file}")

def main():
    """Main setup function."""
    print("🚀 Setting up Code Execution Sandbox...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Upgrade pip
    run_command("python -m pip install --upgrade pip", "Upgrading pip")
    
    # Install base requirements
    if not install_requirements("requirements.txt"):
        print("❌ Failed to install base requirements")
        sys.exit(1)
    
    # Ask user if they want development dependencies
    print("\n📚 Development Dependencies")
    print("These include testing tools, code formatters, and development utilities.")
    
    try:
        response = input("Install development dependencies? (y/N): ").strip().lower()
        if response in ['y', 'yes']:
            install_requirements("requirements-dev.txt")
        else:
            print("⏭️  Skipping development dependencies")
    except KeyboardInterrupt:
        print("\n⏭️  Setup interrupted")
        sys.exit(1)
    
    # Check Docker
    print("\n🐳 Checking Docker...")
    if run_command("docker --version", "Docker version check"):
        print("✅ Docker is available")
    else:
        print("⚠️  Docker not found or not accessible")
        print("   Make sure Docker is installed and running")
        print("   The code execution sandbox requires Docker to run")
    
    print("\n🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Start the backend: npm start")
    print("2. Start the frontend: cd client && npm start")
    print("3. Open http://localhost:3000 in your browser")
    print("\nFor more information, see README.md")

if __name__ == "__main__":
    main()
