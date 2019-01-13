import os
import sys

from PIL import Image, ImageDraw

TOTAL_IMAGE_DIMENSION = 412
WHITE = (255,255,255,255)

filename = sys.argv[1]
save_as_png = len(sys.argv) == 3
im = Image.open(filename)
im.thumbnail((TOTAL_IMAGE_DIMENSION, TOTAL_IMAGE_DIMENSION))

# Draw borders to visualize the split.
draw = ImageDraw.Draw(im)
for i in range(3):
	x0 = (i + 1) * 100 + i * 4
	x1 = x0 + 4
	draw.rectangle([(x0, 0), (x1, TOTAL_IMAGE_DIMENSION)], fill=WHITE)
	draw.rectangle([(0, x0), (TOTAL_IMAGE_DIMENSION, x1)], fill=WHITE)
del draw

im.show()

filename_without_ext = os.path.splitext(filename)[0]
for i in range(16):
	row = i // 4
	column = i % 4
	x0 = 104 * column
	x1 = x0 + 100
	y0 = 104 * row
	y1 = y0 + 100
	cropped_copy = im.crop((x0, y0, x1, y1))
	if save_as_png:
		cropped_copy.save(f"{filename_without_ext}_{i}.png", "PNG")
	else:
		cropped_copy.save(f"{filename_without_ext}_{i}.jpg", "JPEG")