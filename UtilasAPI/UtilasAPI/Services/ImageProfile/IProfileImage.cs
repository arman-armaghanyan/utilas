namespace ToolityAPI.Services.ImageProfile;

public interface IProfileImage
{
    Task<IList<string>> RemoveFilesAllProfileData(IList<string> files);
    Task<string> RemoveFileAllProfileData(string file);
}