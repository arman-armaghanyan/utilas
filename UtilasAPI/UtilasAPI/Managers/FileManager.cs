using System.IO.Compression;

namespace System.IO;

public class FileManager
{
    private readonly string UPLOAD_Fils_PATH = $"{Directory.GetCurrentDirectory()}/uploads";

    public FileManager()
    {
        if (!Directory.Exists(UPLOAD_Fils_PATH))
        {
            Directory.CreateDirectory(UPLOAD_Fils_PATH);
        }
    }

    public IList<string> GetFilesByID(string sessionId)
    {
        var uploadPath = Directory.CreateDirectory( Path.Combine(UPLOAD_Fils_PATH , sessionId));
        return Directory.GetFiles(uploadPath.FullName).ToList();
    }

    public string ZipFile(string sessionId, IList<string> files)
    {
        var zipPath = Path.Combine(UPLOAD_Fils_PATH , $"{sessionId}.zip");
        using (ZipArchive archive = Compression.ZipFile.Open(zipPath, ZipArchiveMode.Update))
        {
            foreach (var file in files)
                archive.CreateEntryFromFile(file, file.Split("/").Last());
        }
        return zipPath;
    }
    
    public async Task  UploadFiles(IEnumerable<IFormFile> files ,string uploadPath)
    {
        var path = Directory.CreateDirectory( Path.Combine(UPLOAD_Fils_PATH , uploadPath));
        foreach (var file in files)
        {
            string fullPath = $"{path}/{file.FileName}";
            using (var fileStream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
        }
    }

    public string GetZipFile(string sessionDtoSessionId)
    {
        var path = Path.Combine(UPLOAD_Fils_PATH , $"{sessionDtoSessionId}.zip");
        return File.Exists(path)? path : string.Empty;
    }
}