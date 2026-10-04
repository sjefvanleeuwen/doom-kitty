# Doom Kitty

First artist website template: persistent playback, shuffled video opening, music, films, and artist introduction. No artist photos or invented releases.

## Develop

Node 22 recommended. `npm ci`, `npm run dev`. Validate with `npm test` and `npm run build`.

## Add media

Commit videos (.mp4, .webm, .mov) and audio (.mp3, .wav, .ogg, .m4a) to `public/media/` or an existing media folder. The build discovers files and generates a manifest. MP4/H.264 and WebM recommended; MOV depends on browser and codec. File names become display titles. All videos appear in the opening and Films. Audio appears in Music; without audio, films are playable there. No template music is attributed to Doom Kitty.

The muted opening uses two preloaded elements, a 750ms crossfade, and shuffle cycles without adjacent repeats. Network and codec support affect uninterrupted playback; the current frame remains when the next clip is not ready. One clip loops. Reduced motion starts paused. Audio starts on visitor selection.

## Imported player

`src/player/` adapted from https://github.com/sjefvanleeuwen/landing (ISC): AudioService, MagazineAudioPlayer, GlobalMiniPlayer, ColorThief. Mirror/upper/lower spectra, particles, seek, volume, video background synchronization, and mini-player on scroll. Audio survives anchor navigation.

## Deployment

Actions tests/builds PRs and deploys main to GitHub Pages. Select GitHub Actions as the Pages source in repository settings if needed. Media is discovered in the pipeline; adding media needs no code changes.
