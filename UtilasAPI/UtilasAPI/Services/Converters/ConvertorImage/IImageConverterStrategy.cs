
namespace ToolityAPI.Services.Converters.ConvertorImage;

public interface IImageConverterStrategy
{
    public Task<IList<string>> Convert (IList<string> files , int compressionLevel);
}