const fs = require('fs');
const path = require('path');

const filesToProcess = [
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
];

const fixes = [
    // Backgrounds
    [/\bbg-white dark:bg-white dark:bg-zinc-950\b/g, 'bg-white dark:bg-zinc-950'],
    [/\bbg-zinc-100 dark:bg-zinc-50 dark:bg-zinc-900\b/g, 'bg-zinc-100 dark:bg-zinc-900'],
    [/\bbg-zinc-50 dark:bg-zinc-50 dark:bg-zinc-900\b/g, 'bg-zinc-50 dark:bg-zinc-900'],
    [/\bbg-zinc-50 dark:bg-zinc-50 dark:bg-zinc-50 dark:bg-zinc-900\/50\b/g, 'bg-zinc-50 dark:bg-zinc-900/50'],
    [/\bbg-white\/80 dark:bg-white dark:bg-zinc-950\/80\b/g, 'bg-white/80 dark:bg-zinc-950/80'],
    [/\bbg-zinc-200 dark:bg-zinc-100 dark:bg-zinc-800\b/g, 'bg-zinc-100 dark:bg-zinc-800'],
    
    // Borders
    [/\bborder-zinc-200 dark:border-zinc-200 dark:border-zinc-800\b/g, 'border-zinc-200 dark:border-zinc-800'],
    [/\bhHover:border-zinc-300 dark:border-zinc-300 dark:border-zinc-700\b/g, 'hover:border-zinc-300 dark:hover:border-zinc-700'],
    [/\bhover:border-zinc-200 dark:border-zinc-200 dark:border-zinc-800\b/g, 'hover:border-zinc-200 dark:hover:border-zinc-800'],
    [/\bborder-zinc-300 dark:border-zinc-300 dark:border-zinc-700\b/g, 'border-zinc-300 dark:border-zinc-700'],
    
    // Texts
    [/\btext-zinc-900 dark:text-zinc-950 dark:text-white\b/g, 'text-zinc-950 dark:text-white'],
    [/\btext-zinc-600 dark:text-zinc-600 dark:text-zinc-400\b/g, 'text-zinc-600 dark:text-zinc-400'],
    [/\btext-zinc-800 dark:text-zinc-800 dark:text-zinc-200\b/g, 'text-zinc-800 dark:text-zinc-200'],
    
    // Extra cleans
    [/\bhHover:border-zinc-300 dark:hover:border-zinc-700\b/g, 'hover:border-zinc-300 dark:hover:border-zinc-700'],
    [/\bhover:border-zinc-300 dark:border-zinc-300 dark:border-zinc-700\b/g, 'hover:border-zinc-300 dark:hover:border-zinc-700']
];

for (const filePath of filesToProcess) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        for (const [regex, replacement] of fixes) {
            content = content.replace(regex, replacement);
        }
        
        // General cleanup for duplicates
        content = content.replace(/dark:text-zinc-500 dark:text-zinc-500/g, 'dark:text-zinc-500');
        content = content.replace(/bg-zinc-50 dark:bg-zinc-50 dark:bg-zinc-900\/50/g, 'bg-zinc-50 dark:bg-zinc-900/50');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed ${filePath}`);
    }
}
