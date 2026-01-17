#!/usr/bin/env python3
"""
Auto-generates index.html from project folders.
Each project folder should have a metadata.json with name and description.
Run: python3 build-index.py
"""

import os
import json
from pathlib import Path

ROOT = Path(__file__).parent
IGNORE_DIRS = {'.git', 'node_modules', '__pycache__', 'assets', 'shared-assets'}

def get_projects():
    """Find all project directories with an index.html"""
    projects = []
    
    for item in ROOT.iterdir():
        if item.is_dir() and item.name not in IGNORE_DIRS and not item.name.startswith('.'):
            index_file = item / 'index.html'
            if index_file.exists():
                metadata_file = item / 'metadata.json'
                
                # Default metadata
                metadata = {
                    'name': item.name,
                    'shortName': item.name.upper().replace('-', ' '),
                    'description': 'Prototype project'
                }
                
                # Load metadata if exists
                if metadata_file.exists():
                    try:
                        with open(metadata_file, 'r') as f:
                            loaded = json.load(f)
                            metadata.update(loaded)
                            # Generate shortName from name if not provided
                            if 'shortName' not in loaded and 'name' in loaded:
                                metadata['shortName'] = loaded['name'].upper()
                    except json.JSONDecodeError:
                        pass
                
                metadata['folder'] = item.name
                projects.append(metadata)
    
    # Sort by name (newest first if using date prefixes, otherwise alphabetical)
    projects.sort(key=lambda p: p['name'], reverse=True)
    return projects

def generate_index(projects):
    """Generate the index.html content"""
    
    if projects:
        projects_html = '\n'.join([
            f'''      <a href="{p['folder']}/" class="project">
        <span class="project-number">{str(i+1).zfill(2)}</span>
        <div class="project-info">
          <span class="project-name">{p['shortName']}</span>
          <span class="project-desc">{p['description']}</span>
        </div>
        <span class="project-arrow"><svg viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </a>'''
            for i, p in enumerate(projects)
        ])
    else:
        projects_html = '      <div class="empty">No projects yet</div>'
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prototypes</title>
  <style>
    :root {{
      --text-primary: #2e3438;
      --text-secondary: #585d60;
      --text-subtle: #787c7f;
      --text-muted: #9fa3a8;
      --background: #f8fafb;
      --background-card: #ffffff;
      --border: #e2e5e9;
    }}

    *, *::before, *::after {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
      background: var(--background);
      color: var(--text-primary);
      min-height: 100vh;
      padding: 48px 24px;
      line-height: 1.5;
    }}

    .container {{
      max-width: 560px;
      margin: 0 auto;
    }}

    header {{
      margin-bottom: 48px;
    }}

    h1 {{
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .description {{
      font-size: 12px;
      color: var(--text-subtle);
      line-height: 1.6;
    }}

    .projects {{
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
    }}

    .project {{
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--background-card);
      text-decoration: none;
      transition: background 0.15s ease;
    }}

    .project:hover {{
      background: var(--background);
    }}

    .project-number {{
      flex-shrink: 0;
      width: 24px;
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
    }}

    .project-info {{
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }}

    .project-name {{
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }}

    .project-desc {{
      font-size: 11px;
      color: var(--text-subtle);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}

    .project-arrow {{
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      transition: transform 0.15s ease, color 0.15s ease;
    }}

    .project-arrow svg {{
      width: 16px;
      height: 16px;
    }}

    .project:hover .project-arrow {{
      transform: translateX(2px);
      color: var(--text-secondary);
    }}

    .empty {{
      padding: 32px 20px;
      background: var(--background-card);
      text-align: center;
      font-size: 12px;
      color: var(--text-subtle);
    }}

    footer {{
      margin-top: 48px;
      text-align: center;
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .logo {{
      display: block;
      margin: 0 auto 12px;
    }}

    .logo svg {{
      height: 40px;
      width: auto;
    }}

    .footer-text {{
      display: block;
    }}
  </style>
</head>
<body>
  <!-- Local environment indicator -->
  <div id="local-indicator" style="display: none; position: fixed; top: 10px; left: 10px; width: 8px; height: 8px; background: #fe9446; border-radius: 50%; z-index: 9999;"></div>
  <script>if(location.hostname==='localhost'||location.hostname==='127.0.0.1')document.getElementById('local-indicator').style.display='block';</script>
  
  <div class="container">
    <header>
      <h1>Prototypes</h1>
      <p class="description">Design explorations and UI experiments</p>
    </header>

    <div class="projects" id="projects">
{projects_html}
    </div>

    <footer>
      <a href="https://glue.co" class="logo" target="_blank" rel="noopener noreferrer" aria-label="Glue">
        <svg viewBox="0 0 497 189" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M188 188.618C173 188.618 159.6 185.418 148 178.818L154.2 156.618C163.8 162.018 173.2 165.818 186 165.818C204.2 165.818 213.4 155.818 213.4 144.218V134.418H213C206 141.618 196.2 145.618 184.6 145.618C157.8 145.618 138 126.018 138 97.6175C138 68.8175 157.2 48.2175 183.2 48.2175C194 48.2175 204.6 52.0175 212.6 59.8175H213V49.6175H239.2V136.218C239.2 166.818 225.8 188.618 188 188.618ZM189.4 122.018C203.8 122.018 214 111.418 214 96.6175C214 81.8175 203.4 71.8175 189.4 71.8175C174.8 71.8175 164.6 82.0175 164.6 96.8175C164.6 112.218 175.4 122.018 189.4 122.018Z" fill="#eaecef"/>
          <path d="M255.312 147.418V0.217529H281.512V147.418H255.312Z" fill="#eaecef"/>
          <path d="M333 149.218C311.8 149.218 297 138.418 297 108.618V49.6175H323V101.818C323 119.618 328.4 125.618 340.6 125.618C352 125.618 362.2 116.018 362.2 97.2175V49.6175H388.6V147.418H362.2V135.818L361.8 135.618C354.4 144.618 344 149.218 333 149.218Z" fill="#eaecef"/>
          <path d="M496.839 97.6175C496.839 100.818 496.439 105.418 496.239 107.018H427.639C430.839 118.818 440.239 125.818 453.439 125.818C464.439 125.818 472.039 121.218 477.239 114.818L494.239 130.618C486.039 141.218 473.439 149.218 451.639 149.218C421.639 149.218 400.439 129.018 400.439 98.4175C400.439 68.6175 421.039 48.2175 450.039 48.2175C477.639 48.2175 496.839 69.0175 496.839 97.6175ZM449.839 71.0175C439.239 71.0175 430.839 77.0175 427.839 88.2175H470.839C468.239 77.8175 461.239 71.0175 449.839 71.0175Z" fill="#eaecef"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M57 150C88.4802 150 114 123.559 114 93.0377C114 72.2918 102.893 59.0133 88.7866 42.1489C79.588 31.1517 69.1139 18.6298 59.6124 1.5182C58.4884 -0.506066 55.5116 -0.506066 54.3876 1.5182C44.8861 18.6298 34.412 31.1517 25.2134 42.1489C11.1069 59.0133 0 72.2918 0 93.0377C0 123.559 25.5198 150 57 150ZM88.5942 104.922C91.6266 104.174 94.5793 106.83 93.2753 109.667C86.9679 123.385 73.0971 132.911 57 132.911C34.9638 132.911 17.1 115.059 17.1 93.0377C17.1 84.6537 19.6893 76.8741 24.1123 70.4538C25.885 67.8808 29.6858 69.0574 30.5971 72.0456C36.6489 91.8908 55.1122 106.329 76.95 106.329C80.9641 106.329 84.8642 105.841 88.5942 104.922Z" fill="#eaecef"/>
        </svg>
      </a>
      <span class="footer-text">pb-local-projects</span>
    </footer>
  </div>
</body>
</html>
'''

def main():
    projects = get_projects()
    print(f"Found {len(projects)} project(s):")
    for p in projects:
        print(f"  - {p['name']}: {p['description']}")
    
    index_content = generate_index(projects)
    
    index_path = ROOT / 'index.html'
    with open(index_path, 'w') as f:
        f.write(index_content)
    
    print(f"\n✓ Generated index.html with {len(projects)} project(s)")

if __name__ == '__main__':
    main()
