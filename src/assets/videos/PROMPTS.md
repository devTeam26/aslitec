# Home page videos

Drop finished `.mp4` files into this folder with the exact names below. The home
page picks them up automatically, with no code changes needed:

- `hero-<slide>.mp4` replaces that hero slide's artwork (wide, 16:9).
- `action-<slide>.mp4` adds a card to the "Made for Real Life" reel (vertical, 9:16).
  The reel section stays hidden until at least one `action-*` file exists.

## How to make them

Use an image-to-video tool (for example Runway, Kling, Google Veo or OpenAI Sora).
Upload the **reference photo** listed for each clip, so the product in the video
looks like the real one, then paste the prompt.

Always check the result: AI video can change logos, buttons and shapes. Only
publish clips where the product looks like the real product.

## File specs

- MP4 (H.264), no audio track, 5 to 8 seconds, loops cleanly
- Hero: 1920×1080 (16:9). Keep the people and product on the **right half**; the headline sits on the left.
- Reel: 1080×1920 (9:16). Keep the bottom quarter calm; the caption sits there.
- Aim for 3 MB or less per file. To shrink one with ffmpeg:
  `ffmpeg -i in.mp4 -an -vf scale=1920:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart hero-gaming.mp4`

Shared style for every prompt: *warm natural light, shallow depth of field, slow
cinematic camera move, premium tech-brand commercial look, subtle orange
(#D4693A) and navy (#2d3444) accents, no text, no logos other than the product's own.*

---

## Hero slides (16:9)

### hero-smart-home.mp4
Reference: `src/assets/smart home/Eva Security Cam- aslitec/JS-G20/1.webp`
> A young family arrives home at golden hour. A white dual-lens outdoor security camera with two antennas is mounted on the wall beside the front door, on the right side of the frame. The father glances at his phone and smiles as he sees the live view. Slow push-in toward the camera on the wall. Warm sunset light, modern villa entrance, plants by the door.

### hero-gaming.mp4
Reference: `src/assets/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-05.webp`
> Two friends on a couch at night playing a video game, lit by the TV glow. Close-up on the right of frame: hands gripping a white wireless game controller with glowing rainbow RGB light strips on the grips, thumbs moving on the sticks. The RGB lights pulse softly. Dark living room, navy tones with orange rim light, slow orbit around the hands.

### hero-cases.mp4
Reference: `src/assets/accessories/Cases/No.12 aslitec Cyber Mech case/purple.webp`
> A stylish young woman in a café holds her phone in one hand; the phone is in a purple case with a mechanical ring-grip design on the back. She turns the phone to show the back of the case to the camera, on the right side of the frame. Cream and terracotta café interior, soft daylight, slow dolly-in.

### hero-power.mp4
Reference: `src/assets/accessories/Powerbank/HW121-purple.webp`
> A traveller at an airport gate pulls a slim plum-coloured power bank with a fold-out stand from a backpack, plugs in the attached cable and props a phone on it on a table, right side of frame. Phone screen shows charging. Warm terminal light, planes blurred through the window, slow push-in.

### hero-appliances.mp4
Reference: `src/assets/home appliance/app-a6.webp`
> Morning in a bright modern kitchen. A glass electric kettle on the counter, right side of frame, water bubbling inside with a soft orange glow from its base light. A hand lifts it and pours steaming water into a ceramic mug. Sage-green and cream kitchen, sunlight through the window, steam catching the light, slow motion.

---

## In Action reel (9:16)

### action-smart-home.mp4
Reference: `src/assets/smart home/Eva Security Cam- aslitec/JS-R03/3.webp`
> Vertical video. A delivery person rings a smart video doorbell at a modern front door. Cut to the homeowner on a sofa answering on their phone, waving and talking through the app. Natural daylight, warm tones.

### action-gaming.mp4
Reference: `src/assets/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-01.webp`
> Vertical video. A teenager celebrates a win, raising a blue-camouflage wireless game controller with glowing rainbow RGB light strips. Dark room, TV glow, RGB light reflecting on their face, energetic handheld camera.

### action-cases.mp4
Reference: `src/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/pink.webp`
> Vertical video. On a desk, a hand flips out the green kickstand on the back of a pink phone case and stands the phone up to watch a video. Then the hand picks it up again with a secure grip. Clean cream desk, soft daylight, close-up.

### action-power.mp4
Reference: `src/assets/accessories/Powerbank/HW121-silver.webp`
> Vertical video. A cyclist on a city bench takes a slim silver power bank from a jacket pocket and charges their phone with the attached cable, then slips both back into the pocket and rides off. Golden hour street, handheld feel.

### action-appliances.mp4
Reference: `src/assets/home appliance/app-a2.webp`
> Vertical video. A matte black electric kettle clicks off on a kitchen counter; a person pours hot water over coffee in a pour-over dripper. Steam, morning light, cosy minimal kitchen, close-up slow motion.

### action-waterproof.mp4
Reference: `src/assets/accessories/WaterProof Case/front-01.webp`
> Vertical video. At a pool, a person in sunglasses dips a phone sealed in a clear waterproof case with a black frame and neck strap under the water and takes a photo, then lifts it out with water droplets running off. Bright summer sun, turquoise water.
