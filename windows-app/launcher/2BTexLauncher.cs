using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace TwoBTexLauncher
{
    internal static class Program
    {
        private const string AppName = "2B Tex";
        private const string DefaultShareRoot = @"\\2B-Server\2B-Tex";

        [STAThread]
        private static int Main()
        {
            try
            {
                string shareRoot = ResolveShareRoot();
                string manifestPath = Path.Combine(shareRoot, "client-app-manifest.json");
                if (!File.Exists(manifestPath))
                {
                    throw new FileNotFoundException("ملف تحديث التطبيق غير موجود.", manifestPath);
                }

                string manifestJson = File.ReadAllText(manifestPath);
                string appUrl = JsonString(manifestJson, "appUrl");
                string sourceAppDir = JsonString(manifestJson, "sourceAppDir");
                string expectedAsarHash = JsonString(manifestJson, "appAsarSha256");
                string version = JsonString(manifestJson, "version");

                if (string.IsNullOrWhiteSpace(appUrl))
                {
                    appUrl = "http://192.168.11.191:3000/login.html";
                }
                if (string.IsNullOrWhiteSpace(sourceAppDir))
                {
                    sourceAppDir = Path.Combine(shareRoot, @"windows-app\dist\win-unpacked");
                }

                CheckLoginPage(appUrl);

                string sourceExe = Path.Combine(sourceAppDir, "2B Tex.exe");
                string sourceAsar = Path.Combine(sourceAppDir, @"resources\app.asar");
                if (!File.Exists(sourceExe) || !File.Exists(sourceAsar))
                {
                    throw new FileNotFoundException("ملفات تطبيق 2B Tex غير مكتملة على السيرفر.", sourceAppDir);
                }

                string sourceAsarHash = Sha256(sourceAsar);
                if (!string.IsNullOrWhiteSpace(expectedAsarHash) &&
                    !sourceAsarHash.Equals(expectedAsarHash, StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException("نسخة التطبيق على السيرفر لا تطابق ملف التحديث.");
                }

                string installRoot = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "2BTex");
                string localAppDir = Path.Combine(installRoot, "App");
                string localExe = Path.Combine(localAppDir, "2B Tex.exe");
                string localAsar = Path.Combine(localAppDir, @"resources\app.asar");

                bool copyRequired = !File.Exists(localExe) || !File.Exists(localAsar);
                if (!copyRequired)
                {
                    string localHash = Sha256(localAsar);
                    copyRequired = !localHash.Equals(sourceAsarHash, StringComparison.OrdinalIgnoreCase);
                }

                if (copyRequired)
                {
                    StopRunningClient(localAppDir);
                    if (Directory.Exists(localAppDir))
                    {
                        Directory.Delete(localAppDir, true);
                    }
                    Directory.CreateDirectory(localAppDir);
                    CopyDirectory(sourceAppDir, localAppDir);
                }

                if (!File.Exists(localExe) || !File.Exists(localAsar))
                {
                    throw new FileNotFoundException("فشل تثبيت التطبيق محليًا.", localAppDir);
                }
                string installedHash = Sha256(localAsar);
                if (!installedHash.Equals(sourceAsarHash, StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException("نسخة التطبيق المحلية لا تطابق نسخة السيرفر.");
                }

                File.WriteAllText(Path.Combine(installRoot, "client-app-manifest.json"), manifestJson);
                WriteVersionFile(installRoot, version);

                Process.Start(new ProcessStartInfo
                {
                    FileName = localExe,
                    WorkingDirectory = localAppDir,
                    UseShellExecute = true
                });
                return 0;
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    ex.Message,
                    AppName,
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error,
                    MessageBoxDefaultButton.Button1,
                    MessageBoxOptions.RightAlign | MessageBoxOptions.RtlReading);
                return 1;
            }
        }

        private static string ResolveShareRoot()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
            if (File.Exists(Path.Combine(baseDir, "client-app-manifest.json")))
            {
                return baseDir;
            }
            return DefaultShareRoot;
        }

        private static void CheckLoginPage(string appUrl)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var request = (HttpWebRequest)WebRequest.Create(appUrl);
            request.Method = "GET";
            request.Timeout = 8000;
            using (var response = (HttpWebResponse)request.GetResponse())
            {
                int status = (int)response.StatusCode;
                if (status < 200 || status >= 400)
                {
                    throw new InvalidOperationException("السيرفر رد بحالة غير صحيحة: HTTP " + status);
                }
            }
        }

        private static string JsonString(string json, string key)
        {
            string pattern = "\"" + Regex.Escape(key) + "\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"";
            Match match = Regex.Match(json, pattern);
            if (!match.Success)
            {
                return "";
            }
            return Regex.Unescape(match.Groups[1].Value);
        }

        private static string Sha256(string path)
        {
            using (var stream = File.OpenRead(path))
            using (var sha = SHA256.Create())
            {
                return BitConverter.ToString(sha.ComputeHash(stream)).Replace("-", "").ToUpperInvariant();
            }
        }

        private static void CopyDirectory(string sourceDir, string destinationDir)
        {
            foreach (string dir in Directory.GetDirectories(sourceDir, "*", SearchOption.AllDirectories))
            {
                string relative = dir.Substring(sourceDir.Length).TrimStart('\\');
                Directory.CreateDirectory(Path.Combine(destinationDir, relative));
            }

            foreach (string file in Directory.GetFiles(sourceDir, "*", SearchOption.AllDirectories))
            {
                string relative = file.Substring(sourceDir.Length).TrimStart('\\');
                string target = Path.Combine(destinationDir, relative);
                Directory.CreateDirectory(Path.GetDirectoryName(target));
                File.Copy(file, target, true);
            }
        }

        private static void StopRunningClient(string localAppDir)
        {
            string normalizedRoot = Path.GetFullPath(localAppDir)
                .TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;

            foreach (Process process in Process.GetProcessesByName("2B Tex"))
            {
                try
                {
                    if (process.Id == Process.GetCurrentProcess().Id)
                    {
                        continue;
                    }

                    string executablePath = process.MainModule.FileName;
                    if (!Path.GetFullPath(executablePath).StartsWith(
                        normalizedRoot,
                        StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }

                    if (process.CloseMainWindow())
                    {
                        process.WaitForExit(3000);
                    }
                    if (!process.HasExited)
                    {
                        process.Kill();
                        process.WaitForExit(5000);
                    }
                }
                catch
                {
                    // A stale renderer may disappear while enumerating it.
                    // The copy below remains the final lock/error check.
                }
                finally
                {
                    process.Dispose();
                }
            }
        }

        private static void WriteVersionFile(string installRoot, string version)
        {
            try
            {
                Directory.CreateDirectory(installRoot);
                File.WriteAllText(Path.Combine(installRoot, "client-version.txt"), version ?? "");
            }
            catch
            {
                // Version file is diagnostic only; app launch should not fail because of it.
            }
        }
    }
}
