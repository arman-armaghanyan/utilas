const {promises: fs} = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");


function getZipFileEntryByBuffer(buffer) {
    const zip = new AdmZip(buffer);
    return  zip.getEntries();
}
async function getZipFileEntryByPath(path, requestedPath = "index.html"){
    let zipFile = await readZipFile(path);
    if (zipFile === undefined) {
        return {};
    }

    let entries = await getEntriesAsync(zipFile);
    if (entries === undefined) {
        return {};
    }

    let normalizedEntries = getNormalizedEntries(entries)
    console.log(`[React App] Normalized entries (first 5):`, normalizedEntries.slice(0, 5).map(e => e.name));
    console.log(`[React App] Looking for file: ${requestedPath}`);

    const fileEntry = findEntryFile(normalizedEntries, requestedPath);
    if (fileEntry === undefined) {
        return {};
    }
    return fileEntry;
}

function findEntryFile(normalizedEntries,normalizedPath ) {
    let fileEntry = normalizedEntries.find(
        ({ name }) => name === normalizedPath
    )?.entry;

    // If not found, try as directory with index.html
    if (!fileEntry && !normalizedPath.includes(".")) {
        fileEntry = normalizedEntries.find(
            ({ name }) => name === `${normalizedPath}/index.html` || name === `${normalizedPath}index.html`
        )?.entry;
    }

    // If still not found and path is empty or looks like a route, serve index.html (React Router support)
    if (!fileEntry && (normalizedPath === "index.html" || !normalizedPath.includes("."))) {
        fileEntry = normalizedEntries.find(
            ({ name }) => name === "index.html" || name.endsWith("/index.html")
        )?.entry;
    }

    if (!fileEntry || fileEntry.isDirectory) {
        console.error(`File not found: ${normalizedPath}. Available entries:`, normalizedEntries.map(e => e.name).slice(0, 10));
        return undefined;
    }
    return fileEntry;
}

async function storeZipFileOnDiskAsync( toolId,buffer,bufferLength){
    const storageDir = path.join(__dirname, "..", "..", "storage", "react-apps");
    await fs.mkdir(storageDir, { recursive: true });

    const zipFileName = `${toolId}-${Date.now()}.zip`;
    const zipFilePath = path.join(storageDir, zipFileName);

    console.log(`[Upload] Saving zip file to: ${zipFilePath}`);
    console.log(`[Upload] Buffer size: ${bufferLength} bytes`);

    await fs.writeFile(zipFilePath, buffer);
    return zipFilePath;
}
function getNormalizedEntries(entries){
    return entries
        .filter(entry => !entry.isDirectory
            && !entry.entryName.includes('__MACOSX')
            && !entry.entryName.includes('.DS_Store'))
        .map(entry => {
            let name = entry.entryName.replace(/\\/g, "/");
            // Strip common folder prefixes (dist/, build/, etc.)
            if (name.startsWith("dist/")) {
                name = name.substring(5); // Remove "dist/" prefix
            } else if (name.startsWith("build/")) {
                name = name.substring(6); // Remove "build/" prefix
            }
            return { entry, name };
        });
}

async function deletZilpFileAsync(path){
    await fs.unlink(path)
}
async function getEntriesAsync(zipFile) {
    let zip;
    try {
        zip = new AdmZip(zipFile);
    } catch (error) {
        console.error(`[React App] Error creating zip from buffer:`, error);
        return undefined;
    }

    const entries = zip.getEntries();
    console.log(`[React App] Zip has ${entries.length} entries`);
    if (entries.length > 0) {
        console.log(`[React App] First few entries:`, entries.slice(0, 5).map(e => e.entryName));
    }
    return entries;
}

async function readZipFile(path){
    try {
        let zipBuffer;
        zipBuffer = await fs.readFile(path);
        return zipBuffer;
    }
    catch (error) {
        console.error(`[React App] Error reading zip file from disk:`, error);
        console.error(`[React App] File path: ${path}`);
        return undefined;
    }


}


module.exports = {deletZilpFileAsync,getZipFileEntryByBuffer ,getZipFileEntryByPath , storeZipFileOnDiskAsync}
