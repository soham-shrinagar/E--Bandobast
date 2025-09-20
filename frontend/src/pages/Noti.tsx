import { useState } from "react";

// Define the type for a notification
interface Notification {
  phoneNumber: string;
  message: string;
  timestamp: string;
  status: "Delivered" | "Failed";
}

export default function NotificationSender() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);

  const handleSendNotification = async (): Promise<void> => {
    if (!phoneNumber || !message) {
      alert("Phone number and message are required");
      return;
    }

    setIsSending(true);
    
    try {
      // This would be your API endpoint to send notifications
      const response = await fetch("http://localhost:3000/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert("Notification sent successfully!");
        // Add to history
        setNotificationHistory(prev => [{
          phoneNumber,
          message,
          timestamp: new Date().toLocaleString(),
          status: "Delivered" as const
        }, ...prev]);
        
        // Clear form
        setPhoneNumber("");
        setMessage("");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification. Please try again.");
      
      // Add to history as failed
      setNotificationHistory(prev => [{
        phoneNumber,
        message,
        timestamp: new Date().toLocaleString(),
        status: "Failed" as const
      }, ...prev]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-blue-900 text-white py-4 px-6 rounded-t-lg border-b-4 border-yellow-400">
            <h1 className="text-2xl font-bold">Personnel Deployment Tool</h1>
            <p className="text-sm text-blue-100">Goa Police Department</p>
          </div>
          <div className="bg-white py-3 px-6 rounded-b-lg shadow-sm">
            <p className="text-md text-gray-700 font-medium">Mobile Notification System</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Send Notification</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your notification message here"
                ></textarea>
              </div>
              
              <button
                onClick={handleSendNotification}
                disabled={isSending}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              >
                {isSending ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </div>

          {/* Notification History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Notification History</h2>
            
            {notificationHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications sent yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notificationHistory.map((notification, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-blue-700">{notification.phoneNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notification.status === "Delivered" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {notification.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white py-3 px-6 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600">Government of Goa • Police Department</p>
          </div>
        </div>
      </div>
    </div>
  );
}