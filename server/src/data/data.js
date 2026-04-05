const sampleListings = [
    {
      title: "3BHK Apartment in Sector 62",
      description: "Spacious apartment near IT hubs and metro connectivity.",
  
      price: 8500000,
      type: "buy",
  
      configuration: {
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2
      },
  
      area: {
        builtUp: 1450,
        carpet: 1200
      },
  
      location: {
        address: "Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201309",
        sector: "62",
  
        coordinates: {
          lat: 28.6270,
          lng: 77.3649
        }
      },
  
      images: [
        {
          url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
          isPrimary: true
        }
      ],
  
      details: {
        furnishing: "semi-furnished",
        parking: 1,
        facing: "east",
        floor: 5,
        totalFloors: 14,
        ownership: "freehold"
      },
  
      amenities: ["lift", "parking", "security", "power backup"],
  
      nearby: {
        schools: ["Delhi Public School"],
        metro: ["Noida Electronic City"],
        hospitals: ["Fortis Hospital"],
        malls: ["Shipra Mall"]
      },
  
      status: "active"
    },
  
    {
      title: "Luxury Villa in Gurgaon Sector 57",
      description: "Premium gated villa with private garden and parking.",
  
      price: 25000000,
      type: "buy",
  
      configuration: {
        bedrooms: 4,
        bathrooms: 4,
        balconies: 3
      },
  
      area: {
        builtUp: 3200,
        carpet: 2800
      },
  
      location: {
        address: "Sector 57",
        city: "Gurgaon",
        state: "Haryana",
        pincode: "122003",
        sector: "57",
  
        coordinates: {
          lat: 28.4220,
          lng: 77.0849
        }
      },
  
      images: [
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          isPrimary: true
        }
      ],
  
      details: {
        furnishing: "furnished",
        parking: 2,
        facing: "north",
        floor: 1,
        totalFloors: 2,
        ownership: "freehold"
      },
  
      amenities: ["garden", "security", "parking", "clubhouse"],
  
      nearby: {
        schools: ["Scottish High International"],
        metro: ["Huda City Centre"],
        hospitals: ["Medanta Hospital"],
        malls: ["MGF Mall"]
      },
  
      status: "active"
    },
  
    {
      title: "2BHK Flat in Indirapuram",
      description: "Affordable housing with good connectivity to Delhi.",
  
      price: 5500000,
      type: "buy",
  
      configuration: {
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1
      },
  
      area: {
        builtUp: 1100,
        carpet: 900
      },
  
      location: {
        address: "Indirapuram",
        city: "Ghaziabad",
        state: "Uttar Pradesh",
        pincode: "201014",
        sector: "Indirapuram",
  
        coordinates: {
          lat: 28.6345,
          lng: 77.3700
        }
      },
  
      images: [
        {
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
          isPrimary: true
        }
      ],
  
      details: {
        furnishing: "unfurnished",
        parking: 1,
        facing: "west",
        floor: 3,
        totalFloors: 10,
        ownership: "freehold"
      },
  
      amenities: ["lift", "security"],
  
      nearby: {
        schools: ["St. Teresa School"],
        metro: ["Vaishali Metro"],
        hospitals: ["Yashoda Hospital"],
        malls: ["Shipra Mall"]
      },
  
      status: "active"
    },
  
    {
      title: "1BHK Rental in Saket",
      description: "Compact apartment ideal for working professionals.",
  
      price: 18000,
      type: "rent",
  
      configuration: {
        bedrooms: 1,
        bathrooms: 1,
        balconies: 1
      },
  
      area: {
        builtUp: 600,
        carpet: 500
      },
  
      location: {
        address: "Saket",
        city: "Delhi",
        state: "Delhi",
        pincode: "110017",
  
        coordinates: {
          lat: 28.5245,
          lng: 77.2066
        }
      },
  
      images: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          isPrimary: true
        }
      ],
  
      details: {
        furnishing: "furnished",
        parking: 0,
        facing: "south",
        floor: 2,
        totalFloors: 4,
        ownership: "freehold"
      },
  
      amenities: ["wifi", "ac"],
  
      nearby: {
        schools: [],
        metro: ["Saket Metro"],
        hospitals: ["Max Hospital"],
        malls: ["Select Citywalk"]
      },
  
      status: "active"
    }
];
  
module.exports = { data: sampleListings };