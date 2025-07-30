import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Wireless Headphones",
      price: 2999,
      image: "/images/headphones.jpg",
      desciption: "High-quality wireless headphones with noise cancellation.",
      cetagory: "Electronics",
    },
    {
      name: "Smartwatch Pro",
      price: 4999,
      image: "/images/smartwatch.jpg",
      desciption: "Feature-rich smartwatch with health tracking.",
      cetagory: "Wearables",
    },
    {
      name: "Gaming Mouse",
      price: 1599,
      image: "/images/gaming_mouse.jpg",
      desciption: "Ergonomic gaming mouse with customizable DPI.",
      cetagory: "Accessories",
    },
    {
      name: "Bluetooth Speaker",
      price: 1999,
      image: "/images/speaker.jpg",
      desciption: "Portable Bluetooth speaker with deep bass.",
      cetagory: "Audio",
    },
    {
      name: "4K Monitor",
      price: 8999,
      image: "/images/monitor.jpg",
      desciption: "27-inch 4K UHD monitor with HDR support.",
      cetagory: "Computers",
    },
    {
      name: "Mechanical Keyboard",
      price: 3499,
      image: "/images/keyboard.jpg",
      desciption: "RGB mechanical keyboard with blue switches.",
      cetagory: "Accessories",
    },
    {
      name: "Fitness Tracker",
      price: 2499,
      image: "/images/fitness_tracker.jpg",
      desciption: "Water-resistant fitness tracker with heart rate monitor.",
      cetagory: "Wearables",
    },
    {
      name: "Drone Camera",
      price: 12999,
      image: "/images/drone.jpg",
      desciption: "High-definition drone with 4K camera and GPS.",
      cetagory: "Gadgets",
    },
    {
      name: "E-book Reader",
      price: 3999,
      image: "/images/ebook_reader.jpg",
      desciption: "Lightweight e-book reader with glare-free display.",
      cetagory: "Electronics",
    },
    {
      name: "Action Camera",
      price: 5999,
      image: "/images/action_camera.jpg",
      desciption: "Compact action camera with waterproof casing.",
      cetagory: "Cameras",
    },
    {
      name: "Smart Home Hub",
      price: 3499,
      image: "/images/smart_home_hub.jpg",
      desciption: "Control all your smart devices with one hub.",
      cetagory: "Home Automation",
    },
    {
      name: "Noise Cancelling Earbuds",
      price: 2799,
      image: "/images/earbuds.jpg",
      desciption: "True wireless earbuds with active noise cancellation.",
      cetagory: "Audio",
    },
    {
      name: "Portable Charger",
      price: 1299,
      image: "/images/portable_charger.jpg",
      desciption: "10000mAh power bank with fast charging.",
      cetagory: "Accessories",
    },
    {
      name: "Smart Light Bulb",
      price: 799,
      image: "/images/smart_bulb.jpg",
      desciption: "Color-changing LED bulb controllable via app.",
      cetagory: "Home Automation",
    },
    {
      name: "Virtual Reality Headset",
      price: 14999,
      image: "/images/vr_headset.jpg",
      desciption: "Immersive VR headset compatible with multiple platforms.",
      cetagory: "Gaming",
    },
  ];

  await prisma.products.createMany({ data: products });

  console.log("✅ Added 15 products successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
