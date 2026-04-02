Get-ChildItem -Path "d:\MyCodingProject\DaydreamerBlog" -Recurse -Include "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Encoding UTF8 -Raw
    $oldClass = 'navbar-nav ml-auto text-center'
    $newClass = 'navbar-nav mx-auto text-center'
    $newContent = $content.Replace($oldClass, $newClass)
    Set-Content $_.FullName -Value $newContent -Encoding UTF8
}
Write-Host "Navbar alignment fixed successfully!"