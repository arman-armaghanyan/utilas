using System.Text.Json.Serialization;
using ToolityAPI.Models.ImageProcessing;

namespace ToolityAPI.DTOs;

public class FileSessionDTO
{
    public string SessionId { set; get; }
}

public class FileCompressDTO
{
    public string SessionId { set; get; }
    public int CompressionLevel { set; get; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public CompressionType  CompressionType { set; get; }
}