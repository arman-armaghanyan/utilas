using ImageMagick;
using ToolityAPI.Models.ImageProcessing;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class ImageConverterFactory : IDisposable
{
    private Dictionary<ImageType, IImageConverterStrategy> _converters;

    public ImageConverterFactory()
    {
        RegisterStrategies();
    }

    public IImageConverterStrategy GetStrategyType(ImageType imageType)
    {
        if(!_converters.ContainsKey(imageType))
            throw new NotImplementedException(imageType.ToString()); 
        return _converters[imageType];
    }
    
    private void RegisterStrategies()
    {
        _converters = new Dictionary<ImageType, IImageConverterStrategy>
        {
            [ImageType.WEBP] = new MagickConverterStrategy("webp" , MagickFormat.WebP , CompressionMethod.WebP, MagickColors.White),
            [ImageType.PNG] = new MagickConverterStrategy("png" , MagickFormat.Png),
            [ImageType.JPEG] = new MagickConverterStrategy("jpeg" , MagickFormat.Jpeg , CompressionMethod.JPEG , MagickColors.White), 
        };
    }

    public void Dispose()
    {
        _converters = null;
    }
}