const guidance = {
  'watch-pouches': {
    heading:'What to decide for a watch pouch',
    intro:'YellowCada’s original pouch carousel shows past tan and muted-green leather pieces. A new pouch needs its own watch and storage requirements; the post gives no measured capacity, lining specification or current colour list.',
    questions:[
      'Which watch will it hold? Share the case dimensions and a photo if the shape is unusual.',
      'Is the pouch for everyday storage or travel, and how many watches should it hold?',
      'Which archive photo best shows the colour, fold-over shape or stitching you prefer?',
    ],
  },
  'leather-belts': {
    heading:'What to decide for a leather belt',
    intro:'The photographed YellowCada vegetable-tan belt is an example of past work. Its images show the leather, holes, edge stitching and buckle; they do not provide a size chart or current options.',
    questions:[
      'Share your waist measurement or the length of a belt that fits, and say how you measured it.',
      'Describe your preferred belt width, leather shade and buckle finish.',
      'Link the archived belt photo you like, then ask for the current leather and sizing method.',
    ],
  },
  'vegetable-tan-belt': {
    heading:'What to decide for this belt',
    intro:'The original post calls this a “Top Notch vegetable tan belt.” Three distinct views on this page show the shape, holes and brass-coloured buckle. The post does not give a fixed length, width or price.',
    questions:[
      'Give an existing belt or waist measurement and explain where the measurement was taken.',
      'Ask which vegetable-tanned leather, colour and buckle can be used for a new piece.',
      'Confirm the proposed width, hole placement and final length before approving the specification.',
    ],
  },
};

export function productGuidance(product) {
  if (guidance[product.slug]) return guidance[product.slug];
  if (product.category === 'Watch straps') return {
    heading:'What to decide for your watch strap',
    intro:'An archive strap can guide the look. A new strap is fitted to a particular watch and wearer, so the maker needs measurements before confirming the design.',
    questions:[
      'Share the exact watch reference, measured lug width and wrist circumference.',
      'Describe the strap profile, leather direction, stitching and buckle you prefer.',
      'Ask the maker to confirm attachment, length, thickness, material and price.',
    ],
  };
  return {
    heading:`What to decide for ${product.name.toLowerCase()}`,
    intro:'YellowCada’s public archive documents this product type or an earlier example. A new piece needs its own dimensions, material and finish confirmation.',
    questions:[
      'Share the intended use and any measurements or item that the piece must fit.',
      'Link a YellowCada archive example and describe the colour, texture or layout you like.',
      'Ask for a confirmed specification, current material options and individual quote.',
    ],
  };
}
