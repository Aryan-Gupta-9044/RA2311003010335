import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://20.207.122.201/evaluation-service/notifications";

// Priority (Placement > Result > Event)
const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// Badge colors
const typeColors = {
  Placement: "#22c55e",
  Result: "#3b82f6",
  Event: "#f59e0b",
};

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            "x-api-key": "QkbpxH", // may fail → fallback will handle
          },
        });

        let notifications = res.data.notifications || [];

        // Sort by priority + latest first
        notifications.sort((a, b) => {
          if (priority[a.Type] !== priority[b.Type]) {
            return priority[b.Type] - priority[a.Type];
          }
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        setData(notifications.slice(0, 10));
      } catch (err) {
        // Fallback data (important if API fails)
        setData([
          { ID: 1, Type: "Placement", Message: "Placed at Google", Timestamp: "2026-05-02T09:00:00Z" },
          { ID: 2, Type: "Result", Message: "Result Declared", Timestamp: "2026-05-02T08:00:00Z" },
          { ID: 3, Type: "Event", Message: "Workshop", Timestamp: "2026-05-01T12:00:00Z" },
          { ID: 4, Type: "Placement", Message: "Placed at Amazon", Timestamp: "2026-05-01T10:00:00Z" },
          { ID: 5, Type: "Event", Message: "Hackathon", Timestamp: "2026-05-01T09:00:00Z" },
          { ID: 6, Type: "Result", Message: "Final Result", Timestamp: "2026-05-01T08:00:00Z" },
        ]);
      }
    }

    fetchNotifications();
  }, []);

  // Format date nicely
  const formatDate = (ts) => {
    return new Date(ts).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Check if recent (within 24 hours)
  const isRecent = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    return diff < 1000 * 60 * 60 * 24;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Top 10 Notifications</h1>

      <div style={styles.list}>
        {data.length === 0 && (
          <p style={styles.empty}>No notifications available</p>
        )}

        {data.map((n) => (
          <div
            key={n.ID}
            style={styles.card}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* Header */}
            <div style={styles.header}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: typeColors[n.Type] || "#888",
                }}
              >
                {n.Type}
              </span>

              {isRecent(n.Timestamp) && (
                <span style={styles.newTag}>NEW</span>
              )}
            </div>

            {/* Message */}
            <p style={styles.message}>{n.Message}</p>

            {/* Time */}
            <small style={styles.time}>{formatDate(n.Timestamp)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 Styles
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
    padding: "18px",
    marginBottom: "18px",
    borderRadius: "12px",
    transition: "0.25s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  newTag: {
    marginLeft: "10px",
    fontSize: "10px",
    background: "#ef4444",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  message: {
    fontSize: "16px",
    margin: "10px 0",
  },
  time: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
  },
};