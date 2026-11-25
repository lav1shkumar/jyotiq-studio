"""Command line for the reel engine.

  render.py still T [T ...]                 full-resolution PNGs in $KIROCREW_SCRATCH/stills
  render.py sheet T0 T1 STEP [COLS] [TAG]   contact sheet in $KIROCREW_SCRATCH/sheets
  render.py video T0 T1 OUT                 x264 segment (BT.709); CRF and PRESET from the environment
  render.py scenes                          list the registered scenes
"""
import sys

import engine as E
import scenes  # noqa: F401  (registers the scenes and captions)

E.cli(sys.argv[1:])
