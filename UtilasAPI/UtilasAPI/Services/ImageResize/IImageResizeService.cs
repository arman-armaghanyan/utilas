using System.Drawing;

namespace ToolityAPI.Services.ImageResize;

public interface IImageResizeService
{
    Task<IList<string>> ResizeImages(IList<string> files, Size size);
    Task<string> ResizeImage(string file, Size size);
}