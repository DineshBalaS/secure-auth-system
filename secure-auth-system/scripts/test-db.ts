import { prisma } from '../lib/db' // Import from our new clean instance

async function main() {
  try {
    console.log("1. Connecting to Database via Adapter...")
    const user = await prisma.user.create({
      data: {
        email: `v7-test-${Date.now()}@example.com`,
        password: "hashedpassword123", 
        isVerified: true,
      },
    })
    console.log("2. SUCCESS: Created user:", user.email)
  } catch (error) {
    console.error("FAILURE:", error)
  }
}

main()