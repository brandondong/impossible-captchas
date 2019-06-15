import os
import sys

from PIL import Image, ImageDraw

TOTAL_IMAGE_DIMENSION = 412
WHITE = (255, 255, 255, 255)

filename = sys.argv[1]
im = Image.open(filename)
width, height = im.size
if width != height:
    print(
        f"Warning, width ({width}) != height ({height}). Image will be skewed during the resize.")
im = im.resize((TOTAL_IMAGE_DIMENSION, TOTAL_IMAGE_DIMENSION))

# Draw borders to visualize the split.
draw = ImageDraw.Draw(im)
for i in range(3):
    x0 = (i + 1) * 100 + i * 4
    x1 = x0 + 3
    draw.rectangle([(x0, 0), (x1, TOTAL_IMAGE_DIMENSION - 1)], fill=WHITE)
    draw.rectangle([(0, x0), (TOTAL_IMAGE_DIMENSION - 1, x1)], fill=WHITE)
del draw

im.show()

_, ext = os.path.splitext(filename)
save_as_png = ext == "png"
for i in range(16):
    row = i // 4
    column = i % 4
    x0 = 104 * column
    x1 = x0 + 100
    y0 = 104 * row
    y1 = y0 + 100
    cropped_copy = im.crop((x0, y0, x1, y1))
    if save_as_png:
        cropped_copy.save(f"{i}.png", "PNG")
    else:
        cropped_copy.save(f"{i}.jpg", "JPEG")
