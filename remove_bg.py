from rembg import remove
from PIL import Image

input_path = r'c:\data\my-sample\public\venom.png'
output_path = r'c:\data\my-sample\public\venom-nobg.png'

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
