using ImageMagick;
using ToolityAPI.Services;
using ToolityAPI.Services.Converters.ConvertorImage;
using ToolityAPI.Services.ImageProfile;
using ToolityAPI.Services.ImageResize;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ImageConverterFactory>();
builder.Services.AddScoped<IImageConverter , ImageConverterService>();
builder.Services.AddSingleton<FileManager>();
builder.Services.AddScoped<IImageResizeService, MagickImageResizeService>();
builder.Services.AddScoped<IProfileImage, MagicProfileImageService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy
            .AllowAnyOrigin() 
            .AllowAnyHeader()
            .AllowAnyMethod();
    }); 
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins"); 
app.UseAuthorization();

app.MapControllers();

app.Run();