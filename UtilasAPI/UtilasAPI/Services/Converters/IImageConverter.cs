using System.IO.Compression;
using ImageMagick;

namespace ToolityAPI.Services.Converters;

public enum ConverterType
{
    Pngtojpg
}

public interface IImageConverter
{
    public Task<string> ConvertImage( string id ,IList<string> files , ConverterType converterType);
}

public interface IImageConverterStrategy
{
    public Task<IList<string>> Convert (IList<string> files );
}

public class PngtoJpgConverterStrategy : IImageConverterStrategy
{
    public async Task<IList<string>> Convert(IList<string> files)
    {
        var tasks = files.Select(file =>  Convert(file));
        var convertedFiles = await Task.WhenAll(tasks);
        return convertedFiles.ToList();
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
                magicImage.Format = MagickFormat.Jpeg;
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
    private  string UPLOAD_Fils_PATH = $"{Directory.GetCurrentDirectory()}/uploads";

    private readonly ImageConverterStrategyFactory _factory;

    public ImageConverterService(ImageConverterStrategyFactory factory)
    {
        _factory = factory;
    }
    public async Task<string> ConvertImage(string id ,IList<string> files, ConverterType converterType)
    {
        var convertedFiles = await _factory.GetStragetype(converterType).Convert(files);
        var zipPath = Path.Combine(UPLOAD_Fils_PATH , $"{id}.zip");

        using (ZipArchive archive = ZipFile.Open(zipPath, ZipArchiveMode.Update))
        {
            foreach (var file in convertedFiles)
                archive.CreateEntryFromFile(file, file.Split("/").Last());
        }

        return zipPath;
    }
}