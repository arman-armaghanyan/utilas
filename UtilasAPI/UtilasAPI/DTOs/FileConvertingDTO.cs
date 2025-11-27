using System.Drawing;
using System.Text.Json.Serialization;
using ToolityAPI.Models.ImageProcessing;

namespace ToolityAPI.DTOs;

public class FileConvertingDTO
{
    public string SessionId { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ImageType ResultFileType {get; set;}
    public bool IsNeedResize {get; set;}
    public Size ResultSize {get; set;}
    public int CompressionLevel {get; set;}
    public bool IsNeedRemoveExif {get; set;}
}