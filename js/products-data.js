const defaultProducts = [
  {
    "id": 8291636215978,
    "title": "Product AR/3D",
    "category": "3D & AR",
    "price": 60,
    "compareAtPrice": 70,
    "description": "Cheer on your favorite red and white team in eye-popping style with these red & white striped game overalls! High-quality modern design, realistic 3D viewing and augmented reality support.",
    "images": [
      "images/products/product_8291636215978.jpg"
    ],
    "colors": [
      "#ffffff",
      "#000000",
      "Gray"
    ],
    "sizes": [],
    "has3D": true,
    "modelSrc": "models/product-3D.glb",
    "posterSrc": "images/product-3D-poster.jpg"
  },
  {
    "id": 8291636740266,
    "title": "360 product",
    "category": "360 View",
    "price": 70,
    "compareAtPrice": 80,
    "description": "Fully interactive 360-degree product visualization. Rotate and inspect the object from every angle with high-fidelity detailing.",
    "images": [
      "images/products/product_8291636740266.jpg"
    ],
    "colors": [],
    "sizes": [],
    "has360": true,
    "images360Count": 39,
    "images360Pattern": "images/360/product360-{index}.jpg"
  },
  {
    "id": 1001,
    "title": "Sterownik LED Mono PR-MONO-12A",
    "category": "Sterowniki LED",
    "price": 49,
    "compareAtPrice": 59,
    "description": "Jednokanałowy bezprzewodowy sterownik LED Mono (2.4GHz RF, 12A max). Umożliwia płynną regulację jasności taśm jednokolorowych. Zasięg sterowania do 30m, praca w temperaturze -25~40°C.",
    "images": [
      "images/products/controller_mono.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/mono.mp4",
    "variants": [
      {
        "id": 1001,
        "name": "Mono",
        "image": "images/products/controller_mono.webp",
        "video": "videos/mono.mp4"
      },
      {
        "id": 1002,
        "name": "CCT",
        "image": "images/products/controller_cct.webp",
        "video": "videos/cct_hotel.mp4"
      },
      {
        "id": 1003,
        "name": "RGB",
        "image": "images/products/controller_rgb.webp",
        "video": "videos/rgb_pilot.mp4"
      },
      {
        "id": 1004,
        "name": "RGBW",
        "image": "images/products/controller_rgbw.webp",
        "video": "videos/SALON%20RGBW%20CZAD.mp4"
      },
      {
        "id": 1005,
        "name": "RGBCCT",
        "image": "images/products/controller_rgbcct.webp",
        "video": "videos/rgb_cct.mp4"
      }
    ]
  },
  {
    "id": 1002,
    "title": "Sterownik LED CCT PR-CCT-12A",
    "category": "Sterowniki LED",
    "price": 55,
    "compareAtPrice": 65,
    "description": "Dwukanałowy bezprzewodowy sterownik LED Dual White CCT (2.4GHz RF, 12A max). Przeznaczony do płynnej regulacji jasności oraz temperatury barwowej taśm CCT (ciepła-zimna biel).",
    "images": [
      "images/products/controller_cct.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/cct_hotel.mp4",
    "variants": [
      {
        "id": 1001,
        "name": "Mono",
        "image": "images/products/controller_mono.webp",
        "video": "videos/mono.mp4"
      },
      {
        "id": 1002,
        "name": "CCT",
        "image": "images/products/controller_cct.webp",
        "video": "videos/cct_hotel.mp4"
      },
      {
        "id": 1003,
        "name": "RGB",
        "image": "images/products/controller_rgb.webp",
        "video": "videos/rgb_pilot.mp4"
      },
      {
        "id": 1004,
        "name": "RGBW",
        "image": "images/products/controller_rgbw.webp",
        "video": "videos/SALON%20RGBW%20CZAD.mp4"
      },
      {
        "id": 1005,
        "name": "RGBCCT",
        "image": "images/products/controller_rgbcct.webp",
        "video": "videos/rgb_cct.mp4"
      }
    ]
  },
  {
    "id": 1003,
    "title": "Sterownik LED RGB PR-RGB-12A",
    "category": "Sterowniki LED",
    "price": 59,
    "compareAtPrice": 69,
    "description": "Trzykanałowy bezprzewodowy sterownik LED RGB (2.4GHz GFSK RF, 12A max). Pozwala wybrać dowolny kolor z palety 16 milionów barw i kontrolować nasycenie oraz jasność.",
    "images": [
      "images/products/controller_rgb.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/rgb_pilot.mp4",
    "variants": [
      {
        "id": 1001,
        "name": "Mono",
        "image": "images/products/controller_mono.webp",
        "video": "videos/mono.mp4"
      },
      {
        "id": 1002,
        "name": "CCT",
        "image": "images/products/controller_cct.webp",
        "video": "videos/cct_hotel.mp4"
      },
      {
        "id": 1003,
        "name": "RGB",
        "image": "images/products/controller_rgb.webp",
        "video": "videos/rgb_pilot.mp4"
      },
      {
        "id": 1004,
        "name": "RGBW",
        "image": "images/products/controller_rgbw.webp",
        "video": "videos/SALON%20RGBW%20CZAD.mp4"
      },
      {
        "id": 1005,
        "name": "RGBCCT",
        "image": "images/products/controller_rgbcct.webp",
        "video": "videos/rgb_cct.mp4"
      }
    ]
  },
  {
    "id": 1004,
    "title": "Sterownik LED RGBW PR-RGBW-12A",
    "category": "Sterowniki LED",
    "price": 65,
    "compareAtPrice": 75,
    "description": "Czterokanałowy bezprzewodowy sterownik LED RGBW (2.4GHz RF, 12A max). Obsługuje taśmy wielokolorowe z dodatkową diodą bieli (ciepłej, zimnej lub neutralnej).",
    "images": [
      "images/products/controller_rgbw.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/SALON%20RGBW%20CZAD.mp4",
    "variants": [
      {
        "id": 1001,
        "name": "Mono",
        "image": "images/products/controller_mono.webp",
        "video": "videos/mono.mp4"
      },
      {
        "id": 1002,
        "name": "CCT",
        "image": "images/products/controller_cct.webp",
        "video": "videos/cct_hotel.mp4"
      },
      {
        "id": 1003,
        "name": "RGB",
        "image": "images/products/controller_rgb.webp",
        "video": "videos/rgb_pilot.mp4"
      },
      {
        "id": 1004,
        "name": "RGBW",
        "image": "images/products/controller_rgbw.webp",
        "video": "videos/SALON%20RGBW%20CZAD.mp4"
      },
      {
        "id": 1005,
        "name": "RGBCCT",
        "image": "images/products/controller_rgbcct.webp",
        "video": "videos/rgb_cct.mp4"
      }
    ]
  },
  {
    "id": 1005,
    "title": "Sterownik LED RGBCCT PR-RGBCCT-12A",
    "category": "Sterowniki LED",
    "price": 69,
    "compareAtPrice": 79,
    "description": "Pięciokanałowy bezprzewodowy sterownik LED RGBCCT (2.4GHz RF, 12A max). Zaawansowane sterowanie taśmami wielokolorowymi z pełną regulacją temperatury bieli.",
    "images": [
      "images/products/controller_rgbcct.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/rgb_cct.mp4",
    "variants": [
      {
        "id": 1001,
        "name": "Mono",
        "image": "images/products/controller_mono.webp",
        "video": "videos/mono.mp4"
      },
      {
        "id": 1002,
        "name": "CCT",
        "image": "images/products/controller_cct.webp",
        "video": "videos/cct_hotel.mp4"
      },
      {
        "id": 1003,
        "name": "RGB",
        "image": "images/products/controller_rgb.webp",
        "video": "videos/rgb_pilot.mp4"
      },
      {
        "id": 1004,
        "name": "RGBW",
        "image": "images/products/controller_rgbw.webp",
        "video": "videos/SALON%20RGBW%20CZAD.mp4"
      },
      {
        "id": 1005,
        "name": "RGBCCT",
        "image": "images/products/controller_rgbcct.webp",
        "video": "videos/rgb_cct.mp4"
      }
    ]
  },
  {
    "id": 2001,
    "title": "Zasilacz LED Scharfer 12V 18W IP67",
    "category": "Zasilacze LED",
    "price": 39,
    "compareAtPrice": 49,
    "description": "Wodoodporny zasilacz LED Scharfer 12V o mocy 18W (model SCH-18-12) w klasie szczelności IP67. Zapewnia stabilne napięcie wyjściowe, pełną kompatybilność i 7-letnią niezawodną gwarancję.",
    "images": [
      "images/products/scharfer_18w.webp"
    ],
    "colors": [],
    "sizes": []
  },
  {
    "id": 2002,
    "title": "Zasilacz LED Scharfer 12V 30W IP67",
    "category": "Zasilacze LED",
    "price": 49,
    "compareAtPrice": 59,
    "description": "Hermetyczny zasilacz LED Scharfer 12V o mocy 30W IP67 (model SCH-30-12). Stabilne zasilanie dla domowych i meblowych instalacji LED. Powermax Technology Inside, 7 lat gwarancji.",
    "images": [
      "images/products/scharfer_30w.webp"
    ],
    "colors": [],
    "sizes": []
  },
  {
    "id": 2003,
    "title": "Zasilacz LED Scharfer 12V 60W IP67",
    "category": "Zasilacze LED",
    "price": 69,
    "compareAtPrice": 79,
    "description": "Wodoodporny zasilacz LED Scharfer 12V o mocy 60W IP67 (model SCH-60-12). Bezpieczne, stabilne zasilanie do średnich i wymagających instalacji oświetleniowych, 7 lat gwarancji.",
    "images": [
      "images/products/scharfer_60w.webp"
    ],
    "colors": [],
    "sizes": []
  },
  {
    "id": 2004,
    "title": "Zasilacz LED Scharfer 24V 100W IP67",
    "category": "Zasilacze LED",
    "price": 99,
    "compareAtPrice": 119,
    "description": "Wysokiej jakości wodoodporny zasilacz LED Scharfer 24V o mocy 100W IP67 (model SCH-100-24). Praca przy 100% obciążenia, pełna ochrona zwarciowa i przeciążeniowa, 7 lat gwarancji.",
    "images": [
      "images/products/scharfer_100w.webp"
    ],
    "colors": [],
    "sizes": []
  },
  {
    "id": 2005,
    "title": "Zasilacz LED Scharfer 24V 150W IP67",
    "category": "Zasilacze LED",
    "price": 139,
    "compareAtPrice": 169,
    "description": "Mocny hermetyczny zasilacz LED Scharfer 24V o mocy 150W IP67 (model SCH-150-24). Zaprojektowany z myślą o profesjonalnych, rozbudowanych systemach liniowych LED, 7 lat gwarancji.",
    "images": [
      "images/products/scharfer_150w.webp"
    ],
    "colors": [],
    "sizes": []
  },
  {
    "id": 3001,
    "title": "Taśma LED Delux Pro 24V 4000K 10m",
    "category": "Taśmy LED",
    "price": 149,
    "compareAtPrice": 179,
    "description": "Profesjonalna taśma LED Delux Pro 24V o barwie neutralnej 4000K, oparta na diodach SMD2835 (180 led/m, 10.6W/m). Oferuje strumień świetlny 2000 lm/m, szerokość podłoża 10mm, wskaźnik oddawania barw CRI80 oraz pełną 7-letnią gwarancję (PL7Y). Rolka 10m.",
    "images": [
      "images/products/tasma_4000k.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/mono.mp4"
  },
  {
    "id": 3002,
    "title": "Taśma LED Delux Pro 24V 3000K 10m",
    "category": "Taśmy LED",
    "price": 149,
    "compareAtPrice": 179,
    "description": "Profesjonalna polska taśma LED Delux Pro 24V o barwie ciepłej 3000K (180 led/m, strumień 1800 lm/m), oparta na wysokiej jakości diodach SMD2835. Rolka 10m z pełną 7-letnią gwarancją producenta.",
    "images": [
      "images/products/tasma_3000k.webp"
    ],
    "colors": [],
    "sizes": [],
    "video": "videos/mono.mp4"
  }
];

function getProducts() {
  if (typeof window !== 'undefined' && localStorage) {
    // Clear stale local storage cache with versioning
    const cacheVersion = "v6";
    const storedVersion = localStorage.getItem('sklepSC_products_version');
    if (storedVersion !== cacheVersion) {
      localStorage.removeItem('sklepSC_products');
      localStorage.setItem('sklepSC_products_version', cacheVersion);
    }

    const localStr = localStorage.getItem('sklepSC_products');
    if (localStr) {
      try {
        return JSON.parse(localStr);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return defaultProducts;
}

export const products = getProducts();
