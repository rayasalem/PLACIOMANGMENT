
import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`
  🚀 Placio OS Backend is running!
  ---------------------------------
  📡 API URL: http://localhost:${PORT}/api
  🔐 Security: Role-Based Access Control Enabled
  📅 Mode: Development/Demo
  `);
});
