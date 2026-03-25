from PIL import Image

def get_hex(img, x, y):
    try:
        r, g, b, *a = img.getpixel((x, y))
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception as e:
        return str(e)

img_path = "/Users/algolix/.gemini/antigravity/brain/b51c9a04-1e95-42bf-aaba-fd797b31170c/dashboard_cards_100pct_1773177774330.png"
img = Image.open(img_path)

c = {
    "sidebar_bg": get_hex(img, 100, 100),
    "dashboard_bg": get_hex(img, 450, 200),
    "active_nav_bg": get_hex(img, 280, 29),
    "active_nav_text": get_hex(img, 280, 29), # Need precise x,y for text
    "card_bg": get_hex(img, 600, 150),
    "stat_icon_bg": get_hex(img, 510, 100), # Center of clock icon background
    "stat_trend_bg": get_hex(img, 660, 100), # Center of trend pill background
    "live_automations_item_bg": get_hex(img, 550, 460), # Inside the first item
}

print(c)
