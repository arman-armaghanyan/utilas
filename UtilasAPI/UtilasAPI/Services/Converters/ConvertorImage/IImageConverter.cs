using ToolityAPI.Models.Convertors;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public interface IImageConverter
{
    public Task<string> Convert( string sessionId ,IList<string> files ,  int CompressionLevel  , ImageType resultImageType );
}