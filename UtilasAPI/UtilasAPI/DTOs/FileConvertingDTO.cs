using System.Drawing;
using ToolityAPI.Models.Convertors;

namespace ToolityAPI.DTOs;

public class FileConvertingDTO
{
    public string SessionId { get; set; }
    public ImageType ResultFileType {get; set;}
    
    public bool IsNeedResize {get; set;}
    
    public Size ResultSize {get; set;}
    public int CompressionLevel {get; set;}
    
    public bool IsNeedRemoveExif {get; set;}
}