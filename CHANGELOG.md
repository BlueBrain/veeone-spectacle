# Changelog

## 1.2.0

2023-07-26

- Bound view: enable preparing presentations with given aspect ratio
- Target screen bevel preview ("grid")
- Scale launcher menu
- Pause movies by default in web client
- Notification snackbar

## 1.1.1

2023-02-06

- Fix for movies playing in the fullscreen mode

## 1.1.0

2023-01-31

- PDF support
- Improve url string handling in the location bar (embedded websites)
- Improve visual keyboard experience
- Minor fixes

## 1.0.0

2022-09-06

VeeDrive version: `0.3.0`

### New features

- General
  - Manipulate content frames
  - Move, resize, close frames
  - Environment configuration via query params
- Loading and saving presentations
  - Monitor when presentation has been changed and warn users
  - Save / Save as functionality
  - Open presentation from VeeDrive
  - Restore presentation state after the browser has been reloaded (prevent data loss)
- File browser
  - Open media files (images, videos)
  - Open multiple files at once (multiselection mode)
  - Display file thumbnails
  - Grid or list view in folders
  - Image keeper (loading and caching system in Web Workers)
- Embedded websites
  - Open custom URLs
  - Switch between interactive and frame mode (interact with the content or with the frame)
  - Parse and validate URLs
- Video files
  - Playback controls
  - Fullscreen
  - Skip forwards/backwards
- Virtual keyboard
  - Customizable layout and keys
- Scenes
  - Add and manage the scenes
  - Navigate between the scenes
