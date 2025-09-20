#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import re
import argparse
from jinja2 import Environment, FileSystemLoader, select_autoescape

def format_for_ats(text):
    """Clean text for ATS systems"""
    if not text:
        return ""
    if not isinstance(text, str):
        text = str(text)
    
    # Remove special characters that might confuse ATS but keep essential punctuation
    text = re.sub(r'[^\w\s\.\,\-\+\@\(\)\:\;]', ' ', text)
    
    # Standardize common terms
    replacements = {
        '&': ' and ',
        '/': ' or ',
        '++': ' Plus Plus ',
        '#': ' Number ',
        '%': ' Percent ',
        '  ': ' '  # Remove double spaces
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text.strip()

def latex_escape(s):
    if s is None:
        return ""
    if not isinstance(s, str):
        s = str(s)
    
    # First format for ATS
    s = format_for_ats(s)
    
    # Then escape LaTeX characters
    repl = {
        '\\': r'\textbackslash{}',
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '<': r'\textless{}',
        '>': r'\textgreater{}'
    }
    for k, v in repl.items():
        s = s.replace(k, v)
    return s

def load_config():
    """Load configuration from file or use defaults"""
    default_config = {
        "compile_runs": 2,
        "latex_engine": "pdflatex",
        "open_pdf": True,
        "cleanup_temp_files": True,
        "timeout": 30  # seconds for LaTeX compilation
    }
    
    config_file = "config.json"
    if os.path.exists(config_file):
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                user_config = json.load(f)
            return {**default_config, **user_config}
        except json.JSONDecodeError:
            print(f"Warning: Invalid JSON in {config_file}, using defaults")
            return default_config
    return default_config

def validate_json_data(data):
    """Basic validation of JSON data structure"""
    required_fields = ['name', 'email']
    recommended_fields = ['skills', 'experience', 'education']
    
    missing_required = [field for field in required_fields if field not in data]
    if missing_required:
        print(f"Warning: Missing required fields: {missing_required}")
    
    missing_recommended = [field for field in recommended_fields if field not in data]
    if missing_recommended:
        print(f"Info: Consider adding: {missing_recommended}")
    
    return len(missing_required) == 0

def cleanup_temp_files(tex_path, extensions=[".aux", ".log", ".out", ".toc", ".synctex.gz"]):
    """Clean up temporary LaTeX files"""
    base_name = os.path.splitext(tex_path)[0]
    removed_files = []
    
    for ext in extensions:
        temp_file = base_name + ext
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
                removed_files.append(temp_file)
            except OSError as e:
                print(f"Warning: Could not remove {temp_file}: {e}")
    
    if removed_files:
        print(f"Cleaned up temporary files: {', '.join(removed_files)}")

def compile_latex(tex_path, engine="pdflatex", runs=2, timeout=30):
    """Compile LaTeX document with specified engine"""
    engines = {
        "pdflatex": ["pdflatex", "-interaction=nonstopmode", "-halt-on-error"],
        "xelatex": ["xelatex", "-interaction=nonstopmode", "-halt-on-error"],
        "lualatex": ["lualatex", "-interaction=nonstopmode", "-halt-on-error"]
    }
    
    if engine not in engines:
        raise ValueError(f"Unsupported LaTeX engine: {engine}. Choose from {list(engines.keys())}")
    
    tex_dir = os.path.dirname(tex_path) or "."
    tex_name = os.path.basename(tex_path)
    
    for i in range(runs):
        print(f"Running {engine} ({i+1}/{runs})...")
        try:
            result = subprocess.run(
                engines[engine] + [tex_name],
                cwd=tex_dir,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=timeout
            )
            if result.stderr:
                print(f"LaTeX warnings: {result.stderr.decode('utf-8', errors='ignore')[:200]}...")
        except subprocess.TimeoutExpired:
            print(f"Error: {engine} compilation timed out after {timeout} seconds")
            return False
        except subprocess.CalledProcessError as e:
            print(f"Error: {engine} compilation failed")
            print(f"Error output: {e.stderr.decode('utf-8', errors='ignore')[:500]}")
            return False
    
    return True

def open_pdf(pdf_path):
    """Open PDF file using platform-specific command"""
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return False
    
    try:
        if sys.platform.startswith("win"):
            os.startfile(pdf_path)
        elif sys.platform == "darwin":
            subprocess.run(["open", pdf_path], check=True)
        else:
            subprocess.run(["xdg-open", pdf_path], check=True)
        print(f"Opened PDF: {pdf_path}")
        return True
    except Exception as e:
        print(f"Warning: Could not open PDF: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Generate PDF resume from JSON + LaTeX template.")
    parser.add_argument("json_file", nargs="?", default="resume.json", 
                       help="Input JSON file with resume data")
    parser.add_argument("-t", "--template", default="template.tex",
                       help="LaTeX template file")
    parser.add_argument("-o", "--output", default="resume.pdf",
                       help="Output PDF file name")
    parser.add_argument("-e", "--engine", choices=["pdflatex", "xelatex", "lualatex"], 
                       default="pdflatex", help="LaTeX engine to use")
    parser.add_argument("--no-open", action="store_true", 
                       help="Don't open PDF after generation")
    parser.add_argument("--no-cleanup", action="store_true",
                       help="Don't clean up temporary files")
    parser.add_argument("--runs", type=int, default=2,
                       help="Number of LaTeX compilation runs")
    parser.add_argument("--timeout", type=int, default=30,
                       help="Timeout for LaTeX compilation in seconds")
    
    args = parser.parse_args()
    config = load_config()
    
    # Use command line args or config defaults
    latex_engine = args.engine or config.get("latex_engine", "pdflatex")
    compile_runs = args.runs or config.get("compile_runs", 2)
    should_open = not args.no_open and config.get("open_pdf", True)
    should_cleanup = not args.no_cleanup and config.get("cleanup_temp_files", True)
    timeout = args.timeout or config.get("timeout", 30)
    
    json_path = os.path.abspath(args.json_file)
    template_path = os.path.abspath(args.template)
    output_pdf = os.path.abspath(args.output)
    output_tex = os.path.splitext(output_pdf)[0] + ".tex"
    
    # Check if files exist
    if not os.path.exists(json_path):
        print(f"Error: JSON file not found: {json_path}")
        sys.exit(1)
    
    if not os.path.exists(template_path):
        print(f"Error: Template file not found: {template_path}")
        sys.exit(1)
    
    # Load JSON data
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"Loaded JSON data from: {json_path}")
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {json_path}: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        sys.exit(1)
    
    # Validate JSON structure
    if not validate_json_data(data):
        print("Warning: JSON data validation failed, but continuing anyway...")
    
    # Setup Jinja2 environment
    tpl_dir = os.path.dirname(template_path) or "."
    env = Environment(
        loader=FileSystemLoader(tpl_dir),
        autoescape=select_autoescape([]),
        trim_blocks=True,
        lstrip_blocks=True
    )
    env.filters['latex_escape'] = latex_escape
    template = env.get_template(os.path.basename(template_path))
    
    # Render LaTeX template
    try:
        rendered = template.render(**data)
        with open(output_tex, "w", encoding="utf-8") as f:
            f.write(rendered)
        print(f"Generated LaTeX file: {output_tex}")
    except Exception as e:
        print(f"Error rendering template: {e}")
        sys.exit(1)
    
    # Compile LaTeX to PDF
    if not compile_latex(output_tex, latex_engine, compile_runs, timeout):
        print("PDF generation failed. Check the LaTeX log for details.")
        sys.exit(1)
    
    # Verify PDF was created
    generated_pdf = os.path.splitext(output_tex)[0] + ".pdf"
    if not os.path.exists(generated_pdf):
        print("Error: PDF file was not generated")
        sys.exit(1)
    
    # Rename if needed
    if os.path.abspath(generated_pdf) != os.path.abspath(output_pdf):
        os.replace(generated_pdf, output_pdf)
    
    print(f"Successfully generated PDF: {output_pdf}")
    
    # Clean up temporary files
    if should_cleanup:
        cleanup_temp_files(output_tex)
    
    # Open PDF
    if should_open:
        open_pdf(output_pdf)

if __name__ == "__main__":
    main()