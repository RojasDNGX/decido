$url = 'http://localhost:3001/api/analyze';
$body = @{ input = 'teste de limite' } | ConvertTo-Json;

echo '--- RESETTING USAGE ---';
Remove-Item -Path data/usage.db -ErrorAction SilentlyContinue;

echo '--- REQUEST 1 ---';
$r1 = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing;
echo $r1.StatusCode;

echo '--- REQUEST 2 ---';
$r2 = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing;
echo $r2.StatusCode;

echo '--- REQUEST 3 ---';
$r3 = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing;
echo $r3.StatusCode;

echo '--- REQUEST 4 (LIMIT) ---';
try {
    Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing;
} catch {
    echo 'Limit Reached (Expected)';
    echo $_.Exception.Response.StatusCode.value__;
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
    $respBody = $reader.ReadToEnd();
    echo $respBody;
}
