using System.Drawing;
using ImageMagick;

namespace ToolityAPI.Services.ImageResize;

public class MagickImageResizeService : IImageResizeService
{
    public async Task<IList<string>> ResizeImages(IList<string> files, Size size)
    {
        var tasks = files.Select(file => ResizeImage(file, size));
        var resizedImages = (await Task.WhenAll(tasks)).ToList();
        return resizedImages;
    }

    public async Task<string> ResizeImage(string file, Size size)
    {
        using (var image = new MagickImage(file))
        {
            var geometry = new MagickGeometry((uint)size.Width, (uint)size.Height);
            image.Resize(geometry);
            FileInfo fileInfo = new FileInfo(file);
            fileInfo.Delete();
            await image.WriteAsync(file);
        }

        return file;
    }
} 