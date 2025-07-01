export default function MessgaeNotification() {
  const sendNotification = async () => {
    const payload = {
      notifications: [
        {
          platform: "line",
          channelId: "your_channel_id",
          to: "886987654321",
          settingId: "65a79cabd424330ac5c811b2",
          valueMap: {
            orderId: "OC2024010100001",
            orderDate: "2024-01-01 10:00:05",
            paymentMethod: "Credit Card",
          },
        },
      ],
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/messageNotification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`通知已發送！triggerId: ${result.triggerId}`);
      } else {
        alert("通知發送失敗");
      }
    } catch (err) {
      console.error("錯誤:", err);
    }
  };
  return (
    <>
      <button onClick={sendNotification}>CLICK</button>
    </>
  );
}
