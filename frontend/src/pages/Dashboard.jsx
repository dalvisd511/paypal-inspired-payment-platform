import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("0.00");
  const [txs, setTxs] = useState([]);
  const [addAmount, setAddAmount] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const loadData = async () => {
    setError("");
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        api.get("payments/wallet/"),
        api.get("payments/transactions/"),
      ]);
      setBalance(walletRes.data.balance);
      setTxs(txRes.data);
    } catch (err) {
      setError("Failed to load wallet data. Please login again.");
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddMoney = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("payments/wallet/add/", { amount: addAmount });
      setAddAmount("");
      await loadData();
    } catch {
      setError("Failed to add money.");
    }
  };

  const onSendMoney = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("payments/send/", {
        receiver_email: receiverEmail,
        amount: sendAmount,
      });
      setReceiverEmail("");
      setSendAmount("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send money (check balance / receiver).");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, marginTop: 12 }}>
        <h3>Wallet Balance</h3>
        {loading ? <p>Loading...</p> : <h1>£{balance}</h1>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Add Money</h3>
          <form onSubmit={onAddMoney}>
            <input
              type="number"
              step="0.01"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Amount"
              required
            />
            <button type="submit" style={{ marginLeft: 8 }}>Add</button>
          </form>
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Send Money</h3>
          <form onSubmit={onSendMoney}>
            <input
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              placeholder="Receiver email"
              required
            />
            <br /><br />
            <input
              type="number"
              step="0.01"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="Amount"
              required
            />
            <button type="submit" style={{ marginLeft: 8 }}>Send</button>
          </form>
        </div>
      </div>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <h3>Transactions</h3>
        {txs.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {txs.map((t) => (
              <li key={t.id}>
                {t.sender || "System"} → {t.receiver || "Unknown"} | £{t.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
