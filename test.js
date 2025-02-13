import bcrypt from 'bcryptjs';

// In a test route or component
const testPassword = "mypassword";
const hashedPassword = await bcrypt.hash(testPassword, 10);
const isMatchTest = await bcrypt.compare(testPassword, hashedPassword);
console.log("Test hash verification:", isMatchTest); // Should be true
