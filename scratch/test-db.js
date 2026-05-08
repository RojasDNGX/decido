
const { getOrCreateUser, getUserPlan } = require('./lib/users-db');
const { getDailyUsage } = require('./lib/usage-db');

try {
  console.log("--- Testing Database Layer ---");
  
  // Test User DB
  const testEmail = "test-" + Date.now() + "@example.com";
  const user = getOrCreateUser(testEmail, "Test User");
  console.log("User created/retrieved:", user);
  
  const plan = getUserPlan(testEmail);
  console.log("Plan retrieved:", plan);
  
  // Test Usage DB
  const today = new Date().toISOString().slice(0, 10);
  const usage = getDailyUsage("test-id", today);
  console.log("Daily usage retrieved:", usage);
  
  console.log("--- DB Tests Passed! ---");
  process.exit(0);
} catch (e) {
  console.error("--- DB Test Failed! ---");
  console.error(e);
  process.exit(1);
}
