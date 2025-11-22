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
    return fileContent;
}

function getMiniToolMimeType(fileEntry) {
    const fileName = fileEntry.entryName;
    const ext = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";

    return mimeTypes[ext] || "application/octet-stream"
}



module.exports = {getMiniToolMimeType: getMiniToolMimeType , getMiniToolContent };