const fs = require('fs');
const path = require('path');

const filesToProcess = [
    "src/app/admin/page.tsx",
    "src/app/admin/blogs/page.tsx",
    "src/app/admin/blogs/create/page.tsx",
    "src/app/admin/products/page.tsx",
    "src/app/admin/careers/page.tsx",
    "src/app/admin/applications/page.tsx",
    "src/app/admin/contacts/page.tsx",
    "src/app/admin/profile/page.tsx",
    "src/components/layout/AdminSidebar.tsx"
];

const fixes = [
    // Broken hover backgrounds in tables/rows
    [/\bhover:hover:bg-zinc-50 dark:hover:bg-zinc-100 dark:bg-zinc-50 dark:bg-zinc-900\/30\b/g, 'hover:bg-zinc-100 dark:hover:bg-zinc-900/30'],
    [/\bhover:bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800\b/g, 'hover:bg-zinc-200 dark:hover:bg-zinc-800'],
    [/\bg-zinc-950 dark:text-white dark:bg-zinc-900\/30\b/g, 'bg-zinc-950 dark:bg-zinc-900/30'],
    [/\bhover:bg-zinc-100 dark:bg-zinc-900\b/g, 'hover:bg-zinc-100 dark:hover:bg-zinc-900'],
    [/\bhover:bg-zinc-50 dark:bg-zinc-900\/50\b/g, 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'],

    // Buttons
    [/\btext-white dark:text-zinc-950 dark:text-white\b/g, 'text-zinc-50 dark:text-white'],
    [/\btext-zinc-600 dark:text-zinc-600 dark:text-zinc-400\b/g, 'text-zinc-600 dark:text-zinc-400'],
    [/\bg-white dark:bg-zinc-200 dark:bg-zinc-800\b/g, 'bg-white dark:bg-zinc-800'],
    [/\bhHover:border-zinc-300 dark:hover:border-zinc-700\b/g, 'hover:border-zinc-300 dark:hover:border-zinc-700'],
    [/\btext-zinc-500 dark:text-zinc-500\b/g, 'text-zinc-500'],
    [/\btext-zinc-700 dark:text-zinc-700 dark:text-zinc-300\b/g, 'text-zinc-700 dark:text-zinc-300'],
    [/\bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800\b/g, 'bg-zinc-200 dark:bg-zinc-800'],
    [/\bhover:bg-zinc-200 dark:bg-zinc-100 dark:bg-zinc-200 dark:bg-zinc-800\/50\b/g, 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50'],
    [/\bg-zinc-50 dark:bg-zinc-900\/50 border\b/g, 'bg-white table-auto dark:bg-zinc-900/50 border'] // Wait, bg-white was there? Just fix standard
];

for (const filePath of filesToProcess) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        for (const [regex, replacement] of fixes) {
            content = content.replace(regex, replacement);
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned ${filePath}`);
    }
}
