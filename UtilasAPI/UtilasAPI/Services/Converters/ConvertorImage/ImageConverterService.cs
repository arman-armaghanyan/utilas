using ToolityAPI.Models.ImageProcessing;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class ImageConverterService : IImageConverter , IDisposable
{
    private  ImageConverterFactory _factory;
    private  FileManager _fileManager;

    public ImageConverterService(ImageConverterFactory factory , FileManager fileManager)
    {
        _factory = factory;
        _fileManager = fileManager;
    }
    public async Task<string> Convert(string sessionId ,IList<string> files, int compresionLevel  , ImageType resultImageType )
    {
        var convertedFiles = await _factory.GetStrategyType(resultImageType).Convert(files , compresionLevel);
        return _fileManager.ZipFile(sessionId , convertedFiles);
    }

    public void Dispose()
    {
        _factory = null;
        _fileManager = null;
    }
}