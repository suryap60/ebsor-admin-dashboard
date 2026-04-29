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

// Replaces any instances of the broken dark:bg chains
for (const filePath of filesToProcess) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Let's just fix the worst offenders with straightforward replace()
        const badString1 = "hover:bg-zinc-200 dark:bg-zinc-100 dark:bg-zinc-200 dark:bg-zinc-800/50";
        const goodString1 = "hover:bg-zinc-200 dark:hover:bg-zinc-800/50";
        
        content = content.replace(new RegExp(badString1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), goodString1);
        
        const badString2 = "hover:bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800";
        const goodString2 = "hover:bg-zinc-200 dark:hover:bg-zinc-800";
        
        content = content.replace(new RegExp(badString2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), goodString2);
        
        const badString3 = "dark:text-zinc-700 dark:text-zinc-700 dark:text-zinc-300";
        const goodString3 = "dark:text-zinc-300";
        
        content = content.replace(new RegExp(badString3.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), goodString3);
        
        const badString4 = "dark:text-zinc-500 dark:text-zinc-500";
        const goodString4 = "dark:text-zinc-500";
        
        content = content.replace(new RegExp(badString4.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), goodString4);
        
        const badString5 = "dark:bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800";
        const goodString5 = "dark:bg-zinc-800";
        
        content = content.replace(new RegExp(badString5.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), goodString5);

        const badString6 = "hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:hover:bg-zinc-800/50";
        const goodString6 = "hover:bg-zinc-200 dark:hover:bg-zinc-800/50";
        content = content.replace(new RegExp(badString6.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), goodString6);

        // Broad cleanup logic: 'dark:bg-zinc-X dark:bg-zinc-Y dark:bg-zinc-Z' => 'dark:bg-zinc-Z'
        // But specifically for hover:bg, we need dark:hover:bg
        // The issue is that the user says row hover makes background white.
        // If a row has "hover:bg-zinc-100 dark:hover:bg-zinc-900/30", the `dark:hover:` modifier must work.

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Deep cleaned ${filePath}`);
    }
}
