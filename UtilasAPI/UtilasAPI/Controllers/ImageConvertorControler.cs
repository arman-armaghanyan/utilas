using Microsoft.AspNetCore.Mvc;
using ToolityAPI.DTOs;
using ToolityAPI.Services.Converters.ConvertorImage;


public class ImageConvertorControler : Controller
{
    private readonly IImageConverter _imageConverter;
    private readonly FileManager _fileManager;

    public ImageConvertorControler(IImageConverter imageConverter ,  FileManager fileManager)
    {
        _imageConverter = imageConverter;
        _fileManager = fileManager;
    }
    
    [HttpGet("image_convertor_download")]  
    public async Task<IActionResult> GetFileById(FileConvertingDTO convertingDTO )
    {
        var files = _fileManager.GetFilesByID(convertingDTO.SessionId);

        var path = await _imageConverter.Convert(convertingDTO.SessionId , files, convertingDTO.SourceFileType, convertingDTO.ResultFileType );
        if (System.IO.File.Exists(path))  
            return File(System.IO.File.OpenRead(path), "application/octet-stream", Path.GetFileName(path));  
        return NotFound();  
    }  
    
    [HttpPost("image_convertor_upload")] 
    public async Task<IActionResult> Upload(string sessionId)
    {

        IFormFileCollection files = Request.Form.Files;
        var currentUploadPath = String.IsNullOrEmpty(sessionId)?  Guid.NewGuid().ToString() : sessionId;
        
        await _fileManager.UploadFiles(files, currentUploadPath);
        return Ok(new FileConvertingDTO(){SessionId = currentUploadPath});
    }
}