using System.IO.Compression;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class ImageConverterService : IImageConverter
{
    private  string UPLOAD_Fils_PATH = $"{Directory.GetCurrentDirectory()}/uploads";

    private readonly ImageConverterFactory _factory;

    public ImageConverterService(ImageConverterFactory factory)
    {
        _factory = factory;
    }
    public async Task<string> Convert(string id ,IList<string> files, ImageType sourceImageType  , ImageType resultImageType )
    {
        var convertedFiles = await _factory.GetStragetype(resultImageType).Convert(files , sourceImageType);
        var zipPath = Path.Combine(UPLOAD_Fils_PATH , $"{id}.zip");

        using (ZipArchive archive = ZipFile.Open(zipPath, ZipArchiveMode.Update))
        {
            foreach (var file in convertedFiles)
                archive.CreateEntryFromFile(file, file.Split("/").Last());
        }

        return zipPath;
    }
}