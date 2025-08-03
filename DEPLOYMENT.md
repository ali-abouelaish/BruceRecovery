# Hostinger Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Hostinger hosting account

## Build Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **The build output will be in the `out` directory**

## Upload to Hostinger

1. **Upload all files from the `out` directory to your Hostinger public_html folder**

2. **Important files to include:**
   - All HTML files (index.html, etc.)
   - All CSS files
   - All JS files
   - All images and assets
   - The `.htaccess` file (from public folder)

3. **File structure should look like:**
   ```
   public_html/
   ├── index.html
   ├── _next/
   ├── .htaccess
   └── [other static files]
   ```

## Key Differences from Standalone Mode

- **Use `output: 'export'`** (not `standalone`) for static hosting
- **No Node.js server required** - everything is static HTML/CSS/JS
- **Upload the `out` directory** (not `.next` directory)
- **All routing is client-side** handled by the `.htaccess` file

## Common Issues & Solutions

### 403 Forbidden Error
- Ensure `.htaccess` file is uploaded to the root directory
- Check file permissions (should be 644 for files, 755 for directories)
- Verify all files are uploaded correctly
- Make sure you're using `output: 'export'` not `standalone`

### 404 Not Found Error
- Make sure all files from the `out` directory are uploaded
- Check that the `.htaccess` file is present and properly configured

### Build Errors
- If you get errors about dynamic routes, you may need to specify static paths
- Add `generateStaticParams` to your pages if needed

## Troubleshooting

1. **Check Hostinger error logs** in your hosting control panel
2. **Verify file permissions** - files should be 644, directories 755
3. **Clear browser cache** and try again
4. **Test locally first** with `npm run build` and serve the `out` directory

## Support
If issues persist, check Hostinger's support documentation for Next.js static exports. 