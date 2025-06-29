const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/status-api', (req, res) => {
  
  res.json({ message: 'stub response' });
});

app.listen(PORT, () => {
  console.log(`Blacklight backend running on port ${PORT}`);
});
