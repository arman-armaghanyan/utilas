using ImageMagick;
using ToolityAPI.Models.Convertors;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class LibHeifConverterStrategy : IImageConverterStrategy
{
    public async Task<IList<string>> Convert(IList<string> files, ImageType imageType)
    {
        var tasks = files.Select(file =>  Convert(file));
        var convertedFiles = await Task.WhenAll(tasks);
        return convertedFiles.ToList();
    }

    private Task<string> Convert(string imagePath)
    {
        var token = new TaskCompletionSource<string>();
        var resultPath = Path.ChangeExtension(imagePath,".heic");                          
        Task.Run(() =>  
        {

        });
        return token.Task;
    }
}

public class MagickConverterStrategy : IImageConverterStrategy
{
    private readonly string _extension;
    private readonly MagickFormat _type;

    public MagickConverterStrategy(string extension , MagickFormat type)
    {
        _extension = extension;
        _type = type;
    }
    
    public async Task<IList<string>> Convert(IList<string> files , ImageType format)
    {
        var tasks = files.Select(file =>  Convert(file));
        var convertedFiles = await Task.WhenAll(tasks);
        return convertedFiles.ToList();
    }
    
    private  Task<string> Convert(string imagePath )
    {
        var token = new TaskCompletionSource<string>();
        var resultPath = Path.ChangeExtension(imagePath, _extension);                          
        Task.Run(() =>  
        {
            using (var image = new MagickImage(imagePath))
            {
                image.Format = _type;
                image.Write(resultPath);
            }
            token.SetResult(resultPath);
        });
        return token.Task;
    }
}