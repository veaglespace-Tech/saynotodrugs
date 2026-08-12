async function testApi() {
  try {
    const res = await fetch("http://localhost:5000/api/pledges/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User 2",
        mobile: "8888888888",
        email: "test2@example.com",
        profession: "Student",
        city: "Mumbai",
        state: "Maharashtra",
        campaignId: 1,
        pledgeText: "I pledge to say NO to drugs.",
        language: "english"
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
testApi();
