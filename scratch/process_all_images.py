import os
import sys
import glob
import re
import json
from cloudinary_uploader import upload_file_to_cloudinary

CLOUD_NAME = "dbotzlymk"
API_SECRET = "9Ns3qLX18Plvg991iCd3LzPhhuk"

def process(api_key):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    public_dir = os.path.join(root_dir, "public")
    assets_dir = os.path.join(root_dir, "src", "assets")
    
    # 1. Collect image files
    extensions = ("*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.avif", "*.webp")
    
    public_files = []
    for ext in extensions:
        public_files.extend(glob.glob(os.path.join(public_dir, ext)))
        
    assets_files = []
    for ext in extensions:
        assets_files.extend(glob.glob(os.path.join(assets_dir, ext)))
        
    all_files = set(public_files + assets_files)
    print(f"Found {len(all_files)} total images ({len(public_files)} in public, {len(assets_files)} in src/assets)")
    
    url_mapping = {}
    uploaded_count = 0
    
    for filepath in sorted(all_files):
        rel_path = os.path.relpath(filepath, root_dir)
        filename = os.path.basename(filepath)
        
        print(f"[{uploaded_count + 1}/{len(all_files)}] Uploading {filename}...")
        try:
            url = upload_file_to_cloudinary(filepath, CLOUD_NAME, api_key, API_SECRET, folder="portfolio")
            if url:
                url_mapping[filename] = url
                url_mapping[f"/{filename}"] = url
                url_mapping[rel_path.replace("\\", "/")] = url
                print(f"  -> {url}")
                uploaded_count += 1
            else:
                print(f"  FAILED to get URL for {filename}")
        except Exception as e:
            print(f"  ERROR uploading {filename}: {e}")
            
    print(f"\nSuccessfully uploaded {uploaded_count}/{len(all_files)} images.")
    
    if uploaded_count == 0:
        print("Aborting code replacement and file deletion since no images were uploaded.")
        return
        
    # Save mapping log
    with open(os.path.join(root_dir, "scratch", "uploaded_urls.json"), "w") as f:
        json.dump(url_mapping, f, indent=2)
        
    # 2. Update code references in src/
    src_dir = os.path.join(root_dir, "src")
    modified_files = set()
    
    code_extensions = ("*.ts", "*.tsx", "*.css", "*.js", "*.jsx", "*.json", "*.html")
    code_files = []
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith((".ts", ".tsx", ".css", ".js", ".jsx", ".json", ".html")):
                code_files.append(os.path.join(root, file))
                
    # Also check index.html in root if exists
    index_html = os.path.join(root_dir, "index.html")
    if os.path.exists(index_html):
        code_files.append(index_html)
        
    for code_file in code_files:
        try:
            with open(code_file, "r", encoding="utf-8") as f:
                content = f.read()
                
            new_content = content
            file_changed = False
            
            # Replace imports and direct string references for each uploaded filename
            for filename, c_url in url_mapping.items():
                if not filename.startswith("/") and "/" not in filename:
                    # Match imports like: import foo from "../../assets/filename.ext"; -> const foo = "https://...";
                    # or import foo from "./assets/filename.ext";
                    import_pattern = re.compile(rf'import\s+([A-Za-z0-9_$]+)\s+from\s+["\'][^"\']*{re.escape(filename)}["\'];?')
                    matches = import_pattern.findall(new_content)
                    if matches:
                        for var_name in matches:
                            new_content = re.sub(
                                rf'import\s+{var_name}\s+from\s+["\'][^"\']*{re.escape(filename)}["\'];?',
                                f'const {var_name} = "{c_url}";',
                                new_content
                            )
                        file_changed = True
                        
                    # Also replace literal strings "/filename" or "../../assets/filename" or "filename"
                    # Literal string "/filename.png"
                    if f'"/{filename}"' in new_content:
                        new_content = new_content.replace(f'"/{filename}"', f'"{c_url}"')
                        file_changed = True
                    if f"'/filename.png'" in new_content:
                        new_content = new_content.replace(f"'/filename.png'", f"'{c_url}'")
                        file_changed = True
                    if f'`/{filename}`' in new_content:
                        new_content = new_content.replace(f'`/{filename}`', f'`{c_url}`')
                        file_changed = True
                        
            if file_changed:
                with open(code_file, "w", encoding="utf-8") as f:
                    f.write(new_content)
                modified_files.add(code_file)
                print(f"Updated references in {os.path.relpath(code_file, root_dir)}")
        except Exception as e:
            print(f"Error processing code file {code_file}: {e}")
            
    print(f"\nUpdated {len(modified_files)} source code files.")
    
    # 3. Delete local image files
    deleted_count = 0
    for filepath in all_files:
        filename = os.path.basename(filepath)
        if filename in url_mapping or f"/{filename}" in url_mapping:
            try:
                os.remove(filepath)
                deleted_count += 1
            except Exception as e:
                print(f"Error removing {filepath}: {e}")
                
    print(f"Deleted {deleted_count} local image files.")
    print("ALL DONE!")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process(sys.argv[1])
    else:
        env_key = os.environ.get("CLOUDINARY_API_KEY")
        if env_key:
            process(env_key)
        else:
            print("Please pass CLOUDINARY_API_KEY as argument or environment variable.")
