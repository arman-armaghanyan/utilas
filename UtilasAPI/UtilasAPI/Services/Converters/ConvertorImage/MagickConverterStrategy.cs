using ImageMagick;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class MagickConverterStrategy : IImageConverterStrategy
{
    private readonly string _extension;
    private readonly MagickFormat _type;
    private readonly MagickColor _color = MagickColors.Black;
    private readonly CompressionMethod _completionMethod = CompressionMethod.NoCompression;

    public MagickConverterStrategy(string extension , MagickFormat type )
    {
        _extension = extension;
        _type = type;
    }

    public MagickConverterStrategy(string extension, MagickFormat type , CompressionMethod completionMethod):this(extension,type)
    {
        _completionMethod = completionMethod;
    }
    public MagickConverterStrategy(string extension, MagickFormat type , MagickColor color ):this(extension,type,CompressionMethod.NoCompression)
    {
        _color = color;
    }
    public MagickConverterStrategy(string extension, MagickFormat type , CompressionMethod completionMethod, MagickColor color ):this(extension,type,completionMethod)
    {
        _color = color;
    }
    
    public async Task<IList<string>> Convert(IList<string> files , int compressionLevel)
    {
        var tasks = files.Select(file =>  Convert(file , compressionLevel));
        var convertedFiles = await Task.WhenAll(tasks);
        return convertedFiles.ToList();
    }
    
    private  Task<string> Convert(string imagePath ,int compressionLevel )
    {
        var token = new TaskCompletionSource<string>();
        var resultPath = Path.ChangeExtension(imagePath, _extension);                          
        Task.Run(() =>  
        {
            using (var image = new MagickImage(imagePath))
            {
                image.BackgroundColor = _color;
                if(_color != MagickColors.Black)
                    image.Alpha(AlphaOption.Remove);
                image.Quality = (uint)compressionLevel;
                image.SetCompression(_completionMethod);
                image.Format = _type;
                image.Write(resultPath);
            }
            token.SetResult(resultPath);
        });
        return token.Task;
    }
}