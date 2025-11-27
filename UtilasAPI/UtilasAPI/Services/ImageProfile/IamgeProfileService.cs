using ImageMagick;

namespace ToolityAPI.Services.ImageProfile;

public class MagicProfileImageService : IProfileImage
{
    public async Task<IList<string>> RemoveFilesAllProfileData(IList<string> files)
    { 
        var tasks = files.Select(file => RemoveFileAllProfileData(file));
        var clearedImages = (await Task.WhenAll(tasks)).ToList();
        return clearedImages;
       
    }

    public async Task<string> RemoveFileAllProfileData(string file)
    {
        using (var image = new MagickImage(file))
        {
            var exifProfile = image.GetExifProfile();
            var xmpProfile = image.GetXmpProfile();
            var iptcProfile = image.GetIptcProfile();
            var bimProfile = image.Get8BimProfile();
            if (exifProfile != null)
                image.RemoveProfile(exifProfile);
            if (xmpProfile != null)
                image.RemoveProfile(xmpProfile);
            if (bimProfile != null)
                image.RemoveProfile(bimProfile);
            if (iptcProfile != null)
                image.RemoveProfile(iptcProfile);

            FileInfo fileInfo = new FileInfo(file);
            fileInfo.Delete();
            await image.WriteAsync(file);
        }
        return file;
    }

}