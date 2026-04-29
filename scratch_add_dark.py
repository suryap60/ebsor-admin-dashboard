import os
import re

files_to_process = [
    "src/app/admin/layout.tsx",
    "src/app/admin/page.tsx",
    "src/app/admin/blogs/page.tsx",
    "src/app/admin/blogs/create/page.tsx",
    "src/app/admin/products/page.tsx",
    "src/app/admin/careers/page.tsx",
    "src/app/admin/applications/page.tsx",
    "src/app/admin/contacts/page.tsx",
    "src/app/admin/profile/page.tsx",
    "src/app/login/page.tsx",
    "src/app/signup/page.tsx",
    "src/components/layout/AdminSidebar.tsx",
    "src/components/layout/AdminHeader.tsx"
]

replacements = {
    r'\bbg-black\b': 'bg-[#f8f9fa] dark:bg-black',
    r'\bbg-zinc-950/80\b': 'bg-white/80 dark:bg-zinc-950/80',
    r'\bbg-zinc-950\b': 'bg-white dark:bg-zinc-950',
    r'\bbg-zinc-900/50\b': 'bg-zinc-50 dark:bg-zinc-900/50',
    r'\bbg-zinc-900/30\b': 'bg-zinc-50 dark:bg-zinc-900/30',
    r'\bbg-zinc-900\b': 'bg-zinc-50 dark:bg-zinc-900',
    r'\bbg-zinc-800/50\b': 'bg-zinc-100 dark:bg-zinc-800/50',
    r'\bbg-zinc-800\b': 'bg-zinc-200 dark:bg-zinc-800',
    r'\bborder-zinc-800/50\b': 'border-zinc-200 dark:border-zinc-800/50',
    r'\bborder-zinc-800\b': 'border-zinc-200 dark:border-zinc-800',
    r'\bborder-zinc-900\b': 'border-zinc-100 dark:border-zinc-900',
    r'\bborder-zinc-700\b': 'border-zinc-300 dark:border-zinc-700',
    r'\btext-white\b': 'text-zinc-950 dark:text-white',
    r'\btext-zinc-400\b': 'text-zinc-600 dark:text-zinc-400',
    r'\btext-zinc-300\b': 'text-zinc-700 dark:text-zinc-300',
    r'\btext-zinc-200\b': 'text-zinc-800 dark:text-zinc-200',
    r'\bplaceholder-zinc-500\b': 'placeholder-zinc-400 dark:placeholder-zinc-500'
}

for file_path in files_to_process:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for p, r_str in replacements.items():
            content = re.sub(p, r_str, content)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {file_path}")
    else:
        print(f"Not found: {file_path}")
