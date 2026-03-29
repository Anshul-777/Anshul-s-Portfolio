import re
import json

def parse_projects(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into project cards
    cards = content.split('<div class="project-card"')
    projects = []

    for card in cards[1:]: # Skip the first part
        # Extract ID
        id_match = re.search(r'id="project-(\d+)"', card)
        if not id_match: continue
        id_val = id_match.group(1)

        # Extract Project Number
        num_match = re.search(r'<span class="proj-num">#(.*?)</span>', card)
        num = num_match.group(1) if num_match else id_val

        # Extract Rank
        rank_match = re.search(r'<span class="rank-tag">Rank: (.*?)</span>', card)
        rank = rank_match.group(1) if rank_match else f"{id_val} of 75"

        # Extract Difficulty
        diff_match = re.search(r'<span class="diff-badge".*?>(.*?)</span>', card)
        difficulty = diff_match.group(1) if diff_match else "MEDIUM"

        # Extract Domain/Category
        domain_match = re.search(r'<span class="domain-tag".*?>(.*?)</span>', card)
        domain = domain_match.group(1) if domain_match else "AI"

        # Extract Title
        title_match = re.search(r'<h2 class="proj-title".*?>(.*?)</h2>', card, re.DOTALL)
        title = title_match.group(1).strip() if title_match else "Untitled Project"
        # Remove anything after ':' if it's too long for the slug
        short_title = title.split(':')[0].strip()

        # Extract Core Idea
        idea_match = re.search(r'<p class="proj-idea">.*?<span class="label">Core Idea:</span>(.*?)</p>', card, re.DOTALL)
        description = idea_match.group(1).strip() if idea_match else ""

        # Extract Problem Statement
        problem_match = re.search(r'<div class="section-label">🔴 Problem Statement</div>(.*?)</div>\s*</div>', card, re.DOTALL)
        problem = problem_match.group(1).strip() if problem_match else ""

        # Extract Idea & Solution Concept
        concept_match = re.search(r'<div class="section-label">💡 Idea & Solution Concept</div>(.*?)</div>\s*</div>', card, re.DOTALL)
        concept = concept_match.group(1).strip() if concept_match else ""

        # Extract Architecture
        arch_match = re.search(r'<div class="section-label">⚙️ Core Technical Architecture & Working</div>(.*?)</div>\s*</div>', card, re.DOTALL)
        architecture = arch_match.group(1).strip() if arch_match else ""

        # Create slug
        slug = short_title.lower().replace(' ', '-').replace('&', 'and').replace(',', '').replace('(', '').replace(')', '').replace('--', '-')
        
        # Clean HTML tags for the first few fields
        def clean_tags(text):
            return re.sub(r'<[^>]+>', '', text).strip()

        projects.append({
            "id": id_val,
            "title": short_title,
            "fullTitle": title,
            "category": domain.lower().replace(' ', '-'),
            "year": "2024",
            "slug": slug,
            "rank": rank,
            "difficulty": difficulty,
            "description": clean_tags(description),
            "detailedDescription": {
                "problem": problem,
                "solution": concept,
                "architecture": architecture
            }
        })

    return projects

all_projects = parse_projects('c:/Users/anshu/OneDrive/Desktop/Portflio/src/pages/projects/Project.html')
with open('c:/Users/anshu/OneDrive/Desktop/Portflio/all_projects_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(all_projects, f, indent=2)

print(f"Successfully parsed {len(all_projects)} projects.")
