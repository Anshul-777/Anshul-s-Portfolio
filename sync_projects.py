import json

with open('c:/Users/anshu/OneDrive/Desktop/Portflio/all_projects_metadata.json', 'r', encoding='utf-8') as f:
    all_75 = json.load(f)

# Existing 8 slugs:
SPECIAL_SLUGS = [
    'aegispay-fraud-detection',
    'neuro-vx-cognitive-health',
    'churn-prediction',
    'visionguard-cctv',
    'poly-agent',
    'sky-analyst',
    'esg-lens',
    'voice-guard'
]

# We want projects that are NOT in the special list.
additional_projects = []
for p in all_75:
    # Handle slugs
    orig_slug = p['slug']
    slug = orig_slug
    if orig_slug == 'polyagent': slug = 'poly-agent'
    elif orig_slug == 'skyanalyst': slug = 'sky-analyst'
    elif orig_slug == 'esglens': slug = 'esg-lens'
    elif orig_slug == 'voiceguard': slug = 'voice-guard'
    elif orig_slug == 'churnpredictor': slug = 'churn-prediction'
    
    if slug not in SPECIAL_SLUGS:
        p['slug'] = slug
        additional_projects.append(p)

# Create the final text
output_path = 'c:/Users/anshu/OneDrive/Desktop/Portflio/src/data/projects.ts'

# Read the OLD projects.ts to keep the 8 projects
with open(output_path, 'r', encoding='utf-8') as f:
    old_content = f.read()

# I'll find where the 'projects: Project[] = [' starts and ends for the first 8
# More robust: use the last special slug's end.
# Actually, I'll just write it with a big multi_replace later if needed.
# But for now, I'll just generate the list of additional projects as a string.

additional_str = ""
for p in additional_projects:
    p_json = json.dumps(p, indent=2)
    # Indent it
    additional_str += '\n'.join('  ' + line for line in p_json.splitlines()) + ',\n'

# Find the end of the existing list (before the '];')
# The existing file ends with '];' at line 166.
split_point = old_content.rfind('];')

new_content = old_content[:split_point] + additional_str + old_content[split_point:]

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Added {len(additional_projects)} new projects to projects.ts.")
