# Berbers Save the Date — Ninong & Ninang

Scratch-off save-the-date for **Jason & Rhona** principal sponsors (Ninong & Ninang).

Same design as the guest save-the-date; only the **heart reveal text** differs.

## Edit heart content

Update the copy inside `.heart-well__content` in `index.html`:

```html
<div class="heart-well__content">
  <p class="invite-copy">
    We kindly invite you<br />
    <span class="invite-copy__second">as our Ninong & Ninang</span>
  </p>
  <p class="invite-date">11.11.26</p>
</div>
```

## Preview locally

```powershell
cd Save-the-date/ninong-ninang
python -m http.server 8000
```

Open http://localhost:8000

## Audio

Place `until-i-found-you.mp3` in the `audio/` folder (same as the guest version).
