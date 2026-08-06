from PIL import Image

input_path = 'public/One-Piece-Logo.png'
output_path = 'public/one_piece_logo_nobg.png'

print(f"Opening {input_path}...")
img = Image.open(input_path).convert("RGBA")

# Replace white pixels with transparent
data = img.getdata()
new_data = []
for r, g, b, a in data:
    # If pixel is close to white, make it transparent
    if r > 220 and g > 220 and b > 220:
        new_data.append((r, g, b, 0))
    else:
        new_data.append((r, g, b, a))

img.putdata(new_data)
img.save(output_path, 'PNG')
print(f"Saved to {output_path}")
print("Done!")
