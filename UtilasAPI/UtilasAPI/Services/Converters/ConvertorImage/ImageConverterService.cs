using System.IO.Compression;
using ToolityAPI.Models.Convertors;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class ImageConverterService : IImageConverter
{
    private readonly string UPLOAD_Fils_PATH = $"{Directory.GetCurrentDirectory()}/uploads";

    private readonly ImageConverterFactory _factory;
    private readonly FileManager _fileManager;

    public ImageConverterService(ImageConverterFactory factory , FileManager fileManager)
    {
        _factory = factory;
        _fileManager = fileManager;
    }
    public async Task<string> Convert(string sessionId ,IList<string> files, ImageType sourceImageType  , ImageType resultImageType )
    {
        var convertedFiles = await _factory.GetStragetype(resultImageType).Convert(files , sourceImageType);
        return _fileManager.ZipFile(sessionId , convertedFiles);
    }
}