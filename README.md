# Doom Kitty

Artist SPA adapted from sjefvanleeuwen/landing. Includes its full SCSS design system, custom navigation/footer, scroll reveals, dynamic artwork theme, MagazineAudioPlayer, global AudioService, and mini-player. The entry dialog starts sound from one explicit visitor gesture.

Home uses a shuffled, preloaded two-video crossfade with Tikki-Tik, Likkie-Likkie playing independently. Clips are background material only; there are no video listings or direct video links. Music opens an editorial song page adapted from the original Solitude Machine layout. All views share the audio service and preserve playback on navigation/scroll. Audio loops on the opening.

The supplied Suno track is stored at public/audio/tikki-tik.m4a, with artwork at public/cover.jpeg. No runtime dependency on Suno media hosting. No invented BPM/key or artist biography.

Node 22. npm ci; npm test; npm run build. GitHub Actions validates and deploys main. Videos in media subfolders are recursively discovered at build time.
