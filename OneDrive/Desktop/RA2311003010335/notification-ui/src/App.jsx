import { useEffect, useState } from "react";
import axios from "axios";

const url = "http://20.207.122.201/evaluation-service/notifications";

const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(url, {
          headers: {
            "x-api-key": "QkbpxH",
          },
        });

        let notifications = res.data.notifications || [];

        notifications.sort((a, b) => {
          if (priority[a.Type] !== priority[b.Type]) {
            return priority[b.Type] - priority[a.Type];
          }
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        setData(notifications.slice(0, 10));
      } catch (err) {
        console.log("API failed, using fallback");

        setData([
          { ID: 1, Type: "Placement", Message: "Placed at Google", Timestamp: "2026-05-02T09:00:00Z" },
          { ID: 2, Type: "Result", Message: "Result Declared", Timestamp: "2026-05-02T08:00:00Z" },
          { ID: 3, Type: "Event", Message: "Workshop", Timestamp: "2026-05-01T12:00:00Z" }
        ]);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Top 10 Notifications</h1>

      {data.map((n) => (
        <div key={n.ID} style={{
          border: "1px solid gray",
          margin: "10px",
          padding: "10px"
        }}>
          <h3>{n.Type}</h3>
          <p>{n.Message}</p>
          <small>{n.Timestamp}</small>
        </div>
      ))}
    </div>
  );
}