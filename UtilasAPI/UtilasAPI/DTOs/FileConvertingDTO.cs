using ToolityAPI.Models.Convertors;

namespace ToolityAPI.DTOs;

public class FileConvertingDTO
{
    public string SessionId { get; set; }
    public ImageType ResultFileType {get; set;}
    public ImageType SourceFileType {get; set;}

}