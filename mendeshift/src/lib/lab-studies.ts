export const labStudies = [
  {
    "id": "linha-de-fuga",
    "prompt": "Photorealistic wide 3:2 architectural photograph, symmetrical eye-level composition inside a brutalist concrete corridor at dusk. A single narrow strip of saturated crimson light runs from the near floor to a distant doorway, drawing a sharp vanishing point. Soft charcoal shadows, visible concrete pores, light haze only at the doorway. 35mm film grain, precise verticals, cinematic contrast. No people, lettering, watermark or logos.",
    "pt": {
      "title": "Linha de fuga",
      "alt": "Corredor de concreto com uma linha vermelha no piso até o ponto de fuga."
    },
    "en": {
      "title": "Vanishing Point",
      "alt": "A concrete corridor with a red line leading toward a distant doorway."
    }
  },
  {
    "id": "memoria-fria",
    "prompt": "Wide 3:2 editorial still life. An unbranded translucent smoky-red mechanical keyboard keycap, oversized like a sculpture, resting diagonally on a block of polished graphite. Extremely close 85mm product photography, refracted vermilion on stone, grazing silver highlight, one crisply focused edge. Understated industrial design. No marks, characters, text, watermarks or logos.",
    "pt": {
      "title": "Memória fria",
      "alt": "Tecla de resina vermelha translúcida sobre uma base de grafite."
    },
    "en": {
      "title": "Cold Memory",
      "alt": "A translucent red keycap resting on graphite."
    }
  },
  {
    "id": "rastro",
    "prompt": "Wide 3:2 cinematic analog photograph of an anonymous dancer in a black coat passing from left to right through a single deep-red light beam in a charcoal concrete studio. Use rear-curtain flash to hold one sharp silhouette, with restrained red motion trails behind shoulders and legs. Full figure with breathing room. Sculptural shadows, believable motion, subtle film grain. No text, watermark or logos.",
    "pt": {
      "title": "Rastro",
      "alt": "Silhueta em movimento atravessa um feixe vermelho e deixa um rastro."
    },
    "en": {
      "title": "Afterimage",
      "alt": "A moving silhouette leaves a trail as it crosses a red beam."
    }
  },
  {
    "id": "mare-baixa",
    "prompt": "Wide 3:2 large-format black-and-white coastal photograph inspired by the rocky shore of Vitória, Brazil, without identifiable landmarks. Long exposure turns white Atlantic foam into soft ribbons between dark angular rocks; a tiny muted crimson buoy sits near the horizon. Low horizon, stormy silver sky, sharp foreground texture, analog grain. No people, text, watermark or logos.",
    "pt": {
      "title": "Maré baixa",
      "alt": "Ondas em longa exposição entre rochas escuras e uma boia vermelha no horizonte."
    },
    "en": {
      "title": "Low Tide",
      "alt": "Long-exposure waves between dark rocks, with a red buoy on the horizon."
    }
  },
  {
    "id": "interferencia",
    "prompt": "Wide 3:2 macro editorial photograph of two slightly rotated layers of fine black perforated metal mesh suspended in front of a diffuse red light source. Their overlap forms a real optical moiré pattern crossing the frame in diagonal waves. Crisp foreground mesh, gradual falloff to graphite shadows, a sliver of silver from one edge. Restrained black and vermilion palette. No text, watermark or logos.",
    "pt": {
      "title": "Interferência",
      "alt": "Duas malhas metálicas sobrepostas formam ondas sobre um fundo vermelho."
    },
    "en": {
      "title": "Interference",
      "alt": "Two overlapping metal meshes form waves over a red background."
    }
  }
];

export type LabStudy = { id: string; title: string; alt: string; prompt: string };
