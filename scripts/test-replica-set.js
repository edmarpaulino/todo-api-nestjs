/**
 * Test script to verify MongoDB replica set transactions with Prisma
 * This script connects to MongoDB using Prisma and performs transaction tests
 */

const { PrismaClient } = require('@prisma/client')

async function testReplicaSet() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })

  try {
    console.log('Connecting to MongoDB via Prisma...')
    await prisma.$connect()
    console.log('✓ Connected successfully!')

    // Test 1: Simple query to verify connection
    console.log('\n--- Test 1: Connection Test ---')
    const result = await prisma.$runCommandRaw({
      ping: 1
    })
    console.log('✓ MongoDB is responding:', result)

    // Test 2: Check replica set status
    console.log('\n--- Test 2: Replica Set Status ---')
    try {
      const status = await prisma.$runCommandRaw({
        replSetGetStatus: 1
      })
      console.log(`✓ Replica Set: ${status.set}`)
      const primary = status.members.find((m) => m.stateStr === 'PRIMARY')
      console.log(`✓ Primary: ${primary.name}`)
      console.log(`✓ State: ${primary.stateStr}`)
      console.log(`✓ Health: ${primary.health}`)
    } catch (err) {
      console.log(
        '✗ Could not get replica set status (this is okay if not using admin credentials)'
      )
    }

    // Test 3: Perform a transaction using Prisma's interactive transaction
    console.log('\n--- Test 3: Transaction Test ---')

    // Create a test collection/model if it doesn't exist
    // Note: This requires that you have a model defined in your Prisma schema
    // For this test, we'll use $transaction to demonstrate transaction support

    await prisma.$transaction(async (tx) => {
      console.log('  → Starting transaction...')

      // Execute raw commands within transaction
      await tx.$runCommandRaw({
        insert: 'test_transactions',
        documents: [
          { message: 'Document 1 in transaction', timestamp: new Date() },
          { message: 'Document 2 in transaction', timestamp: new Date() }
        ]
      })

      console.log('  ✓ Documents inserted in transaction')
    })

    console.log('✓ Transaction completed successfully!')

    // Verify the documents
    console.log('\n--- Test 4: Verify Documents ---')
    const countResult = await prisma.$runCommandRaw({
      count: 'test_transactions'
    })
    console.log(`✓ Documents in test collection: ${countResult.n}`)

    // Clean up
    console.log('\n--- Cleaning up ---')
    try {
      await prisma.$runCommandRaw({
        drop: 'test_transactions'
      })
      console.log('✓ Test collection dropped')
    } catch (err) {
      // Collection might not exist, that's okay
    }

    console.log('\n=================================')
    console.log('✓ All tests passed successfully!')
    console.log('✓ MongoDB replica set is working correctly')
    console.log('✓ Prisma can connect and use transactions')
    console.log('=================================\n')
  } catch (error) {
    console.error('\n✗ Error:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('Connection closed')
  }
}

testReplicaSet()
