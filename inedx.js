<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Blacklight Watch</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #0f0f0f;
      color: #00ffcc;
      padding: 20px;
    }
    h1 {
      color: #ffffff;
    }
    #alertBox {
      white-space: pre-wrap;
      background: #1a1a1a;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #444;
    }
  </style>
</head>
<body>
  <h1>⚠️ Global Alerts</h1>
  <div id="alertBox">Loading alerts...</div>

  <script>
    async function fetchAlerts() {
      try {
        const response = await fetch("https:/https://live-w8od.onrender.com//status-api");
        const data = await response.json();
        document.getElementById("alertBox").innerText = JSON.stringify(data, null, 2);
      } catch (error) {
        document.getElementById("alertBox").innerText = "❌ Failed to fetch alerts.";
        console.error(error);
      }
    }

    fetchAlerts();
  </script>
</body>
</html>
