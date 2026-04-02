Get-ChildItem -Path "d:\MyCodingProject\DaydreamerBlog" -Recurse -Include "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Encoding UTF8 -Raw
    $jqueryScript = '<script  src="https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js" ></script>'
    $bootstrapScript = '<script  src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js" ></script>'
    $newContent = $content.Replace($bootstrapScript, $jqueryScript + "`n" + $bootstrapScript)
    Set-Content $_.FullName -Value $newContent -Encoding UTF8
}
Write-Host "jQuery added to all HTML files successfully!"