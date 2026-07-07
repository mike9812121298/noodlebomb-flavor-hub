// THE NEXT DROP - Index 09  (SECTION REMOVED 2026-06-13)
//
// The "WHAT'S NEXT / Shoyu Reserve is here" section was retired. The reserve
// line + new drops are now presented in the TheDrop section (app.jsx,
// id="the-drop"). The old section markup/copy has been deleted.
//
// This file is kept as a no-op only because build:static (package.json)
// compiles it by name; it renders nothing. The bootstrap loader in index.html
// no longer loads its bundle. Safe to delete once build:static is updated.
function NextDrop() {
  return null;
}

window.NextDrop = NextDrop;
