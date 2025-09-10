using ImageMagick;

namespace ToolityAPI.Services.Converters;

public enum ConverterType
{
    Pngtojpg
}

public interface IImageConverter
{
    public Task<string> ConvertImage(IList<string> files , ConverterType converterType);
}

public interface IImageConverterStrategy
{
    public Task<string> Convert (IList<string> files );
}

public class PngtoJpgConverterStrategy : IImageConverterStrategy
{
    public async Task<string> Convert(IList<string> files)
    {
        var tasks = files.Select(file =>  Convert(file));
        var convertedFiles = await Task.WhenAll(tasks);
        return convertedFiles.FirstOrDefault() ?? string.Empty;
    }
    
    private static Task<string> Convert(string pngPath )
    {
        var token = new TaskCompletionSource<string>();
        var jpgPath = Path.ChangeExtension(pngPath, "jpg");                          
        Task.Run(() =>
        {
            using (FileStream image = File.Open(pngPath, FileMode.Open, FileAccess.Read, FileShare.None))
            {
                using var magicImage = new MagickImage(image);
                magicImage.Format = MagickFormat.WebP;
                var data = magicImage.ToByteArray();
                using (FileStream fs = File.Create(jpgPath))
                {
                    fs.Write(data, 0, data.Length);
                } 
                token.SetResult(jpgPath);
            }
        });
        return token.Task;
    }
}

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
            [ConverterType.Pngtojpg] = new PngtoJpgConverterStrategy(),
        };
    }

    public void Dispose()
    {
        _converters = null;
    }
}

public class ImageConverterService : IImageConverter
{
    private readonly ImageConverterStrategyFactory _factory;

    public ImageConverterService(ImageConverterStrategyFactory factory)
    {
        _factory = factory;
    }
    public Task<string> ConvertImage(IList<string> files, ConverterType converterType)
    {
        return _factory.GetStragetype(converterType).Convert(files);
    }
}