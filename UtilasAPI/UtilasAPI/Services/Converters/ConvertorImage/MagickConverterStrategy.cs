using ImageMagick;

namespace ToolityAPI.Services.Converters.ConvertorImage;

public class MagickConverterStrategy : IImageConverterStrategy
{
    private readonly string _extension;
    private readonly MagickFormat _type;

    public MagickConverterStrategy(string extension , MagickFormat type)
    {
        _extension = extension;
        _type = type;
    }
    public async Task<IList<string>> Convert(IList<string> files)
    {
        var tasks = files.Select(file =>  Convert(file));
        var convertedFiles = await Task.WhenAll(tasks);
        return convertedFiles.ToList();
    }
    
    private  Task<string> Convert(string pngPath )
    {
        var token = new TaskCompletionSource<string>();
        var jpgPath = Path.ChangeExtension(pngPath, _extension);                          
        Task.Run(() =>  
        {
            using (FileStream image = File.Open(pngPath, FileMode.Open, FileAccess.Read, FileShare.None))
            {
                using var magicImage = new MagickImage(image);
                magicImage.Format = _type;
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