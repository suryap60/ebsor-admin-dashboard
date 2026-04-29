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

const replacements = [
    [/\bbg-black\b/g, 'bg-[#f8f9fa] dark:bg-black'],
    [/\bbg-zinc-950\/80\b/g, 'bg-white/80 dark:bg-zinc-950/80'],
    [/\bbg-zinc-950\b/g, 'bg-white dark:bg-zinc-950'],
    [/\bbg-zinc-900\/50\b/g, 'bg-zinc-50 dark:bg-zinc-900/50'],
    [/\bbg-zinc-900\/30\b/g, 'bg-zinc-50 dark:bg-zinc-900/30'],
    [/\bbg-zinc-900\b/g, 'bg-zinc-50 dark:bg-zinc-900'],
    [/\bbg-zinc-800\/50\b/g, 'bg-zinc-100 dark:bg-zinc-800/50'],
    [/\bbg-zinc-800\b/g, 'bg-zinc-200 dark:bg-zinc-800'],
    [/\bborder-zinc-800\/50\b/g, 'border-zinc-200 dark:border-zinc-800/50'],
    [/\bborder-zinc-800\b/g, 'border-zinc-200 dark:border-zinc-800'],
    [/\bborder-zinc-900\b/g, 'border-zinc-100 dark:border-zinc-900'],
    [/\bborder-zinc-700\b/g, 'border-zinc-300 dark:border-zinc-700'],
    [/\btext-white\b/g, 'text-zinc-950 dark:text-white'],
    [/\btext-zinc-400\b/g, 'text-zinc-600 dark:text-zinc-400'],
    [/\btext-zinc-300\b/g, 'text-zinc-700 dark:text-zinc-300'],
    [/\btext-zinc-200\b/g, 'text-zinc-800 dark:text-zinc-200'],
    [/\bplaceholder-zinc-500\b/g, 'placeholder-zinc-400 dark:placeholder-zinc-500']
];

for (const filePath of filesToProcess) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        for (const [regex, replacement] of replacements) {
            content = content.replace(regex, replacement);
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Processed ${filePath}`);
    } else {
        console.log(`Not found: ${filePath}`);
    }
}
