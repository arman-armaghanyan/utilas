using ImageMagick;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class ImageConverterStrategyFactory : IDisposable
{
    private Dictionary<ConverterType, IImageConverterStrategy> _converters;

    public ImageConverterStrategyFactory()
    {
        RegistretStrategys();
    }

    public IImageConverterStrategy GetStragetype(ConverterType converterType)
    {
        if(!_converters.ContainsKey(converterType))
            throw new NotImplementedException(converterType.ToString()); 
        return _converters[converterType];
    }
    
    private void RegistretStrategys()
    {
        _converters = new Dictionary<ConverterType, IImageConverterStrategy>
        {
            [ConverterType.WEBP] = new MagickConverterStrategy("webp" , MagickFormat.WebP),
            [ConverterType.HEIC] = new MagickConverterStrategy("heic" , MagickFormat.Heic),
            [ConverterType.PNG] = new MagickConverterStrategy("png" , MagickFormat.Png),
            [ConverterType.JPEG] = new MagickConverterStrategy("jpeg" , MagickFormat.Jpeg),

        };
    }

    public void Dispose()
    {
        _converters = null;
    }
}