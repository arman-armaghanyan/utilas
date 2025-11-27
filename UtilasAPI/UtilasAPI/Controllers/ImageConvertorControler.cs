using Microsoft.AspNetCore.Mvc;
using ToolityAPI.DTOs;
using ToolityAPI.Services;
using ToolityAPI.Services.Converters.ConvertorImage;
using ToolityAPI.Services.ImageProfile;
using ToolityAPI.Services.ImageResize;

namespace ToolityAPI.Controllers;

public class ImageProcessingControler : Controller
{
    private readonly IImageConverter _imageConverter;
    private readonly FileManager _fileManager;
    private readonly IImageResizeService _imageResizeService;
    private readonly IProfileImage _imageProfileService;

    public ImageProcessingControler(IImageConverter imageConverter, FileManager fileManager,
        IImageResizeService imageResizeService , IProfileImage imageProfile)
    {
        _imageConverter = imageConverter;
        _fileManager = fileManager;
        _imageResizeService = imageResizeService;
        _imageProfileService = imageProfile;
    }

    [HttpGet("image_convertor_download")]
    public IActionResult GetConvertoredFileById(FileSessionDTO compressDto)
    {
        var resultZip = _fileManager.GetZipFile(compressDto.SessionId);
        if (!string.IsNullOrEmpty(resultZip))
            return File(System.IO.File.OpenRead(resultZip), "application/octet-stream", Path.GetFileName(resultZip));
        return NotFound();
    }

    [HttpPost("image_Compressing_config")]
    public IActionResult ConfigCompress(FileCompressDTO compressDto)
    {
        return Ok();
    }
    
    [HttpGet("image_compressing_download")]
    public IActionResult GetCompressedFileById(FileSessionDTO sessionDto)
    {
        var resultZip = _fileManager.GetZipFile(sessionDto.SessionId);
        if (!string.IsNullOrEmpty(resultZip))
            return File(System.IO.File.OpenRead(resultZip), "application/octet-stream", Path.GetFileName(resultZip));
        return NotFound();
    }
    
    [HttpPost("image_convertor_config")]
    public async Task<IActionResult> Convert([FromBody] FileConvertingDTO convertingDTO)
    {
        var files = _fileManager.GetFilesByID(convertingDTO.SessionId);
        if (convertingDTO.IsNeedResize)
            files = await _imageResizeService.ResizeImages(files, convertingDTO.ResultSize);
        if (convertingDTO.IsNeedRemoveExif)
            files = await _imageProfileService.RemoveFilesAllProfileData(files);
        await _imageConverter.Convert(convertingDTO.SessionId , files, convertingDTO.CompressionLevel, convertingDTO.ResultFileType );
        return Ok();
    }
    
    [HttpPost("image_upload")] 
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Upload(FileSessionDTO sessionDto)
    { 
        var files = Request.Form.Files;
        var currentUploadPath = String.IsNullOrEmpty(sessionDto.SessionId)?  Guid.NewGuid().ToString() : sessionDto.SessionId;
        
        await _fileManager.UploadFiles(files, currentUploadPath);
        return Ok(new FileSessionDTO(){SessionId = currentUploadPath});
    }
}