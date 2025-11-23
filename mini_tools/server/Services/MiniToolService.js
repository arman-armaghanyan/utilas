const mimeTypes = {
    html: "text/html",
    htm: "text/html",
    js: "application/javascript",
    mjs: "application/javascript",
    json: "application/json",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
    map: "application/json",
};

function getMiniToolContent(fileEntry, basePath = "") {
    let fileContent;
    try {
        fileContent = fileEntry.getData();
    } catch (error) {
        console.error(`[React App] Error reading file ${fileEntry.entryName}:`, error);
        return {};
    }
    
    // If it's an HTML file and we have a basePath, rewrite absolute paths
    if (basePath && (fileEntry.entryName.endsWith('.html') || fileEntry.entryName.endsWith('.htm'))) {
        try {
            const htmlString = fileContent.toString('utf8');
            // Remove trailing slash from basePath for cleaner URLs
            const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
            
            // Rewrite absolute paths in script src, link href attributes
            // Match patterns like: src="/assets/...", href="/assets/...", etc.
            // Only rewrite paths that look like asset paths (contain /assets/, /static/, etc.)
            const rewrittenHtml = htmlString.replace(
                /(src|href)=["'](\/[^"']+)["']/g,
                (match, attr, path) => {
                    // Only rewrite if it's an absolute path (starts with /)
                    // and not already pointing to the basePath
                    // Skip root path "/" and paths that are already correct
                    if (path === '/') {
                        return match; // Don't rewrite root path
                    }
                    if (path.startsWith('/') && !path.startsWith(cleanBasePath)) {
                        // Ensure path starts with / after basePath
                        const newPath = path.startsWith('/') ? `${cleanBasePath}${path}` : `${cleanBasePath}/${path}`;
                        return `${attr}="${newPath}"`;
                    }
                    return match;
                }
            );
            
            return Buffer.from(rewrittenHtml, 'utf8');
        } catch (error) {
            console.error(`[React App] Error rewriting HTML paths:`, error);
            // Return original content if rewriting fails
            return fileContent;
        }
    }
    
    return fileContent;
}

function getMiniToolMimeType(fileEntry) {
    const fileName = fileEntry.entryName;
    const ext = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";

    return mimeTypes[ext] || "application/octet-stream"
}



module.exports = {getMiniToolMimeType: getMiniToolMimeType , getMiniToolContent };