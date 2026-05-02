const axios = require("axios");

const url = "http://20.207.122.201/evaluation-service/notifications";

// priority order
const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// logging middleware
function logger(fn, name) {
  return async function (...args) {
    console.log(`➡️ Entering: ${name}`);
    console.log("Input:", args);

    const start = Date.now();

    try {
      const result = await fn(...args);

      const end = Date.now();
      console.log(`✅ Exiting: ${name}`);
      console.log("Output:", result);
      console.log(`⏱ Time taken: ${end - start} ms\n`);

      return result;
    } catch (err) {
      console.log(`❌ Error in ${name}:`, err.message);
      throw err;
    }
  };
}

// fetch notifications
async function getNotifications() {
  try {
    const res = await axios.get(url, {
      headers: {
        "x-api-key": "QkbpxH", // trying with given access code
      },
    });

    return res.data.notifications || [];
  } catch (err) {
    console.log("API failed, using fallback data");

    // fallback data
    return [
      { ID: 1, Type: "Placement", Message: "Placed at Google", Timestamp: "2026-05-02T09:00:00Z" },
      { ID: 2, Type: "Result", Message: "Result Declared", Timestamp: "2026-05-02T08:00:00Z" },
      { ID: 3, Type: "Event", Message: "Workshop", Timestamp: "2026-05-01T12:00:00Z" },
      { ID: 4, Type: "Placement", Message: "Placed at Amazon", Timestamp: "2026-05-01T10:00:00Z" },
      { ID: 5, Type: "Event", Message: "Hackathon", Timestamp: "2026-05-01T09:00:00Z" }
    ];
  }
}

// sort based on priority + time
function arrangeNotifications(data) {
  return data.sort((a, b) => {
    if (priority[a.Type] !== priority[b.Type]) {
      return priority[b.Type] - priority[a.Type];
    }
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

// get top 10
function getTop(data) {
  return data.slice(0, 10);
}

// apply logger
const loggedGetNotifications = logger(getNotifications, "getNotifications");
const loggedArrange = logger(arrangeNotifications, "arrangeNotifications");
const loggedTop = logger(getTop, "getTop");

// main function
async function run() {
  try {
    const data = await loggedGetNotifications();

    if (!data.length) {
      console.log("No data found");
      return;
    }

    const sorted = await loggedArrange(data);
    const top10 = await loggedTop(sorted);

    console.log("\n🎯 Final Top 10 Notifications:\n");
    console.log(top10);
  } catch (err) {
    console.log("Something went wrong");
  }
}

run();