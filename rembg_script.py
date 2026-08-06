import os
from rembg import remove
from PIL import Image

input_path = 'public/narutome.png'
output_path = 'public/narutome_nobg.png'

print(f"Opening {input_path}...")
input_image = Image.open(input_path)
print("Removing background...")
output_image = remove(input_image)
print(f"Saving to {output_path}...")
output_image.save(output_path)
print("Done!")
