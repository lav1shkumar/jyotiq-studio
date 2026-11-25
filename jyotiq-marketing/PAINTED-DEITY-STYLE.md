# Jyotiq "Painted Deity" style — reusable prompt kit (ChatGPT image)

Look learned from a 36K-like Narasimha carousel (14 Nov 2026 reference). Style only: never copy its figure, pose details or signature.

## How the reference carousel works (copy the MECHANIC, not the art)
1. Full frontal deity, seated, centred, giant halo disc behind the head
2. Tight face close-up (eyes + crown + halo edge)
3. One hand + one weapon/object, big, against black
4. Torso + mudra hands crop (jewellery dabs)
5. "Process" reveal: the same painting as a flat-colour block-in (first-pass underpainting)

Workflow in ChatGPT: make slide 1 first. For every later slide, stay in the SAME chat and start the prompt with
"Same painting, same character, same colours and brushwork as the image above —" so the character stays locked.

## STYLE block (paste at the top of every prompt, unchanged)
```
STYLE: Hand-painted digital gouache-and-oil illustration on a dark ground, like a contemporary Indian painter's
Procreate/oil sketch. Loose, confident, visible brushstrokes; thick impasto dabs and palette-knife smears; edges
left unfinished and broken; drips and dry-brush scumble. Jewellery is painted as quick dabs of gold ochre, cream
and orange — suggested, not detailed. Low-key lighting: a deep near-black night forest background with clusters
of dark green foliage, flecked with burnt-orange highlights; a dark tree branch arches over the top of the frame
like a canopy with a few hanging roots. Behind the head sits a huge flat circular halo disc (like a giant rising
moon) painted in rough, uneven strokes, with crackling fiery energy and thin lightning-like orange-white sparks
bursting around the crown. Strict frontal symmetry, figure centred, seated cross-legged (padmasana) on a dim ochre
ground. Palette: vermilion and burnt orange, teal and sea-green, deep forest green, near-black, cream, gold ochre
flecks. Rich saturated colour against darkness, warm rim light on the figure. Painterly, human, imperfect.
NOT: photorealism, 3D render, smooth airbrushed AI look, glossy plastic skin, fine filigree detail, symmetrical
perfection in brushwork, any text, letters, numbers, logo, signature or watermark, frame or border, extra limbs
beyond the stated number. Portrait composition, 4:5 crop-safe: keep the crown and the feet well inside the frame.
```

## CHARACTER template (fill per deity, from scripture — not TV serial looks)
```
CHARACTER: [name] — [complexion with the scriptural simile], [age/feel], [number] arms.
Crown: [tall tiered kirita / jata etc.]. Garments: [colour, fabric]. Holds: [right upper], [left upper],
[right lower], [left lower]. Mount/seat: [vahana, painted loosely, calm]. Halo disc colour: [colour].
Face: [expression]. Third-element motif: [one small symbol tied to the story, e.g. a single bright star].
```

## Navagraha character locks (Matsya Purana ch. 94 dhyanas; verify verse wording before quoting on a slide)
| Graha | Complexion / garments | Arms & holds | Seat | Halo disc |
|---|---|---|---|---|
| सूर्य | deep red-gold, red garments | 2 arms, a lotus in each hand | chariot of 7 horses, lotus seat | blazing vermilion-gold |
| चंद्र | white, white garments | 2 arms: gada + varada | chariot of 10 white horses | pale silver-cream on indigo |
| मंगल | red, red garland and garments | 4: shakti, trishul, gada, varada | ram | deep blood-red |
| बुध | priyangu-bud green (shyama-green), yellow garland and garments, glow like karnikara flowers | 4: khadga (sword), charma (round shield), gada, varada | lion | saffron-yellow |
| गुरु | golden yellow, yellow garments | 4: danda, akshamala, kamandalu, varada | lotus seat | warm gold |
| शुक्र | white, white garments | 4: danda, akshamala, kamandalu, varada | lotus seat | pearl-white with rose edge |
| शनि | indranila (sapphire-black) | 4: trishul, bow, arrow, varada | vulture | deep indigo with cold blue sparks |
| राहु | dark smoky blue, fearsome face | 4: khadga, charma, trishul, varada | blue lion throne | eclipsed black disc, red corona |
| केतु | smoke-grey, distorted fierce face | 2: gada + varada | vulture | grey-violet smoky disc |

For Ramayana characters use `../jyotiq-ramayana-character-bible.md` to fill the CHARACTER template.
Halo colour rule: keep it warm (orange/saffron/red/gold) against dark green whenever the scripture allows —
that orange-on-forest-green contrast is what makes the look stop the scroll.
