using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using ToolityAPI.DTOs;
using ToolityAPI.Services.Converters;

namespace ToolityAPI.Controllers;

public class PNGtoAnyControler : Controller
{
    private  string UPLOAD_Fils_PATH = $"{Directory.GetCurrentDirectory()}/uploads";
    private readonly IImageConverter _imageConverter;
    public PNGtoAnyControler(IImageConverter imageConverter)
    {
        _imageConverter = imageConverter;
    }
    
    [HttpGet("png_to_any_download")]  
    public async Task<IActionResult> GetFileById(FileUploadDTO uploadId)
    {
        var uploadPath = Directory.CreateDirectory( Path.Combine(UPLOAD_Fils_PATH , uploadId.ResultId));
        var files = Directory.GetFiles(uploadPath.FullName).ToList();

        var path = await _imageConverter.ConvertImage(files, ConverterType.Pngtojpg);
        if (System.IO.File.Exists(path))  
        {  
            return File(System.IO.File.OpenRead(path), "application/octet-stream", Path.GetFileName(path));  
        }  
        return NotFound();  
    }  
    
    [HttpPost("png_to_any_upload")]
    public async Task<IActionResult> Upload(FileUploadDTO uploadId)
    {
        IFormFileCollection files = Request.Form.Files;
        var currentUploadPath = !String.IsNullOrEmpty(uploadId.ResultId)? this.GetHashCode().ToString() : uploadId.ResultId;
        if (!Directory.Exists(UPLOAD_Fils_PATH))
        {
            Directory.CreateDirectory(UPLOAD_Fils_PATH);
        }
        var uploadPath = Directory.CreateDirectory( Path.Combine(UPLOAD_Fils_PATH , currentUploadPath));
 
        foreach (var file in files)
        {
            string fullPath = $"{uploadPath}/{file.FileName}";
            
            using (var fileStream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
        }
        
        return Ok(new FileUploadDTO(){ResultId = currentUploadPath});
    }
}