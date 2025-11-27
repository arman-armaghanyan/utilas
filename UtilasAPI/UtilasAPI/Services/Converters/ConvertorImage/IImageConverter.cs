using ToolityAPI.Models.ImageProcessing;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public interface IImageConverter
{
    public Task<string> Convert( string sessionId ,IList<string> files ,  int compressionLevel  , ImageType resultImageType );
}