// netlify/functions/notify-slack.js
export async function handler(event) {
  try {
    const webhook = process.env.WEBHOOK_URL;

    if (!webhook) {
      console.error("❌ No Slack webhook URL found.");
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing WEBHOOK_URL" }),
      };
    }

    // ✅ Customize your alert message here
    const payload = {
      text: `🚀 *Blacklight Watch* deployment or alert\nEnvironment: Production\nTime: ${new Date().toLocaleString()}\nStatus: ✅ Operational`,
    };

    // Send to Slack
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Slack error: ${res.statusText}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Notification sent to Slack" }),
    };
  } catch (err) {
    console.error("❌ Slack alert failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
