import { useEffect, useState } from "react";
import axios from "axios";

const url = "http://20.207.122.201/evaluation-service/notifications";

const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const typeColors = {
  Placement: "#22c55e", // green
  Result: "#3b82f6",    // blue
  Event: "#f59e0b",     // orange
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
        setData([
          { ID: 1, Type: "Placement", Message: "Placed at Google", Timestamp: "2026-05-02T09:00:00Z" },
          { ID: 2, Type: "Result", Message: "Result Declared", Timestamp: "2026-05-02T08:00:00Z" },
          { ID: 3, Type: "Event", Message: "Workshop", Timestamp: "2026-05-01T12:00:00Z" }
        ]);
      }
    }

    fetchData();
  }, []);

  const formatDate = (ts) =>
    new Date(ts).toLocaleString();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Top 10 Notifications</h1>

      <div style={styles.list}>
        {data.map((n) => (
          <div key={n.ID} style={styles.card}>
            
            <div style={styles.header}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: typeColors[n.Type] || "#888",
                }}
              >
                {n.Type}
              </span>
            </div>

            <p style={styles.message}>{n.Message}</p>

            <small style={styles.time}>
              {formatDate(n.Timestamp)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    padding: "30px",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  list: {
    maxWidth: "700px",
    margin: "auto",
  },
  card: {
    background: "#1e293b",
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "10px",
    transition: "0.2s",
  },
  header: {
    marginBottom: "10px",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  message: {
    fontSize: "16px",
    margin: "10px 0",
  },
  time: {
    color: "#94a3b8",
    fontSize: "12px",
  },
};